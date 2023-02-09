Module['file'] = Module['file'] || function file(initialCapacity = 256) {
  let cursor = 0;
  let usedBytes = 0;
  let contents = new Uint8Array(initialCapacity);
  return {
    'contents': function () {
      return contents.slice(0, usedBytes);
    },
    'seek': function (offset) {
      // offset in bytes
      cursor = offset;
    },
    'write': function (data) {
      const size = data.byteLength;
      expand(cursor + size);
      contents.set(data, cursor);
      cursor += size;
      usedBytes = Math.max(usedBytes, cursor);
      return size;
    },
  };

  function expand (newCapacity) {
    var prevCapacity = contents.length;
    if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
    // avoid overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(
      newCapacity,
      (prevCapacity *
        (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>>
        0
    );
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
    const oldContents = contents;
    contents = new Uint8Array(newCapacity); // Allocate new storage.
    if (usedBytes > 0) contents.set(oldContents.subarray(0, usedBytes), 0);
  }
}

Module['create_buffer'] = function create_buffer (size) {
  return Module['_malloc'](size);
};

Module['free_buffer'] = function free_buffer (pointer) {
  return Module['_free'](pointer);
};

Module['createHardEncoder'] = function createHardEncoder(settings = {}) {
  const START_CODE = new Uint8Array([0, 0, 0, 1]);

  const {
    width, height, fps = 30,
    groupOfPictures = 20,
    fragmentation = false, sequential = false, hevc = false,
    format = "annexb",
    // codec = "avc1.420034", // Baseline 4.2
    // codec = "avc1.4d0034", // Main 5.2
    codec = "avc1.640834", // High
    acceleration,
    bitrate,
    error,
    encoderOptions = {},
    // flushFrequency = 10,
  } = settings;

  const file = Module['file']();
  const mux = Module['create_muxer'](
    { width, height, fps,
      fragmentation, sequential, hevc, },
    mux_write
  );
  const flushFrequency = groupOfPictures;

  const config = {
    codec, width, height,
    avc: {
      format,
    },
    // may cause some fail
    // hardwareAcceleration: acceleration,
    // There is a bug on macOS if this is greater than 30 fps
    // framerate: fps,
    latencyMode: "realtime", // 只有设置为realtime时，windows和mac下对bitrate的表现才一致
    alpha: "discard",
    bitrate,
    ...encoderOptions,
  };

  if (typeof VideoEncoder !== "function" || !VideoEncoder.isConfigSupported(config)) {
    return false;
  }

  let frameIndex = 0;

  const encoder = new VideoEncoder({
    output(chunk, opts) {
      writeAVC(chunk, opts);
    },
    error(e) {
      if (error) error(e);
      else console.error(e);
    },
  });

  encoder.configure(config);

  return {
    'end': async function () {
      if (ended) {
        throw new Error('Attempting to end() an encoder that is already finished');
      }
      ended = true;
      await encoder.flush();
      encoder.close();
      Module['finalize_muxer'](mux);
      return file['contents']();
    },
    'encodeRGB': async function (bitmap) {
      // TODO: check!!
      // if (buffer.length !== (width * height * stride)) {
      //   throw new Error('Expected buffer to be sized (width * height * ' + stride + ')');
      // }
      const timestamp = (1 / fps) * frameIndex * 1000000;
      const keyFrame = frameIndex % groupOfPictures === 0;
      const frame = new VideoFrame(bitmap, { 
        timestamp,
        // duration: duration, // TODO: set
        alpha: "discard",
      });
      encoder.encode(frame, { keyFrame });
      frame.close();
      if (frameIndex > 0 && keyFrame) {
        await encoder.flush();
      }
      frameIndex++;
    },
  };

  function mux_write(data_ptr, size, offset) {
    // seek to byte offset in file
    file.seek(offset);
    // get subarray of memory we are writing
    const data = Module['HEAPU8'].subarray(data_ptr, data_ptr + size);
    // write into virtual file
    return file.write(data) !== data.byteLength;
  }

  function write_nal(uint8) {
    const p = Module['_malloc'](uint8.byteLength);
    Module['HEAPU8'].set(uint8, p);
    Module['mux_nal'](mux, p, uint8.byteLength);
    Module['_free'](p);
  }

  function writeAVC(chunk, opts) {
    let avccConfig = null;

    let description;
    if (opts) {
      if (opts.description) {
        description = opts.description;
      }
      if (opts.decoderConfig && opts.decoderConfig.description) {
        description = opts.decoderConfig.description;
      }
    }

    if (description) {
      try {
        avccConfig = parseAVCC(description);
      } catch (err) {
        error(err);
        return;
      }
    }

    const nal = [];
    if (avccConfig) {
      avccConfig.sps_list.forEach((sps) => {
        nal.push(START_CODE);
        nal.push(sps);
      });
      avccConfig.pps_list.forEach((pps) => {
        nal.push(START_CODE);
        nal.push(pps);
      });
    }

    if (format === "annexb") {
      const uint8 = new Uint8Array(chunk.byteLength);
      chunk.copyTo(uint8);
      nal.push(uint8);
    } else {
      try {
        const arrayBuf = new ArrayBuffer(chunk.byteLength);
        chunk.copyTo(arrayBuf);
        convertAVCToAnnexBInPlaceForLength4(arrayBuf).forEach((sub) => {
          nal.push(START_CODE);
          nal.push(sub);
        });
      } catch (err) {
        error(err);
        return;
      }
    }

    write_nal(concatBuffers(nal));
  }

  function concatBuffers(arrays) {
    // Calculate byteSize from all arrays
    const size = arrays.reduce((a, b) => a + b.byteLength, 0);
    // Allcolate a new buffer
    const result = new Uint8Array(size);
    let offset = 0;
    for (let i = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      result.set(arr, offset);
      offset += arr.byteLength;
    }
    return result;
  }

  function convertAVCToAnnexBInPlaceForLength4(arrayBuf) {
    const kLengthSize = 4;
    let pos = 0;
    const chunks = [];
    const size = arrayBuf.byteLength;
    const uint8 = new Uint8Array(arrayBuf);
    while (pos + kLengthSize < size) {
      // read uint 32, 4 byte NAL length
      let nal_length = uint8[pos];
      nal_length = (nal_length << 8) + uint8[pos + 1];
      nal_length = (nal_length << 8) + uint8[pos + 2];
      nal_length = (nal_length << 8) + uint8[pos + 3];

      chunks.push(new Uint8Array(arrayBuf, pos + kLengthSize, nal_length));
      if (nal_length == 0) throw new Error("Error: invalid nal_length 0");
      pos += kLengthSize + nal_length;
    }
    return chunks;
  }

  function parseAVCC(avcc) {
    const view = new DataView(avcc);
    let off = 0;
    const version = view.getUint8(off++);
    const profile = view.getUint8(off++);
    const compat = view.getUint8(off++);
    const level = view.getUint8(off++);
    const length_size = (view.getUint8(off++) & 0x3) + 1;
    if (length_size !== 4)
      throw new Error("Expected length_size to indicate 4 bytes");
    const numSPS = view.getUint8(off++) & 0x1f;
    const sps_list = [];
    for (let i = 0; i < numSPS; i++) {
      const sps_len = view.getUint16(off, false);
      off += 2;
      const sps = new Uint8Array(view.buffer, off, sps_len);
      sps_list.push(sps);
      off += sps_len;
    }
    const numPPS = view.getUint8(off++);
    const pps_list = [];
    for (let i = 0; i < numPPS; i++) {
      const pps_len = view.getUint16(off, false);
      off += 2;
      const pps = new Uint8Array(view.buffer, off, pps_len);
      pps_list.push(pps);
      off += pps_len;
    }
    return {
      offset: off,
      version,
      profile,
      compat,
      level,
      length_size,
      pps_list,
      sps_list,
      numSPS,
    };
  }

}

// Expose simpler end-user API for encoding
Module['createSoftEncoder'] = function createSoftEncoder(settings = {}) {
  const width = settings['width'];
  const height = settings['height'];
  const stride = settings['stride'] || 4;
  if (!width || !height) throw new Error("width and height must be > 0");

  const file = Module['file']();

  let _yuv_pointer = null;
  let _rgb_pointer = null;

  let ended = false;

  const cfg = Object.assign({}, settings);
  delete cfg['stride'];
  const encoder_pointer = Module['create_encoder'](cfg, write);

  function getYUV () {
    if (_yuv_pointer == null && !ended) {
      _yuv_pointer = Module['create_buffer']((width * height * 3) / 2);
    }
    return _yuv_pointer;
  }

  function getRGB () {
    if (_rgb_pointer == null && !ended) {
      _rgb_pointer = Module['create_buffer'](width * height * stride);
    }
    return _rgb_pointer;
  }

  return {
    'memory': function () {
      return Module['HEAPU8'];
    },
    'getYUVPointer': getYUV,
    'getRGBPointer': getRGB,
    'end': function () {
      if (ended) {
        throw new Error('Attempting to end() an encoder that is already finished');
      }
      ended = true;
      Module['finalize_encoder'](encoder_pointer);
      if (_yuv_pointer != null) Module['free_buffer'](_yuv_pointer);
      if (_rgb_pointer != null) Module['free_buffer'](_rgb_pointer);
      return file['contents']();
    },
    'encodeRGBPointer': function () {
      const rgb = getRGB();
      const yuv = getYUV();
      Module['encode_rgb'](encoder_pointer, rgb, stride, yuv);
    },
    'encodeYUVPointer': function () {
      const yuv = getYUV();
      Module['encode_yuv'](encoder_pointer, yuv);
    },
    'encodeRGB': function (buffer) {
      if (buffer.length !== (width * height * stride)) {
        throw new Error('Expected buffer to be sized (width * height * ' + stride + ')');
      }
      const rgb = getRGB();
      const yuv = getYUV();
      Module['HEAPU8'].set(buffer, rgb);
      Module['encode_rgb'](encoder_pointer, rgb, stride, yuv);
    },
    'encodeYUV': function (buffer) {
      if (buffer.length !== (width * height * 3) / 2) {
        throw new Error('Expected buffer to be sized (width * height * 3) / 2');
      }
      const yuv = getYUV();
      Module['HEAPU8'].set(buffer, yuv);
      Module['encode_yuv'](encoder_pointer, yuv);
    },
  };

  function write(pointer, size, offset) {
    file['seek'](offset);
    const data = Module['HEAPU8'].subarray(pointer, pointer + size);
    return file['write'](data) !== data.byteLength;
  }
}

Module['locateFile'] = function locateFileDefault (path, dir) {
  if (Module['simd']) {
    path = path.replace(/\.wasm$/i, '.simd.wasm');
  }
  if (Module['getWasmPath']) {
    return Module['getWasmPath'](path, dir, Module['simd']);
  } else {
    return dir + path;
  }
};

Module['create'] = function createEncoder (opts) {
  return Module['createHardEncoder'](opts) || Module['createSoftEncoder'](opts);
}
