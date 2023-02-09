
var Module = (() => {
  var _scriptDir = import.meta.url;
  
  return (
function(Module) {
  Module = Module || {};

var Module=typeof Module!="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});Module["file"]=Module["file"]||function file(initialCapacity=256){let cursor=0;let usedBytes=0;let contents=new Uint8Array(initialCapacity);return{"contents":function(){return contents.slice(0,usedBytes)},"seek":function(offset){cursor=offset},"write":function(data){const size=data.byteLength;expand(cursor+size);contents.set(data,cursor);cursor+=size;usedBytes=Math.max(usedBytes,cursor);return size}};function expand(newCapacity){var prevCapacity=contents.length;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);const oldContents=contents;contents=new Uint8Array(newCapacity);if(usedBytes>0)contents.set(oldContents.subarray(0,usedBytes),0)}};Module["create_buffer"]=function create_buffer(size){return Module["_malloc"](size)};Module["free_buffer"]=function free_buffer(pointer){return Module["_free"](pointer)};Module["createSoftEncoder"]=function createSoftEncoder(settings={}){const width=settings["width"];const height=settings["height"];const stride=settings["stride"]||4;if(!width||!height)throw new Error("width and height must be > 0");const file=Module["file"]();let _yuv_pointer=null;let _rgb_pointer=null;let ended=false;const cfg=Object.assign({},settings);delete cfg["stride"];const encoder_pointer=Module["create_encoder"](cfg,write);function getYUV(){if(_yuv_pointer==null&&!ended){_yuv_pointer=Module["create_buffer"](width*height*3/2)}return _yuv_pointer}function getRGB(){if(_rgb_pointer==null&&!ended){_rgb_pointer=Module["create_buffer"](width*height*stride)}return _rgb_pointer}return{format:"buffer","memory":function(){return Module["HEAPU8"]},"getYUVPointer":getYUV,"getRGBPointer":getRGB,"end":function(){if(ended){throw new Error("Attempting to end() an encoder that is already finished")}ended=true;Module["finalize_encoder"](encoder_pointer);if(_yuv_pointer!=null)Module["free_buffer"](_yuv_pointer);if(_rgb_pointer!=null)Module["free_buffer"](_rgb_pointer);return file["contents"]()},"encodeRGBPointer":function(){const rgb=getRGB();const yuv=getYUV();Module["encode_rgb"](encoder_pointer,rgb,stride,yuv)},"encodeYUVPointer":function(){const yuv=getYUV();Module["encode_yuv"](encoder_pointer,yuv)},"encodeRGB":function(buffer){if(buffer.length!==width*height*stride){throw new Error("Expected buffer to be sized (width * height * "+stride+")")}const rgb=getRGB();const yuv=getYUV();Module["HEAPU8"].set(buffer,rgb);Module["encode_rgb"](encoder_pointer,rgb,stride,yuv)},"encodeYUV":function(buffer){if(buffer.length!==width*height*3/2){throw new Error("Expected buffer to be sized (width * height * 3) / 2")}const yuv=getYUV();Module["HEAPU8"].set(buffer,yuv);Module["encode_yuv"](encoder_pointer,yuv)}};function write(pointer,size,offset){file["seek"](offset);const data=Module["HEAPU8"].subarray(pointer,pointer+size);return file["write"](data)!==data.byteLength}};Module["locateFile"]=function locateFileDefault(path,dir){if(Module["simd"]){path=path.replace(/\.wasm$/i,".simd.wasm")}if(Module["getWasmPath"]){return Module["getWasmPath"](path,dir,Module["simd"])}else{return dir+path}};Module["createHardEncoder"]=function createHardEncoder(opts){return createWebCodecsEncoderWithModule(Module,opts)};Module["create"]=function createEncoder(opts){if(opts.preferSoftEncoder)return Module["createSoftEncoder"](opts);return Module["createHardEncoder"](opts)||Module["createSoftEncoder"](opts)};var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var POINTER_SIZE=4;var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var str="";while(!(idx>=endIdx)){var u0=heapOrArray[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}var wasmBinaryFile;if(Module["locateFile"]){wasmBinaryFile="mp4-encoder.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}}else{wasmBinaryFile=new URL("mp4-encoder.wasm",import.meta.url).toString()}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["x"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["B"];addOnInit(Module["asm"]["y"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);readyPromiseReject(e)}}instantiateAsync().catch(readyPromiseReject);return{}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])}function __embind_register_bigint(primitiveType,name,size,minRange,maxRange){}function getShiftFromSize(size){switch(size){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+size)}}function embind_init_charCodes(){var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i)}embind_charCodes=codes}var embind_charCodes=undefined;function readLatin1String(ptr){var ret="";var c=ptr;while(HEAPU8[c]){ret+=embind_charCodes[HEAPU8[c++]]}return ret}var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var char_0=48;var char_9=57;function makeLegalFunctionName(name){if(undefined===name){return"_unknown"}name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return"_"+name}return name}function createNamedFunction(name,body){name=makeLegalFunctionName(name);return new Function("body","return function "+name+"() {\n"+'    "use strict";'+"    return body.apply(this, arguments);\n"+"};\n")(body)}function extendError(baseErrorType,errorName){var errorClass=createNamedFunction(errorName,function(message){this.name=errorName;this.message=message;var stack=new Error(message).stack;if(stack!==undefined){this.stack=this.toString()+"\n"+stack.replace(/^Error(:[^\n]*)?\n/,"")}});errorClass.prototype=Object.create(baseErrorType.prototype);errorClass.prototype.constructor=errorClass;errorClass.prototype.toString=function(){if(this.message===undefined){return this.name}else{return this.name+": "+this.message}};return errorClass}var BindingError=undefined;function throwBindingError(message){throw new BindingError(message)}var InternalError=undefined;function throwInternalError(message){throw new InternalError(message)}function whenDependentTypesAreResolved(myTypes,dependentTypes,getTypeConverters){myTypes.forEach(function(type){typeDependencies[type]=dependentTypes});function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count")}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i])}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach((dt,i)=>{if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt]}else{unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[]}awaitingDependencies[dt].push(()=>{typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters)}})}});if(0===unregisteredTypes.length){onComplete(typeConverters)}}function registerType(rawType,registeredInstance,options={}){if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}var name=registeredInstance.name;if(!rawType){throwBindingError('type "'+name+'" must have a positive integer typeid pointer')}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else{throwBindingError("Cannot register type '"+name+"' twice")}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(cb=>cb())}}function __embind_register_bool(rawType,name,size,trueValue,falseValue){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return!!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":8,"readValueFromPointer":function(pointer){var heap;if(size===1){heap=HEAP8}else if(size===2){heap=HEAP16}else if(size===4){heap=HEAP32}else{throw new TypeError("Unknown boolean type size: "+name)}return this["fromWireType"](heap[pointer>>shift])},destructorFunction:null})}var emval_free_list=[];var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle){if(handle>4&&0===--emval_handle_array[handle].refcount){emval_handle_array[handle]=undefined;emval_free_list.push(handle)}}function count_emval_handles(){var count=0;for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){++count}}return count}function get_first_emval(){for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){return emval_handle_array[i]}}return null}function init_emval(){Module["count_emval_handles"]=count_emval_handles;Module["get_first_emval"]=get_first_emval}var Emval={toValue:handle=>{if(!handle){throwBindingError("Cannot use deleted val. handle = "+handle)}return emval_handle_array[handle].value},toHandle:value=>{switch(value){case undefined:return 1;case null:return 2;case true:return 3;case false:return 4;default:{var handle=emval_free_list.length?emval_free_list.pop():emval_handle_array.length;emval_handle_array[handle]={refcount:1,value:value};return handle}}}};function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAP32[pointer>>2])}function __embind_register_emval(rawType,name){name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(handle){var rv=Emval.toValue(handle);__emval_decref(handle);return rv},"toWireType":function(destructors,value){return Emval.toHandle(value)},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null})}function floatReadValueFromPointer(name,shift){switch(shift){case 2:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>2])};case 3:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>3])};default:throw new TypeError("Unknown float type: "+name)}}function __embind_register_float(rawType,name,size){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(value){return value},"toWireType":function(destructors,value){return value},"argPackAdvance":8,"readValueFromPointer":floatReadValueFromPointer(name,shift),destructorFunction:null})}function new_(constructor,argumentList){if(!(constructor instanceof Function)){throw new TypeError("new_ called with constructor type "+typeof constructor+" which is not a function")}var dummy=createNamedFunction(constructor.name||"unknownFunctionName",function(){});dummy.prototype=constructor.prototype;var obj=new dummy;var r=constructor.apply(obj,argumentList);return r instanceof Object?r:obj}function runDestructors(destructors){while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr)}}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=false;for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){needsDestructorStack=true;break}}var returns=argTypes[0].name!=="void";var argsList="";var argsListWired="";for(var i=0;i<argCount-2;++i){argsList+=(i!==0?", ":"")+"arg"+i;argsListWired+=(i!==0?", ":"")+"arg"+i+"Wired"}var invokerFnBody="return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n"+"if (arguments.length !== "+(argCount-2)+") {\n"+"throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount-2)+" args!');\n"+"}\n";if(needsDestructorStack){invokerFnBody+="var destructors = [];\n"}var dtorStack=needsDestructorStack?"destructors":"null";var args1=["throwBindingError","invoker","fn","runDestructors","retType","classParam"];var args2=[throwBindingError,cppInvokerFunc,cppTargetFunc,runDestructors,argTypes[0],argTypes[1]];if(isClassMethodFunc){invokerFnBody+="var thisWired = classParam.toWireType("+dtorStack+", this);\n"}for(var i=0;i<argCount-2;++i){invokerFnBody+="var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";args1.push("argType"+i);args2.push(argTypes[i+2])}if(isClassMethodFunc){argsListWired="thisWired"+(argsListWired.length>0?", ":"")+argsListWired}invokerFnBody+=(returns?"var rv = ":"")+"invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";if(needsDestructorStack){invokerFnBody+="runDestructors(destructors);\n"}else{for(var i=isClassMethodFunc?1:2;i<argTypes.length;++i){var paramName=i===1?"thisWired":"arg"+(i-2)+"Wired";if(argTypes[i].destructorFunction!==null){invokerFnBody+=paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";args1.push(paramName+"_dtor");args2.push(argTypes[i].destructorFunction)}}}if(returns){invokerFnBody+="var ret = retType.fromWireType(rv);\n"+"return ret;\n"}else{}invokerFnBody+="}\n";args1.push(invokerFnBody);var invokerFunction=new_(Function,args1).apply(null,args2);return invokerFunction}function ensureOverloadTable(proto,methodName,humanName){if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(){if(!proto[methodName].overloadTable.hasOwnProperty(arguments.length)){throwBindingError("Function '"+humanName+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+proto[methodName].overloadTable+")!")}return proto[methodName].overloadTable[arguments.length].apply(this,arguments)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc}}function exposePublicSymbol(name,value,numArguments){if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError("Cannot register public name '"+name+"' twice")}ensureOverloadTable(Module,name,name);if(Module.hasOwnProperty(numArguments)){throwBindingError("Cannot register multiple overloads of a function with the same number of arguments ("+numArguments+")!")}Module[name].overloadTable[numArguments]=value}else{Module[name]=value;if(undefined!==numArguments){Module[name].numArguments=numArguments}}}function heap32VectorToArray(count,firstElement){var array=[];for(var i=0;i<count;i++){array.push(HEAPU32[firstElement+i*4>>2])}return array}function replacePublicSymbol(name,value,numArguments){if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistant public symbol")}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value}else{Module[name]=value;Module[name].argCount=numArguments}}function dynCallLegacy(sig,ptr,args){var f=Module["dynCall_"+sig];return args&&args.length?f.apply(null,[ptr].concat(args)):f.call(null,ptr)}var wasmTableMirror=[];function getWasmTableEntry(funcPtr){var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func}function dynCall(sig,ptr,args){if(sig.includes("j")){return dynCallLegacy(sig,ptr,args)}var rtn=getWasmTableEntry(ptr).apply(null,args);return rtn}function getDynCaller(sig,ptr){var argCache=[];return function(){argCache.length=0;Object.assign(argCache,arguments);return dynCall(sig,ptr,argCache)}}function embind__requireFunction(signature,rawFunction){signature=readLatin1String(signature);function makeDynCaller(){if(signature.includes("j")){return getDynCaller(signature,rawFunction)}return getWasmTableEntry(rawFunction)}var fp=makeDynCaller();if(typeof fp!="function"){throwBindingError("unknown function pointer with signature "+signature+": "+rawFunction)}return fp}var UnboundTypeError=undefined;function getTypeName(type){var ptr=___getTypeName(type);var rv=readLatin1String(ptr);_free(ptr);return rv}function throwUnboundTypeError(message,types){var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true}types.forEach(visit);throw new UnboundTypeError(message+": "+unboundTypes.map(getTypeName).join([", "]))}function __embind_register_function(name,argCount,rawArgTypesAddr,signature,rawInvoker,fn){var argTypes=heap32VectorToArray(argCount,rawArgTypesAddr);name=readLatin1String(name);rawInvoker=embind__requireFunction(signature,rawInvoker);exposePublicSymbol(name,function(){throwUnboundTypeError("Cannot call "+name+" due to unbound types",argTypes)},argCount-1);whenDependentTypesAreResolved([],argTypes,function(argTypes){var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));replacePublicSymbol(name,craftInvokerFunction(name,invokerArgsArray,null,rawInvoker,fn),argCount-1);return[]})}function integerReadValueFromPointer(name,shift,signed){switch(shift){case 0:return signed?function readS8FromPointer(pointer){return HEAP8[pointer]}:function readU8FromPointer(pointer){return HEAPU8[pointer]};case 1:return signed?function readS16FromPointer(pointer){return HEAP16[pointer>>1]}:function readU16FromPointer(pointer){return HEAPU16[pointer>>1]};case 2:return signed?function readS32FromPointer(pointer){return HEAP32[pointer>>2]}:function readU32FromPointer(pointer){return HEAPU32[pointer>>2]};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_integer(primitiveType,name,size,minRange,maxRange){name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295}var shift=getShiftFromSize(size);var fromWireType=value=>value;if(minRange===0){var bitshift=32-8*size;fromWireType=value=>value<<bitshift>>>bitshift}var isUnsignedType=name.includes("unsigned");var checkAssertions=(value,toTypeName)=>{};var toWireType;if(isUnsignedType){toWireType=function(destructors,value){checkAssertions(value,this.name);return value>>>0}}else{toWireType=function(destructors,value){checkAssertions(value,this.name);return value}}registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":toWireType,"argPackAdvance":8,"readValueFromPointer":integerReadValueFromPointer(name,shift,minRange!==0),destructorFunction:null})}function __embind_register_memory_view(rawType,dataTypeIndex,name){var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){handle=handle>>2;var heap=HEAPU32;var size=heap[handle];var data=heap[handle+1];return new TA(buffer,data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":8,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true})}function __embind_register_std_string(rawType,name){name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var payload=value+4;var str;if(stdStringIsUTF8){var decodeStartPtr=payload;for(var i=0;i<=length;++i){var currentBytePtr=payload+i;if(i==length||HEAPU8[currentBytePtr]==0){var maxRead=currentBytePtr-decodeStartPtr;var stringSegment=UTF8ToString(decodeStartPtr,maxRead);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+1}}}else{var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[payload+i])}str=a.join("")}_free(value);return str},"toWireType":function(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value)}var length;var valueIsOfTypeString=typeof value=="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string")}if(stdStringIsUTF8&&valueIsOfTypeString){length=lengthBytesUTF8(value)}else{length=value.length}var base=_malloc(4+length+1);var ptr=base+4;HEAPU32[base>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr,length+1)}else{if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits")}HEAPU8[ptr+i]=charCode}}else{for(var i=0;i<length;++i){HEAPU8[ptr+i]=value[i]}}}if(destructors!==null){destructors.push(_free,base)}return base},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr)}})}function UTF16ToString(ptr,maxBytesToRead){var str="";for(var i=0;!(i>=maxBytesToRead/2);++i){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)break;str+=String.fromCharCode(codeUnit)}return str}function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>1]=0;return outPtr-startPtr}function lengthBytesUTF16(str){return str.length*2}function UTF32ToString(ptr,maxBytesToRead){var i=0;var str="";while(!(i>=maxBytesToRead/4)){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)break;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}return str}function stringToUTF32(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4}return len}function __embind_register_std_wstring(rawType,charSize,name){name=readLatin1String(name);var decodeString,encodeString,getHeap,lengthBytesUTF,shift;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16;getHeap=()=>HEAPU16;shift=1}else if(charSize===4){decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32;getHeap=()=>HEAPU32;shift=2}registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var HEAP=getHeap();var str;var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i*charSize;if(i==length||HEAP[currentBytePtr>>shift]==0){var maxReadBytes=currentBytePtr-decodeStartPtr;var stringSegment=decodeString(decodeStartPtr,maxReadBytes);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+charSize}}_free(value);return str},"toWireType":function(destructors,value){if(!(typeof value=="string")){throwBindingError("Cannot pass non-string to C++ string type "+name)}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[ptr>>2]=length>>shift;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr)}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr)}})}function __embind_register_void(rawType,name){name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":function(){return undefined},"toWireType":function(destructors,o){return undefined}})}function requireRegisteredType(rawType,humanName){var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(humanName+" has unknown type "+getTypeName(rawType))}return impl}function __emval_as(handle,returnType,destructorsRef){handle=Emval.toValue(handle);returnType=requireRegisteredType(returnType,"emval::as");var destructors=[];var rd=Emval.toHandle(destructors);HEAPU32[destructorsRef>>2]=rd;return returnType["toWireType"](destructors,handle)}function emval_lookupTypes(argCount,argTypes){var a=new Array(argCount);for(var i=0;i<argCount;++i){a[i]=requireRegisteredType(HEAPU32[argTypes+i*POINTER_SIZE>>2],"parameter "+i)}return a}function __emval_call(handle,argCount,argTypes,argv){handle=Emval.toValue(handle);var types=emval_lookupTypes(argCount,argTypes);var args=new Array(argCount);for(var i=0;i<argCount;++i){var type=types[i];args[i]=type["readValueFromPointer"](argv);argv+=type["argPackAdvance"]}var rv=handle.apply(undefined,args);return Emval.toHandle(rv)}function __emval_get_property(handle,key){handle=Emval.toValue(handle);key=Emval.toValue(key);return Emval.toHandle(handle[key])}function __emval_incref(handle){if(handle>4){emval_handle_array[handle].refcount+=1}}function __emval_is_number(handle){handle=Emval.toValue(handle);return typeof handle=="number"}var emval_symbols={};function getStringOrSymbol(address){var symbol=emval_symbols[address];if(symbol===undefined){return readLatin1String(address)}return symbol}function __emval_new_cstring(v){return Emval.toHandle(getStringOrSymbol(v))}function __emval_run_destructors(handle){var destructors=Emval.toValue(handle);runDestructors(destructors);__emval_decref(handle)}function __emval_take_value(type,arg){type=requireRegisteredType(type,"_emval_take_value");var v=type["readValueFromPointer"](arg);return Emval.toHandle(v)}function _abort(){abort("")}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function getHeapMax(){return 2147483648}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}let alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}embind_init_charCodes();BindingError=Module["BindingError"]=extendError(Error,"BindingError");InternalError=Module["InternalError"]=extendError(Error,"InternalError");init_emval();UnboundTypeError=Module["UnboundTypeError"]=extendError(Error,"UnboundTypeError");var asmLibraryArg={"a":___assert_fail,"q":__embind_register_bigint,"u":__embind_register_bool,"t":__embind_register_emval,"p":__embind_register_float,"k":__embind_register_function,"i":__embind_register_integer,"e":__embind_register_memory_view,"o":__embind_register_std_string,"m":__embind_register_std_wstring,"v":__embind_register_void,"g":__emval_as,"w":__emval_call,"b":__emval_decref,"d":__emval_get_property,"j":__emval_incref,"h":__emval_is_number,"c":__emval_new_cstring,"f":__emval_run_destructors,"l":__emval_take_value,"n":_abort,"s":_emscripten_memcpy_big,"r":_emscripten_resize_heap};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["y"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["z"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["A"]).apply(null,arguments)};var ___getTypeName=Module["___getTypeName"]=function(){return(___getTypeName=Module["___getTypeName"]=Module["asm"]["C"]).apply(null,arguments)};var __embind_initialize_bindings=Module["__embind_initialize_bindings"]=function(){return(__embind_initialize_bindings=Module["__embind_initialize_bindings"]=Module["asm"]["D"]).apply(null,arguments)};var dynCall_ijiii=Module["dynCall_ijiii"]=function(){return(dynCall_ijiii=Module["dynCall_ijiii"]=Module["asm"]["E"]).apply(null,arguments)};var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return Module.ready
}
);
})();
export default Module;/* post code */
const START_CODE = new Uint8Array([0, 0, 0, 1]);

function defaultError(error) {
  console.error(error);
}

export function createWebCodecsEncoderWithModule(MP4, opts = {}) {
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
    error = defaultError,
    encoderOptions = {},
  } = opts;

  const file = MP4.file();
  const mux = MP4.create_muxer(
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
    error,
  });
  encoder.configure(config);

  return {
    format: 'bitmap',
    async end() {
      await encoder.flush();
      encoder.close();
      MP4.finalize_muxer(mux);
      return file.contents();
    },
    async encodeRGB(bitmap) {
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
    const data = MP4.HEAPU8.subarray(data_ptr, data_ptr + size);
    // write into virtual file
    return file.write(data) !== data.byteLength;
  }

  function write_nal(uint8) {
    const p = MP4._malloc(uint8.byteLength);
    MP4.HEAPU8.set(uint8, p);
    MP4.mux_nal(mux, p, uint8.byteLength);
    MP4._free(p);
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
