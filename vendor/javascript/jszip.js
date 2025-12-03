// jszip@3.10.1 downloaded from https://ga.jspm.io/npm:jszip@3.10.1/lib/index.js

import*as e from"readable-stream";import r from"buffer";import*as t from"lie";import*as i from"setimmediate";import n from"process";import*as a from"pako";var s="default"in e?e.default:e;var o={},u=false;function dew$x(){if(u)return o;u=true;var e=r.Buffer;o.base64=true;o.array=true;o.string=true;o.arraybuffer="undefined"!==typeof ArrayBuffer&&"undefined"!==typeof Uint8Array;o.nodebuffer="undefined"!==typeof e;o.uint8array="undefined"!==typeof Uint8Array;if("undefined"===typeof ArrayBuffer)o.blob=false;else{var t=new ArrayBuffer(0);try{o.blob=0===new Blob([t],{type:"application/zip"}).size}catch(e){try{var i=self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder;var n=new i;n.append(t);o.blob=0===n.getBlob("application/zip").size}catch(e){o.blob=false}}}try{o.nodestream=!!s.Readable}catch(e){o.nodestream=false}return o}var f={},d=false;function dew$w(){if(d)return f;d=true;var e=dew$t();var r=dew$x();var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";f.encode=function(r){var i=[];var n,a,s,o,u,f,d;var h=0,c=r.length,l=c;var p="string"!==e.getTypeOf(r);while(h<r.length){l=c-h;if(p){n=r[h++];a=h<c?r[h++]:0;s=h<c?r[h++]:0}else{n=r.charCodeAt(h++);a=h<c?r.charCodeAt(h++):0;s=h<c?r.charCodeAt(h++):0}o=n>>2;u=(3&n)<<4|a>>4;f=l>1?(15&a)<<2|s>>6:64;d=l>2?63&s:64;i.push(t.charAt(o)+t.charAt(u)+t.charAt(f)+t.charAt(d))}return i.join("")};f.decode=function(e){var i,n,a;var s,o,u,f;var d=0,h=0;var c="data:";if(e.substr(0,c.length)===c)throw new Error("Invalid base64 input, it looks like a data url.");e=e.replace(/[^A-Za-z0-9+/=]/g,"");var l=3*e.length/4;e.charAt(e.length-1)===t.charAt(64)&&l--;e.charAt(e.length-2)===t.charAt(64)&&l--;if(l%1!==0)throw new Error("Invalid base64 input, bad content length.");var p;p=r.uint8array?new Uint8Array(0|l):new Array(0|l);while(d<e.length){s=t.indexOf(e.charAt(d++));o=t.indexOf(e.charAt(d++));u=t.indexOf(e.charAt(d++));f=t.indexOf(e.charAt(d++));i=s<<2|o>>4;n=(15&o)<<4|u>>2;a=(3&u)<<6|f;p[h++]=i;64!==u&&(p[h++]=n);64!==f&&(p[h++]=a)}return p};return f}var h={},c=false;function dew$v(){if(c)return h;c=true;var e=r.Buffer;h={isNode:"undefined"!==typeof e,
/**
     * Create a new nodejs Buffer from an existing content.
     * @param {Object} data the data to pass to the constructor.
     * @param {String} encoding the encoding to use.
     * @return {Buffer} a new Buffer.
     */
newBufferFrom:function(r,t){if(e.from&&e.from!==Uint8Array.from)return e.from(r,t);if("number"===typeof r)throw new Error('The "data" argument must not be a number');return new e(r,t)},
/**
     * Create a new nodejs Buffer with the specified size.
     * @param {Integer} size the size of the buffer.
     * @return {Buffer} a new Buffer.
     */
allocBuffer:function(r){if(e.alloc)return e.alloc(r);var t=new e(r);t.fill(0);return t},
/**
     * Find out if an object is a Buffer.
     * @param {Object} b the object to test.
     * @return {Boolean} true if the object is a Buffer, false otherwise.
     */
isBuffer:function(r){return e.isBuffer(r)},isStream:function(e){return e&&"function"===typeof e.on&&"function"===typeof e.pause&&"function"===typeof e.resume}};return h}var l="default"in t?t.default:t;var p={},m=false;function dew$u(){if(m)return p;m=true;var e=null;e="undefined"!==typeof Promise?Promise:l;p={Promise:e};return p}var v="default"in i?i.default:i;var y={},w=false;function dew$t(){if(w)return y;w=true;var e=n;var r=dew$x();var t=dew$w();var i=dew$v();var a=dew$u();v;
/**
   * Convert a string that pass as a "binary string": it should represent a byte
   * array but may have > 255 char codes. Be sure to take only the first byte
   * and returns the byte array.
   * @param {String} str the string to transform.
   * @return {Array|Uint8Array} the string in a binary format.
   */function string2binary(e){var t=null;t=r.uint8array?new Uint8Array(e.length):new Array(e.length);return stringToArrayLike(e,t)}
/**
   * Create a new blob with the given content and the given type.
   * @param {String|ArrayBuffer} part the content to put in the blob. DO NOT use
   * an Uint8Array because the stock browser of android 4 won't accept it (it
   * will be silently converted to a string, "[object Uint8Array]").
   *
   * Use only ONE part to build the blob to avoid a memory leak in IE11 / Edge:
   * when a large amount of Array is used to create the Blob, the amount of
   * memory consumed is nearly 100 times the original data amount.
   *
   * @param {String} type the mime type of the blob.
   * @return {Blob} the created blob.
   */y.newBlob=function(e,r){y.checkSupport("blob");try{return new Blob([e],{type:r})}catch(n){try{var t=self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder;var i=new t;i.append(e);return i.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};
/**
   * The identity function.
   * @param {Object} input the input.
   * @return {Object} the same input.
   */function identity(e){return e}
/**
   * Fill in an array with a string.
   * @param {String} str the string to use.
   * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
   * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
   */function stringToArrayLike(e,r){for(var t=0;t<e.length;++t)r[t]=255&e.charCodeAt(t);return r}var s={
/**
     * Transform an array of int into a string, chunk by chunk.
     * See the performances notes on arrayLikeToString.
     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
     * @param {String} type the type of the array.
     * @param {Integer} chunk the chunk size.
     * @return {String} the resulting string.
     * @throws Error if the chunk is too big for the stack.
     */
stringifyByChunk:function(e,r,t){var i=[],n=0,a=e.length;if(a<=t)return String.fromCharCode.apply(null,e);while(n<a){"array"===r||"nodebuffer"===r?i.push(String.fromCharCode.apply(null,e.slice(n,Math.min(n+t,a)))):i.push(String.fromCharCode.apply(null,e.subarray(n,Math.min(n+t,a))));n+=t}return i.join("")},
/**
     * Call String.fromCharCode on every item in the array.
     * This is the naive implementation, which generate A LOT of intermediate string.
     * This should be used when everything else fail.
     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
     * @return {String} the result.
     */
stringifyByChar:function(e){var r="";for(var t=0;t<e.length;t++)r+=String.fromCharCode(e[t]);return r},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return false}}(),nodebuffer:function(){try{return r.nodebuffer&&1===String.fromCharCode.apply(null,i.allocBuffer(1)).length}catch(e){return false}}()}};
/**
   * Transform an array-like object to a string.
   * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
   * @return {String} the result.
   */function arrayLikeToString(e){var r=65536,t=y.getTypeOf(e),i=true;"uint8array"===t?i=s.applyCanBeUsed.uint8array:"nodebuffer"===t&&(i=s.applyCanBeUsed.nodebuffer);if(i)while(r>1)try{return s.stringifyByChunk(e,t,r)}catch(e){r=Math.floor(r/2)}return s.stringifyByChar(e)}y.applyFromCharCode=arrayLikeToString;
/**
   * Copy the data from an array-like to an other array-like.
   * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
   * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
   * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
   */function arrayLikeToArrayLike(e,r){for(var t=0;t<e.length;t++)r[t]=e[t];return r}var o={};o.string={string:identity,array:function(e){return stringToArrayLike(e,new Array(e.length))},arraybuffer:function(e){return o.string.uint8array(e).buffer},uint8array:function(e){return stringToArrayLike(e,new Uint8Array(e.length))},nodebuffer:function(e){return stringToArrayLike(e,i.allocBuffer(e.length))}};o.array={string:arrayLikeToString,array:identity,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return i.newBufferFrom(e)}};o.arraybuffer={string:function(e){return arrayLikeToString(new Uint8Array(e))},array:function(e){return arrayLikeToArrayLike(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:identity,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return i.newBufferFrom(new Uint8Array(e))}};o.uint8array={string:arrayLikeToString,array:function(e){return arrayLikeToArrayLike(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:identity,nodebuffer:function(e){return i.newBufferFrom(e)}};o.nodebuffer={string:arrayLikeToString,array:function(e){return arrayLikeToArrayLike(e,new Array(e.length))},arraybuffer:function(e){return o.nodebuffer.uint8array(e).buffer},uint8array:function(e){return arrayLikeToArrayLike(e,new Uint8Array(e.length))},nodebuffer:identity};
/**
   * Transform an input into any type.
   * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
   * If no output type is specified, the unmodified input will be returned.
   * @param {String} outputType the output type.
   * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
   * @throws {Error} an Error if the browser doesn't support the requested output type.
   */y.transformTo=function(e,r){r||(r="");if(!e)return r;y.checkSupport(e);var t=y.getTypeOf(r);var i=o[t][e](r);return i};
/**
   * Resolve all relative path components, "." and "..", in a path. If these relative components
   * traverse above the root then the resulting path will only contain the final path component.
   *
   * All empty components, e.g. "//", are removed.
   * @param {string} path A path with / or \ separators
   * @returns {string} The path with all relative path components resolved.
   */y.resolve=function(e){var r=e.split("/");var t=[];for(var i=0;i<r.length;i++){var n=r[i];"."===n||""===n&&0!==i&&i!==r.length-1||(".."===n?t.pop():t.push(n))}return t.join("/")};
/**
   * Return the type of the input.
   * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
   * @param {Object} input the input to identify.
   * @return {String} the (lowercase) type of the input.
   */y.getTypeOf=function(e){return"string"===typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":r.nodebuffer&&i.isBuffer(e)?"nodebuffer":r.uint8array&&e instanceof Uint8Array?"uint8array":r.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0};
/**
   * Throw an exception if the type is not supported.
   * @param {String} type the type to check.
   * @throws {Error} an Error if the browser doesn't support the requested type.
   */y.checkSupport=function(e){var t=r[e.toLowerCase()];if(!t)throw new Error(e+" is not supported by this platform")};y.MAX_VALUE_16BITS=65535;y.MAX_VALUE_32BITS=-1;
/**
   * Prettify a string read as binary.
   * @param {string} str the string to prettify.
   * @return {string} a pretty string.
   */y.pretty=function(e){var r,t,i="";for(t=0;t<(e||"").length;t++){r=e.charCodeAt(t);i+="\\x"+(r<16?"0":"")+r.toString(16).toUpperCase()}return i};
/**
   * Defer the call of a function.
   * @param {Function} callback the function to call asynchronously.
   * @param {Array} args the arguments to give to the callback.
   */y.delay=function(r,t,i){e.nextTick((function(){r.apply(i||null,t||[])}))};
/**
   * Extends a prototype with an other, without calling a constructor with
   * side effects. Inspired by nodejs' `utils.inherits`
   * @param {Function} ctor the constructor to augment
   * @param {Function} superCtor the parent constructor to use
   */y.inherits=function(e,r){var Obj=function(){};Obj.prototype=r.prototype;e.prototype=new Obj};
/**
   * Merge the objects passed as parameters into a new one.
   * @private
   * @param {...Object} var_args All objects to merge.
   * @return {Object} a new object with the data of the others.
   */y.extend=function(){var e,r,t={};for(e=0;e<arguments.length;e++)for(r in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],r)&&"undefined"===typeof t[r]&&(t[r]=arguments[e][r]);return t};
/**
   * Transform arbitrary content into a Promise.
   * @param {String} name a name for the content being processed.
   * @param {Object} inputData the content to process.
   * @param {Boolean} isBinary true if the content is not an unicode string
   * @param {Boolean} isOptimizedBinaryString true if the string content only has one byte per character.
   * @param {Boolean} isBase64 true if the string content is encoded with base64.
   * @return {Promise} a promise in a format usable by JSZip.
   */y.prepareContent=function(e,i,n,s,o){var u=a.Promise.resolve(i).then((function(e){var t=r.blob&&(e instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(e)));return t&&"undefined"!==typeof FileReader?new a.Promise((function(r,t){var i=new FileReader;i.onload=function(e){r(e.target.result)};i.onerror=function(e){t(e.target.error)};i.readAsArrayBuffer(e)})):e}));return u.then((function(r){var i=y.getTypeOf(r);if(!i)return a.Promise.reject(new Error("Can't read the data of '"+e+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));"arraybuffer"===i?r=y.transformTo("uint8array",r):"string"===i&&(o?r=t.decode(r):n&&true!==s&&(r=string2binary(r)));return r}))};return y}var g={},k=false;function dew$s(){if(k)return g;k=true;
/**
   * A worker that does nothing but passing chunks to the next one. This is like
   * a nodejs stream but with some differences. On the good side :
   * - it works on IE 6-9 without any issue / polyfill
   * - it weights less than the full dependencies bundled with browserify
   * - it forwards errors (no need to declare an error handler EVERYWHERE)
   *
   * A chunk is an object with 2 attributes : `meta` and `data`. The former is an
   * object containing anything (`percent` for example), see each worker for more
   * details. The latter is the real data (String, Uint8Array, etc).
   *
   * @constructor
   * @param {String} name the name of the stream (mainly used for debugging purposes)
   */function GenericWorker(e){this.name=e||"default";this.streamInfo={};this.generatedError=null;this.extraStreamInfo={};this.isPaused=true;this.isFinished=false;this.isLocked=false;this._listeners={data:[],end:[],error:[]};this.previous=null}GenericWorker.prototype={
/**
     * Push a chunk to the next workers.
     * @param {Object} chunk the chunk to push
     */
push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return false;this.flush();try{this.emit("end");this.cleanUp();this.isFinished=true}catch(e){this.emit("error",e)}return true},
/**
     * End the stream with an error.
     * @param {Error} e the error which caused the premature end.
     * @return {Boolean} true if this call ended the worker with an error, false otherwise.
     */
error:function(e){if(this.isFinished)return false;if(this.isPaused)this.generatedError=e;else{this.isFinished=true;this.emit("error",e);this.previous&&this.previous.error(e);this.cleanUp()}return true},
/**
     * Add a callback on an event.
     * @param {String} name the name of the event (data, end, error)
     * @param {Function} listener the function to call when the event is triggered
     * @return {GenericWorker} the current object for chainability
     */
on:function(e,r){this._listeners[e].push(r);return this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null;this._listeners=[]},
/**
     * Trigger an event. This will call registered callback with the provided arg.
     * @param {String} name the name of the event (data, end, error)
     * @param {Object} arg the argument to call the callback with.
     */
emit:function(e,r){if(this._listeners[e])for(var t=0;t<this._listeners[e].length;t++)this._listeners[e][t].call(this,r)},
/**
     * Chain a worker with an other.
     * @param {Worker} next the worker receiving events from the current one.
     * @return {worker} the next worker for chainability
     */
pipe:function(e){return e.registerPrevious(this)},
/**
     * Same as `pipe` in the other direction.
     * Using an API with `pipe(next)` is very easy.
     * Implementing the API with the point of view of the next one registering
     * a source is easier, see the ZipFileWorker.
     * @param {Worker} previous the previous worker, sending events to this one
     * @return {Worker} the current worker for chainability
     */
registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo;this.mergeStreamInfo();this.previous=e;var r=this;e.on("data",(function(e){r.processChunk(e)}));e.on("end",(function(){r.end()}));e.on("error",(function(e){r.error(e)}));return this},pause:function(){if(this.isPaused||this.isFinished)return false;this.isPaused=true;this.previous&&this.previous.pause();return true},resume:function(){if(!this.isPaused||this.isFinished)return false;this.isPaused=false;var e=false;if(this.generatedError){this.error(this.generatedError);e=true}this.previous&&this.previous.resume();return!e},flush:function(){},
/**
     * Process a chunk. This is usually the method overridden.
     * @param {Object} chunk the chunk to process.
     */
processChunk:function(e){this.push(e)},
/**
     * Add a key/value to be added in the workers chain streamInfo once activated.
     * @param {String} key the key to use
     * @param {Object} value the associated value
     * @return {Worker} the current worker for chainability
     */
withStreamInfo:function(e,r){this.extraStreamInfo[e]=r;this.mergeStreamInfo();return this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=true;this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}};g=GenericWorker;return g}var S={},C=false;function dew$r(){if(C)return S;C=true;var e=dew$t();var r=dew$x();var t=dew$v();var i=dew$s();var n=new Array(256);for(var a=0;a<256;a++)n[a]=a>=252?6:a>=248?5:a>=240?4:a>=224?3:a>=192?2:1;n[254]=n[254]=1;var string2buf=function(e){var t,i,n,a,s,o=e.length,u=0;for(a=0;a<o;a++){i=e.charCodeAt(a);if(55296===(64512&i)&&a+1<o){n=e.charCodeAt(a+1);if(56320===(64512&n)){i=65536+(i-55296<<10)+(n-56320);a++}}u+=i<128?1:i<2048?2:i<65536?3:4}t=r.uint8array?new Uint8Array(u):new Array(u);for(s=0,a=0;s<u;a++){i=e.charCodeAt(a);if(55296===(64512&i)&&a+1<o){n=e.charCodeAt(a+1);if(56320===(64512&n)){i=65536+(i-55296<<10)+(n-56320);a++}}if(i<128)t[s++]=i;else if(i<2048){t[s++]=192|i>>>6;t[s++]=128|63&i}else if(i<65536){t[s++]=224|i>>>12;t[s++]=128|i>>>6&63;t[s++]=128|63&i}else{t[s++]=240|i>>>18;t[s++]=128|i>>>12&63;t[s++]=128|i>>>6&63;t[s++]=128|63&i}}return t};var utf8border=function(e,r){var t;r=r||e.length;r>e.length&&(r=e.length);t=r-1;while(t>=0&&128===(192&e[t]))t--;return t<0||0===t?r:t+n[e[t]]>r?t:r};var buf2string=function(r){var t,i,a,s;var o=r.length;var u=new Array(2*o);for(i=0,t=0;t<o;){a=r[t++];if(a<128)u[i++]=a;else{s=n[a];if(s>4){u[i++]=65533;t+=s-1}else{a&=2===s?31:3===s?15:7;while(s>1&&t<o){a=a<<6|63&r[t++];s--}if(s>1)u[i++]=65533;else if(a<65536)u[i++]=a;else{a-=65536;u[i++]=55296|a>>10&1023;u[i++]=56320|1023&a}}}}u.length!==i&&(u.subarray?u=u.subarray(0,i):u.length=i);return e.applyFromCharCode(u)};
/**
   * Transform a javascript string into an array (typed if possible) of bytes,
   * UTF-8 encoded.
   * @param {String} str the string to encode
   * @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
   */S.utf8encode=function utf8encode(e){return r.nodebuffer?t.newBufferFrom(e,"utf-8"):string2buf(e)};
/**
   * Transform a bytes array (or a representation) representing an UTF-8 encoded
   * string into a javascript string.
   * @param {Array|Uint8Array|Buffer} buf the data de decode
   * @return {String} the decoded string.
   */S.utf8decode=function utf8decode(t){if(r.nodebuffer)return e.transformTo("nodebuffer",t).toString("utf-8");t=e.transformTo(r.uint8array?"uint8array":"array",t);return buf2string(t)};function Utf8DecodeWorker(){i.call(this,"utf-8 decode");this.leftOver=null}e.inherits(Utf8DecodeWorker,i);Utf8DecodeWorker.prototype.processChunk=function(t){var i=e.transformTo(r.uint8array?"uint8array":"array",t.data);if(this.leftOver&&this.leftOver.length){if(r.uint8array){var n=i;i=new Uint8Array(n.length+this.leftOver.length);i.set(this.leftOver,0);i.set(n,this.leftOver.length)}else i=this.leftOver.concat(i);this.leftOver=null}var a=utf8border(i);var s=i;if(a!==i.length)if(r.uint8array){s=i.subarray(0,a);this.leftOver=i.subarray(a,i.length)}else{s=i.slice(0,a);this.leftOver=i.slice(a,i.length)}this.push({data:S.utf8decode(s),meta:t.meta})};Utf8DecodeWorker.prototype.flush=function(){if(this.leftOver&&this.leftOver.length){this.push({data:S.utf8decode(this.leftOver),meta:{}});this.leftOver=null}};S.Utf8DecodeWorker=Utf8DecodeWorker;function Utf8EncodeWorker(){i.call(this,"utf-8 encode")}e.inherits(Utf8EncodeWorker,i);Utf8EncodeWorker.prototype.processChunk=function(e){this.push({data:S.utf8encode(e.data),meta:e.meta})};S.Utf8EncodeWorker=Utf8EncodeWorker;return S}var b={},A=false;function dew$q(){if(A)return b;A=true;var e=dew$s();var r=dew$t();
/**
   * A worker which convert chunks to a specified type.
   * @constructor
   * @param {String} destType the destination type.
   */function ConvertWorker(r){e.call(this,"ConvertWorker to "+r);this.destType=r}r.inherits(ConvertWorker,e);ConvertWorker.prototype.processChunk=function(e){this.push({data:r.transformTo(this.destType,e.data),meta:e.meta})};b=ConvertWorker;return b}var E="default"in e?e.default:e;var I={},_=false;function dew$p(){if(_)return I;_=true;var e=E.Readable;var r=dew$t();r.inherits(NodejsStreamOutputAdapter,e);
/**
  * A nodejs stream using a worker as source.
  * @see the SourceWrapper in http://nodejs.org/api/stream.html
  * @constructor
  * @param {StreamHelper} helper the helper wrapping the worker
  * @param {Object} options the nodejs stream options
  * @param {Function} updateCb the update callback.
  */function NodejsStreamOutputAdapter(r,t,i){e.call(this,t);this._helper=r;var n=this;r.on("data",(function(e,r){n.push(e)||n._helper.pause();i&&i(r)})).on("error",(function(e){n.emit("error",e)})).on("end",(function(){n.push(null)}))}NodejsStreamOutputAdapter.prototype._read=function(){this._helper.resume()};I=NodejsStreamOutputAdapter;return I}var O={},x=false;function dew$o(){if(x)return O;x=true;var e=r.Buffer;var t=dew$t();var i=dew$q();var n=dew$s();var a=dew$w();var s=dew$x();var o=dew$u();var u=null;if(s.nodestream)try{u=dew$p()}catch(e){}
/**
   * Apply the final transformation of the data. If the user wants a Blob for
   * example, it's easier to work with an U8intArray and finally do the
   * ArrayBuffer/Blob conversion.
   * @param {String} type the name of the final type
   * @param {String|Uint8Array|Buffer} content the content to transform
   * @param {String} mimeType the mime type of the content, if applicable.
   * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.
   */function transformZipOutput(e,r,i){switch(e){case"blob":return t.newBlob(t.transformTo("arraybuffer",r),i);case"base64":return a.encode(r);default:return t.transformTo(e,r)}}
/**
   * Concatenate an array of data of the given type.
   * @param {String} type the type of the data in the given array.
   * @param {Array} dataArray the array containing the data chunks to concatenate
   * @return {String|Uint8Array|Buffer} the concatenated data
   * @throws Error if the asked type is unsupported
   */function concat(r,t){var i,n=0,a=null,s=0;for(i=0;i<t.length;i++)s+=t[i].length;switch(r){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":a=new Uint8Array(s);for(i=0;i<t.length;i++){a.set(t[i],n);n+=t[i].length}return a;case"nodebuffer":return e.concat(t);default:throw new Error("concat : unsupported type '"+r+"'")}}
/**
   * Listen a StreamHelper, accumulate its content and concatenate it into a
   * complete block.
   * @param {StreamHelper} helper the helper to use.
   * @param {Function} updateCallback a callback called on each update. Called
   * with one arg :
   * - the metadata linked to the update received.
   * @return Promise the promise for the accumulation.
   */function accumulate(e,r){return new o.Promise((function(t,i){var n=[];var a=e._internalType,s=e._outputType,o=e._mimeType;e.on("data",(function(e,t){n.push(e);r&&r(t)})).on("error",(function(e){n=[];i(e)})).on("end",(function(){try{var e=transformZipOutput(s,concat(a,n),o);t(e)}catch(e){i(e)}n=[]})).resume()}))}
/**
   * An helper to easily use workers outside of JSZip.
   * @constructor
   * @param {Worker} worker the worker to wrap
   * @param {String} outputType the type of data expected by the use
   * @param {String} mimeType the mime type of the content, if applicable.
   */function StreamHelper(e,r,a){var s=r;switch(r){case"blob":case"arraybuffer":s="uint8array";break;case"base64":s="string";break}try{this._internalType=s;this._outputType=r;this._mimeType=a;t.checkSupport(s);this._worker=e.pipe(new i(s));e.lock()}catch(e){this._worker=new n("error");this._worker.error(e)}}StreamHelper.prototype={
/**
     * Listen a StreamHelper, accumulate its content and concatenate it into a
     * complete block.
     * @param {Function} updateCb the update callback.
     * @return Promise the promise for the accumulation.
     */
accumulate:function(e){return accumulate(this,e)},
/**
     * Add a listener on an event triggered on a stream.
     * @param {String} evt the name of the event
     * @param {Function} fn the listener
     * @return {StreamHelper} the current helper.
     */
on:function(e,r){var i=this;"data"===e?this._worker.on(e,(function(e){r.call(i,e.data,e.meta)})):this._worker.on(e,(function(){t.delay(r,arguments,i)}));return this},resume:function(){t.delay(this._worker.resume,[],this._worker);return this},pause:function(){this._worker.pause();return this},
/**
     * Return a nodejs stream for this helper.
     * @param {Function} updateCb the update callback.
     * @return {NodejsStreamOutputAdapter} the nodejs stream.
     */
toNodejsStream:function(e){t.checkSupport("nodestream");if("nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new u(this,{objectMode:"nodebuffer"!==this._outputType},e)}};O=StreamHelper;return O}var T={},$=false;function dew$n(){if($)return T;$=true;T.base64=false;T.binary=false;T.dir=false;T.createFolders=true;T.date=null;T.compression=null;T.compressionOptions=null;T.comment=null;T.unixPermissions=null;T.dosPermissions=null;return T}var R={},D=false;function dew$m(){if(D)return R;D=true;var e=dew$t();var r=dew$s();var t=16384;
/**
   * A worker that reads a content and emits chunks.
   * @constructor
   * @param {Promise} dataP the promise of the data to split
   */function DataWorker(t){r.call(this,"DataWorker");var i=this;this.dataIsReady=false;this.index=0;this.max=0;this.data=null;this.type="";this._tickScheduled=false;t.then((function(r){i.dataIsReady=true;i.data=r;i.max=r&&r.length||0;i.type=e.getTypeOf(r);i.isPaused||i._tickAndRepeat()}),(function(e){i.error(e)}))}e.inherits(DataWorker,r);DataWorker.prototype.cleanUp=function(){r.prototype.cleanUp.call(this);this.data=null};DataWorker.prototype.resume=function(){if(!r.prototype.resume.call(this))return false;if(!this._tickScheduled&&this.dataIsReady){this._tickScheduled=true;e.delay(this._tickAndRepeat,[],this)}return true};DataWorker.prototype._tickAndRepeat=function(){this._tickScheduled=false;if(!this.isPaused&&!this.isFinished){this._tick();if(!this.isFinished){e.delay(this._tickAndRepeat,[],this);this._tickScheduled=true}}};DataWorker.prototype._tick=function(){if(this.isPaused||this.isFinished)return false;var e=t;var r=null,i=Math.min(this.max,this.index+e);if(this.index>=this.max)return this.end();switch(this.type){case"string":r=this.data.substring(this.index,i);break;case"uint8array":r=this.data.subarray(this.index,i);break;case"array":case"nodebuffer":r=this.data.slice(this.index,i);break}this.index=i;return this.push({data:r,meta:{percent:this.max?this.index/this.max*100:0}})};R=DataWorker;return R}var F={},z=false;function dew$l(){if(z)return F;z=true;var e=dew$t();function makeTable(){var e,r=[];for(var t=0;t<256;t++){e=t;for(var i=0;i<8;i++)e=1&e?3988292384^e>>>1:e>>>1;r[t]=e}return r}var r=makeTable();function crc32(e,t,i,n){var a=r,s=n+i;e^=-1;for(var o=n;o<s;o++)e=e>>>8^a[255&(e^t[o])];return-1^e}
/**
   * Compute the crc32 of a string.
   * This is almost the same as the function crc32, but for strings. Using the
   * same function for the two use cases leads to horrible performances.
   * @param {Number} crc the starting value of the crc.
   * @param {String} str the string to use.
   * @param {Number} len the length of the string.
   * @param {Number} pos the starting position for the crc32 computation.
   * @return {Number} the computed crc32.
   */function crc32str(e,t,i,n){var a=r,s=n+i;e^=-1;for(var o=n;o<s;o++)e=e>>>8^a[255&(e^t.charCodeAt(o))];return-1^e}F=function crc32wrapper(r,t){if("undefined"===typeof r||!r.length)return 0;var i="string"!==e.getTypeOf(r);return i?crc32(0|t,r,r.length,0):crc32str(0|t,r,r.length,0)};return F}var P={},L=false;function dew$k(){if(L)return P;L=true;var e=dew$s();var r=dew$l();var t=dew$t();function Crc32Probe(){e.call(this,"Crc32Probe");this.withStreamInfo("crc32",0)}t.inherits(Crc32Probe,e);Crc32Probe.prototype.processChunk=function(e){this.streamInfo.crc32=r(e.data,this.streamInfo.crc32||0);this.push(e)};P=Crc32Probe;return P}var B={},N=false;function dew$j(){if(N)return B;N=true;var e=dew$t();var r=dew$s();
/**
   * A worker which calculate the total length of the data flowing through.
   * @constructor
   * @param {String} propName the name used to expose the length
   */function DataLengthProbe(e){r.call(this,"DataLengthProbe for "+e);this.propName=e;this.withStreamInfo(e,0)}e.inherits(DataLengthProbe,r);DataLengthProbe.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}r.prototype.processChunk.call(this,e)};B=DataLengthProbe;return B}var W={},U=false;function dew$i(){if(U)return W;U=true;var e=dew$u();var r=dew$m();var t=dew$k();var i=dew$j();
/**
   * Represent a compressed object, with everything needed to decompress it.
   * @constructor
   * @param {number} compressedSize the size of the data compressed.
   * @param {number} uncompressedSize the size of the data after decompression.
   * @param {number} crc32 the crc32 of the decompressed file.
   * @param {object} compression the type of compression, see lib/compressions.js.
   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
   */function CompressedObject(e,r,t,i,n){this.compressedSize=e;this.uncompressedSize=r;this.crc32=t;this.compression=i;this.compressedContent=n}CompressedObject.prototype={getContentWorker:function(){var t=new r(e.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new i("data_length"));var n=this;t.on("end",(function(){if(this.streamInfo.data_length!==n.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}));return t},getCompressedWorker:function(){return new r(e.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}};
/**
   * Chain the given worker with other workers to compress the content with the
   * given compression.
   * @param {GenericWorker} uncompressedWorker the worker to pipe.
   * @param {Object} compression the compression object.
   * @param {Object} compressionOptions the options to use when compressing.
   * @return {GenericWorker} the new worker compressing the content.
   */CompressedObject.createWorkerFrom=function(e,r,n){return e.pipe(new t).pipe(new i("uncompressedSize")).pipe(r.compressWorker(n)).pipe(new i("compressedSize")).withStreamInfo("compression",r)};W=CompressedObject;return W}var Z={},j=false;function dew$h(){if(j)return Z;j=true;var e=dew$o();var r=dew$m();var t=dew$r();var i=dew$i();var n=dew$s();
/**
   * A simple object representing a file in the zip file.
   * @constructor
   * @param {string} name the name of the file
   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
   * @param {Object} options the options of the file
   */var ZipObject=function(e,r,t){this.name=e;this.dir=t.dir;this.date=t.date;this.comment=t.comment;this.unixPermissions=t.unixPermissions;this.dosPermissions=t.dosPermissions;this._data=r;this._dataBinary=t.binary;this.options={compression:t.compression,compressionOptions:t.compressionOptions}};ZipObject.prototype={
/**
     * Create an internal stream for the content of this object.
     * @param {String} type the type of each chunk.
     * @return StreamHelper the stream.
     */
internalStream:function(r){var i=null,a="string";try{if(!r)throw new Error("No output type specified.");a=r.toLowerCase();var s="string"===a||"text"===a;"binarystring"!==a&&"text"!==a||(a="string");i=this._decompressWorker();var o=!this._dataBinary;o&&!s&&(i=i.pipe(new t.Utf8EncodeWorker));!o&&s&&(i=i.pipe(new t.Utf8DecodeWorker))}catch(e){i=new n("error");i.error(e)}return new e(i,a,"")},
/**
     * Prepare the content in the asked type.
     * @param {String} type the type of the result.
     * @param {Function} onUpdate a function to call on each internal update.
     * @return Promise the promise of the result.
     */
async:function(e,r){return this.internalStream(e).accumulate(r)},
/**
     * Prepare the content as a nodejs stream.
     * @param {String} type the type of each chunk.
     * @param {Function} onUpdate a function to call on each internal update.
     * @return Stream the stream.
     */
nodeStream:function(e,r){return this.internalStream(e||"nodebuffer").toNodejsStream(r)},
/**
     * Return a worker for the compressed content.
     * @private
     * @param {Object} compression the compression object to use.
     * @param {Object} compressionOptions the options to use when compressing.
     * @return Worker the worker.
     */
_compressWorker:function(e,r){if(this._data instanceof i&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var n=this._decompressWorker();this._dataBinary||(n=n.pipe(new t.Utf8EncodeWorker));return i.createWorkerFrom(n,e,r)},_decompressWorker:function(){return this._data instanceof i?this._data.getContentWorker():this._data instanceof n?this._data:new r(this._data)}};var a=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"];var removedFn=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")};for(var s=0;s<a.length;s++)ZipObject.prototype[a[s]]=removedFn;Z=ZipObject;return Z}var M="default"in a?a.default:a;var J={},H=false;function dew$g(){if(H)return J;H=true;var e="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array;var r=M;var t=dew$t();var i=dew$s();var n=e?"uint8array":"array";J.magic="\b\0";
/**
   * Create a worker that uses pako to inflate/deflate.
   * @constructor
   * @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
   * @param {Object} options the options to use when (de)compressing.
   */function FlateWorker(e,r){i.call(this,"FlateWorker/"+e);this._pako=null;this._pakoAction=e;this._pakoOptions=r;this.meta={}}t.inherits(FlateWorker,i);FlateWorker.prototype.processChunk=function(e){this.meta=e.meta;null===this._pako&&this._createPako();this._pako.push(t.transformTo(n,e.data),false)};FlateWorker.prototype.flush=function(){i.prototype.flush.call(this);null===this._pako&&this._createPako();this._pako.push([],true)};FlateWorker.prototype.cleanUp=function(){i.prototype.cleanUp.call(this);this._pako=null};FlateWorker.prototype._createPako=function(){this._pako=new r[this._pakoAction]({raw:true,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(r){e.push({data:r,meta:e.meta})}};J.compressWorker=function(e){return new FlateWorker("Deflate",e)};J.uncompressWorker=function(){return new FlateWorker("Inflate",{})};return J}var X={},V=false;function dew$f(){if(V)return X;V=true;var e=dew$s();X.STORE={magic:"\0\0",compressWorker:function(){return new e("STORE compression")},uncompressWorker:function(){return new e("STORE decompression")}};X.DEFLATE=dew$g();return X}var Y={},K=false;function dew$e(){if(K)return Y;K=true;Y.LOCAL_FILE_HEADER="PK";Y.CENTRAL_FILE_HEADER="PK";Y.CENTRAL_DIRECTORY_END="PK";Y.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK";Y.ZIP64_CENTRAL_DIRECTORY_END="PK";Y.DATA_DESCRIPTOR="PK\b";return Y}var G={},q=false;function dew$d(){if(q)return G;q=true;var e=dew$t();var r=dew$s();var t=dew$r();var i=dew$l();var n=dew$e();
/**
   * Transform an integer into a string in hexadecimal.
   * @private
   * @param {number} dec the number to convert.
   * @param {number} bytes the number of bytes to generate.
   * @returns {string} the result.
   */var decToHex=function(e,r){var t,i="";for(t=0;t<r;t++){i+=String.fromCharCode(255&e);e>>>=8}return i};
/**
   * Generate the UNIX part of the external file attributes.
   * @param {Object} unixPermissions the unix permissions or null.
   * @param {Boolean} isDir true if the entry is a directory, false otherwise.
   * @return {Number} a 32 bit integer.
   *
   * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
   *
   * TTTTsstrwxrwxrwx0000000000ADVSHR
   * ^^^^____________________________ file type, see zipinfo.c (UNX_*)
   *     ^^^_________________________ setuid, setgid, sticky
   *        ^^^^^^^^^________________ permissions
   *                 ^^^^^^^^^^______ not used ?
   *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
   */var generateUnixExternalFileAttr=function(e,r){var t=e;e||(t=r?16893:33204);return(65535&t)<<16};
/**
   * Generate the DOS part of the external file attributes.
   * @param {Object} dosPermissions the dos permissions or null.
   * @param {Boolean} isDir true if the entry is a directory, false otherwise.
   * @return {Number} a 32 bit integer.
   *
   * Bit 0     Read-Only
   * Bit 1     Hidden
   * Bit 2     System
   * Bit 3     Volume Label
   * Bit 4     Directory
   * Bit 5     Archive
   */var generateDosExternalFileAttr=function(e){return 63&(e||0)};
/**
   * Generate the various parts used in the construction of the final zip file.
   * @param {Object} streamInfo the hash with information about the compressed file.
   * @param {Boolean} streamedContent is the content streamed ?
   * @param {Boolean} streamingEnded is the stream finished ?
   * @param {number} offset the current offset from the start of the zip file.
   * @param {String} platform let's pretend we are this platform (change platform dependents fields)
   * @param {Function} encodeFileName the function to encode the file name / comment.
   * @return {Object} the zip parts.
   */var generateZipParts=function(r,a,s,o,u,f){var d,h,c=r.file,l=r.compression,p=f!==t.utf8encode,m=e.transformTo("string",f(c.name)),v=e.transformTo("string",t.utf8encode(c.name)),y=c.comment,w=e.transformTo("string",f(y)),g=e.transformTo("string",t.utf8encode(y)),k=v.length!==c.name.length,S=g.length!==y.length,C="",b="",A="",E=c.dir,I=c.date;var _={crc32:0,compressedSize:0,uncompressedSize:0};if(!a||s){_.crc32=r.crc32;_.compressedSize=r.compressedSize;_.uncompressedSize=r.uncompressedSize}var O=0;a&&(O|=8);p||!k&&!S||(O|=2048);var x=0;var T=0;E&&(x|=16);if("UNIX"===u){T=798;x|=generateUnixExternalFileAttr(c.unixPermissions,E)}else{T=20;x|=generateDosExternalFileAttr(c.dosPermissions,E)}d=I.getUTCHours();d<<=6;d|=I.getUTCMinutes();d<<=5;d|=I.getUTCSeconds()/2;h=I.getUTCFullYear()-1980;h<<=4;h|=I.getUTCMonth()+1;h<<=5;h|=I.getUTCDate();if(k){b=decToHex(1,1)+decToHex(i(m),4)+v;C+="up"+decToHex(b.length,2)+b}if(S){A=decToHex(1,1)+decToHex(i(w),4)+g;C+="uc"+decToHex(A.length,2)+A}var $="";$+="\n\0";$+=decToHex(O,2);$+=l.magic;$+=decToHex(d,2);$+=decToHex(h,2);$+=decToHex(_.crc32,4);$+=decToHex(_.compressedSize,4);$+=decToHex(_.uncompressedSize,4);$+=decToHex(m.length,2);$+=decToHex(C.length,2);var R=n.LOCAL_FILE_HEADER+$+m+C;var D=n.CENTRAL_FILE_HEADER+decToHex(T,2)+$+decToHex(w.length,2)+"\0\0\0\0"+decToHex(x,4)+decToHex(o,4)+m+C+w;return{fileRecord:R,dirRecord:D}};
/**
   * Generate the EOCD record.
   * @param {Number} entriesCount the number of entries in the zip file.
   * @param {Number} centralDirLength the length (in bytes) of the central dir.
   * @param {Number} localDirLength the length (in bytes) of the local dir.
   * @param {String} comment the zip file comment as a binary string.
   * @param {Function} encodeFileName the function to encode the comment.
   * @return {String} the EOCD record.
   */var generateCentralDirectoryEnd=function(r,t,i,a,s){var o="";var u=e.transformTo("string",s(a));o=n.CENTRAL_DIRECTORY_END+"\0\0\0\0"+decToHex(r,2)+decToHex(r,2)+decToHex(t,4)+decToHex(i,4)+decToHex(u.length,2)+u;return o};
/**
   * Generate data descriptors for a file entry.
   * @param {Object} streamInfo the hash generated by a worker, containing information
   * on the file entry.
   * @return {String} the data descriptors.
   */var generateDataDescriptors=function(e){var r="";r=n.DATA_DESCRIPTOR+decToHex(e.crc32,4)+decToHex(e.compressedSize,4)+decToHex(e.uncompressedSize,4);return r};
/**
   * A worker to concatenate other workers to create a zip file.
   * @param {Boolean} streamFiles `true` to stream the content of the files,
   * `false` to accumulate it.
   * @param {String} comment the comment to use.
   * @param {String} platform the platform to use, "UNIX" or "DOS".
   * @param {Function} encodeFileName the function to encode file names and comments.
   */function ZipFileWorker(e,t,i,n){r.call(this,"ZipFileWorker");this.bytesWritten=0;this.zipComment=t;this.zipPlatform=i;this.encodeFileName=n;this.streamFiles=e;this.accumulate=false;this.contentBuffer=[];this.dirRecords=[];this.currentSourceOffset=0;this.entriesCount=0;this.currentFile=null;this._sources=[]}e.inherits(ZipFileWorker,r);ZipFileWorker.prototype.push=function(e){var t=e.meta.percent||0;var i=this.entriesCount;var n=this._sources.length;if(this.accumulate)this.contentBuffer.push(e);else{this.bytesWritten+=e.data.length;r.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:i?(t+100*(i-n-1))/i:100}})}};
/**
   * The worker started a new source (an other worker).
   * @param {Object} streamInfo the streamInfo object from the new source.
   */ZipFileWorker.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten;this.currentFile=e.file.name;var r=this.streamFiles&&!e.file.dir;if(r){var t=generateZipParts(e,r,false,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:t.fileRecord,meta:{percent:0}})}else this.accumulate=true};
/**
   * The worker finished a source (an other worker).
   * @param {Object} streamInfo the streamInfo object from the finished source.
   */ZipFileWorker.prototype.closedSource=function(e){this.accumulate=false;var r=this.streamFiles&&!e.file.dir;var t=generateZipParts(e,r,true,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.dirRecords.push(t.dirRecord);if(r)this.push({data:generateDataDescriptors(e),meta:{percent:100}});else{this.push({data:t.fileRecord,meta:{percent:0}});while(this.contentBuffer.length)this.push(this.contentBuffer.shift())}this.currentFile=null};ZipFileWorker.prototype.flush=function(){var e=this.bytesWritten;for(var r=0;r<this.dirRecords.length;r++)this.push({data:this.dirRecords[r],meta:{percent:100}});var t=this.bytesWritten-e;var i=generateCentralDirectoryEnd(this.dirRecords.length,t,e,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})};ZipFileWorker.prototype.prepareNextSource=function(){this.previous=this._sources.shift();this.openedSource(this.previous.streamInfo);this.isPaused?this.previous.pause():this.previous.resume()};ZipFileWorker.prototype.registerPrevious=function(e){this._sources.push(e);var r=this;e.on("data",(function(e){r.processChunk(e)}));e.on("end",(function(){r.closedSource(r.previous.streamInfo);r._sources.length?r.prepareNextSource():r.end()}));e.on("error",(function(e){r.error(e)}));return this};ZipFileWorker.prototype.resume=function(){if(!r.prototype.resume.call(this))return false;if(!this.previous&&this._sources.length){this.prepareNextSource();return true}if(!this.previous&&!this._sources.length&&!this.generatedError){this.end();return true}};ZipFileWorker.prototype.error=function(e){var t=this._sources;if(!r.prototype.error.call(this,e))return false;for(var i=0;i<t.length;i++)try{t[i].error(e)}catch(e){}return true};ZipFileWorker.prototype.lock=function(){r.prototype.lock.call(this);var e=this._sources;for(var t=0;t<e.length;t++)e[t].lock()};G=ZipFileWorker;return G}var Q={},ee=false;function dew$c(){if(ee)return Q;ee=true;var e=dew$f();var r=dew$d();
/**
   * Find the compression to use.
   * @param {String} fileCompression the compression defined at the file level, if any.
   * @param {String} zipCompression the compression defined at the load() level.
   * @return {Object} the compression object to use.
   */var getCompression=function(r,t){var i=r||t;var n=e[i];if(!n)throw new Error(i+" is not a valid compression method !");return n};
/**
   * Create a worker to generate a zip file.
   * @param {JSZip} zip the JSZip instance at the right root level.
   * @param {Object} options to generate the zip file.
   * @param {String} comment the comment to use.
   */Q.generateWorker=function(e,t,i){var n=new r(t.streamFiles,i,t.platform,t.encodeFileName);var a=0;try{e.forEach((function(e,r){a++;var i=getCompression(r.options.compression,t.compression);var s=r.options.compressionOptions||t.compressionOptions||{};var o=r.dir,u=r.date;r._compressWorker(i,s).withStreamInfo("file",{name:e,dir:o,date:u,comment:r.comment||"",unixPermissions:r.unixPermissions,dosPermissions:r.dosPermissions}).pipe(n)}));n.entriesCount=a}catch(e){n.error(e)}return n};return Q}var re={},te=false;function dew$b(){if(te)return re;te=true;var e=dew$t();var r=dew$s();
/**
   * A worker that use a nodejs stream as source.
   * @constructor
   * @param {String} filename the name of the file entry for this stream.
   * @param {Readable} stream the nodejs stream.
   */function NodejsStreamInputAdapter(e,t){r.call(this,"Nodejs stream input adapter for "+e);this._upstreamEnded=false;this._bindStream(t)}e.inherits(NodejsStreamInputAdapter,r);
/**
   * Prepare the stream and bind the callbacks on it.
   * Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
   * @param {Stream} stream the nodejs stream to use.
   */NodejsStreamInputAdapter.prototype._bindStream=function(e){var r=this;this._stream=e;e.pause();e.on("data",(function(e){r.push({data:e,meta:{percent:0}})})).on("error",(function(e){r.isPaused?this.generatedError=e:r.error(e)})).on("end",(function(){r.isPaused?r._upstreamEnded=true:r.end()}))};NodejsStreamInputAdapter.prototype.pause=function(){if(!r.prototype.pause.call(this))return false;this._stream.pause();return true};NodejsStreamInputAdapter.prototype.resume=function(){if(!r.prototype.resume.call(this))return false;this._upstreamEnded?this.end():this._stream.resume();return true};re=NodejsStreamInputAdapter;return re}var ie={},ne=false;function dew$a(){if(ne)return ie;ne=true;var e=dew$r();var r=dew$t();var t=dew$s();var i=dew$o();var n=dew$n();var a=dew$i();var s=dew$h();var o=dew$c();var u=dew$v();var f=dew$b();
/**
   * Add a file in the current folder.
   * @private
   * @param {string} name the name of the file
   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
   * @param {Object} originalOptions the options of the file
   * @return {Object} the new file.
   */var fileAdd=function(e,i,o){var d,h=r.getTypeOf(i);var c=r.extend(o||{},n);c.date=c.date||new Date;null!==c.compression&&(c.compression=c.compression.toUpperCase());"string"===typeof c.unixPermissions&&(c.unixPermissions=parseInt(c.unixPermissions,8));c.unixPermissions&&16384&c.unixPermissions&&(c.dir=true);c.dosPermissions&&16&c.dosPermissions&&(c.dir=true);c.dir&&(e=forceTrailingSlash(e));c.createFolders&&(d=parentFolder(e))&&folderAdd.call(this,d,true);var l="string"===h&&false===c.binary&&false===c.base64;o&&"undefined"!==typeof o.binary||(c.binary=!l);var p=i instanceof a&&0===i.uncompressedSize;if(p||c.dir||!i||0===i.length){c.base64=false;c.binary=true;i="";c.compression="STORE";h="string"}var m=null;m=i instanceof a||i instanceof t?i:u.isNode&&u.isStream(i)?new f(e,i):r.prepareContent(e,i,c.binary,c.optimizedBinaryString,c.base64);var v=new s(e,m,c);this.files[e]=v};
/**
   * Find the parent folder of the path.
   * @private
   * @param {string} path the path to use
   * @return {string} the parent folder, or ""
   */var parentFolder=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var r=e.lastIndexOf("/");return r>0?e.substring(0,r):""};
/**
   * Returns the path with a slash at the end.
   * @private
   * @param {String} path the path to check.
   * @return {String} the path with a trailing slash.
   */var forceTrailingSlash=function(e){"/"!==e.slice(-1)&&(e+="/");return e};
/**
   * Add a (sub) folder in the current folder.
   * @private
   * @param {string} name the folder's name
   * @param {boolean=} [createFolders] If true, automatically create sub
   *  folders. Defaults to false.
   * @return {Object} the new folder.
   */var folderAdd=function(e,r){r="undefined"!==typeof r?r:n.createFolders;e=forceTrailingSlash(e);this.files[e]||fileAdd.call(this,e,null,{dir:true,createFolders:r});return this.files[e]};
/**
  * Cross-window, cross-Node-context regular expression detection
  * @param  {Object}  object Anything
  * @return {Boolean}        true if the object is a regular expression,
  * false otherwise
  */function isRegExp(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var d={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},
/**
     * Call a callback function for each entry at this folder level.
     * @param {Function} cb the callback function:
     * function (relativePath, file) {...}
     * It takes 2 arguments : the relative path and the file.
     */
forEach:function(e){var r,t,i;for(r in this.files){i=this.files[r];t=r.slice(this.root.length,r.length);t&&r.slice(0,this.root.length)===this.root&&e(t,i)}},
/**
     * Filter nested files/folders with the specified function.
     * @param {Function} search the predicate to use :
     * function (relativePath, file) {...}
     * It takes 2 arguments : the relative path and the file.
     * @return {Array} An array of matching elements.
     */
filter:function(e){var r=[];this.forEach((function(t,i){e(t,i)&&r.push(i)}));return r},
/**
     * Add a file to the zip file, or search a file.
     * @param   {string|RegExp} name The name of the file to add (if data is defined),
     * the name of the file to find (if no data) or a regex to match files.
     * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
     * @param   {Object} o     File options
     * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
     * a file (when searching by string) or an array of files (when searching by regex).
     */
file:function(e,r,t){if(1===arguments.length){if(isRegExp(e)){var i=e;return this.filter((function(e,r){return!r.dir&&i.test(e)}))}var n=this.files[this.root+e];return n&&!n.dir?n:null}e=this.root+e;fileAdd.call(this,e,r,t);return this},
/**
     * Add a directory to the zip file, or search.
     * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
     * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
     */
folder:function(e){if(!e)return this;if(isRegExp(e))return this.filter((function(r,t){return t.dir&&e.test(r)}));var r=this.root+e;var t=folderAdd.call(this,r);var i=this.clone();i.root=t.name;return i},
/**
     * Delete a file, or a directory and all sub-files, from the zip
     * @param {string} name the name of the file to delete
     * @return {JSZip} this JSZip object
     */
remove:function(e){e=this.root+e;var r=this.files[e];if(!r){"/"!==e.slice(-1)&&(e+="/");r=this.files[e]}if(r&&!r.dir)delete this.files[e];else{var t=this.filter((function(r,t){return t.name.slice(0,e.length)===e}));for(var i=0;i<t.length;i++)delete this.files[t[i].name]}return this},
/**
     * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
     */
generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},
/**
     * Generate the complete zip file as an internal stream.
     * @param {Object} options the options to generate the zip file :
     * - compression, "STORE" by default.
     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
     * @return {StreamHelper} the streamed zip file.
     */
generateInternalStream:function(n){var a,s={};try{s=r.extend(n||{},{streamFiles:false,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:e.utf8encode});s.type=s.type.toLowerCase();s.compression=s.compression.toUpperCase();"binarystring"===s.type&&(s.type="string");if(!s.type)throw new Error("No output type specified.");r.checkSupport(s.type);"darwin"!==s.platform&&"freebsd"!==s.platform&&"linux"!==s.platform&&"sunos"!==s.platform||(s.platform="UNIX");"win32"===s.platform&&(s.platform="DOS");var u=s.comment||this.comment||"";a=o.generateWorker(this,s,u)}catch(e){a=new t("error");a.error(e)}return new i(a,s.type||"string",s.mimeType)},generateAsync:function(e,r){return this.generateInternalStream(e).accumulate(r)},generateNodeStream:function(e,r){e=e||{};e.type||(e.type="nodebuffer");return this.generateInternalStream(e).toNodejsStream(r)}};ie=d;return ie}var ae={},se=false;function dew$9(){if(se)return ae;se=true;var e=dew$t();function DataReader(e){this.data=e;this.length=e.length;this.index=0;this.zero=0}DataReader.prototype={
/**
     * Check that the offset will not go too far.
     * @param {string} offset the additional offset to check.
     * @throws {Error} an Error if the offset is out of bounds.
     */
checkOffset:function(e){this.checkIndex(this.index+e)},
/**
     * Check that the specified index will not be too far.
     * @param {string} newIndex the index to check.
     * @throws {Error} an Error if the index is out of bounds.
     */
checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},
/**
     * Change the index.
     * @param {number} newIndex The new index.
     * @throws {Error} if the new index is out of the data.
     */
setIndex:function(e){this.checkIndex(e);this.index=e},
/**
     * Skip the next n bytes.
     * @param {number} n the number of bytes to skip.
     * @throws {Error} if the new index is out of the data.
     */
skip:function(e){this.setIndex(this.index+e)},
/**
     * Get the byte at the specified index.
     * @param {number} i the index to use.
     * @return {number} a byte.
     */
byteAt:function(){},
/**
     * Get the next number with a given byte size.
     * @param {number} size the number of bytes to read.
     * @return {number} the corresponding number.
     */
readInt:function(e){var r,t=0;this.checkOffset(e);for(r=this.index+e-1;r>=this.index;r--)t=(t<<8)+this.byteAt(r);this.index+=e;return t},
/**
     * Get the next string with a given byte size.
     * @param {number} size the number of bytes to read.
     * @return {string} the corresponding string.
     */
readString:function(r){return e.transformTo("string",this.readData(r))},
/**
     * Get raw data without conversion, <size> bytes.
     * @param {number} size the number of bytes to read.
     * @return {Object} the raw data, implementation specific.
     */
readData:function(){},
/**
     * Find the last occurrence of a zip signature (4 bytes).
     * @param {string} sig the signature to find.
     * @return {number} the index of the last occurrence, -1 if not found.
     */
lastIndexOfSignature:function(){},
/**
     * Read the signature (4 bytes) at the current position and compare it with sig.
     * @param {string} sig the expected signature
     * @return {boolean} true if the signature matches, false otherwise.
     */
readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}};ae=DataReader;return ae}var oe={},ue=false;function dew$8(){if(ue)return oe;ue=true;var e=dew$9();var r=dew$t();function ArrayReader(r){e.call(this,r);for(var t=0;t<this.data.length;t++)r[t]=255&r[t]}r.inherits(ArrayReader,e);ArrayReader.prototype.byteAt=function(e){return this.data[this.zero+e]};ArrayReader.prototype.lastIndexOfSignature=function(e){var r=e.charCodeAt(0),t=e.charCodeAt(1),i=e.charCodeAt(2),n=e.charCodeAt(3);for(var a=this.length-4;a>=0;--a)if(this.data[a]===r&&this.data[a+1]===t&&this.data[a+2]===i&&this.data[a+3]===n)return a-this.zero;return-1};ArrayReader.prototype.readAndCheckSignature=function(e){var r=e.charCodeAt(0),t=e.charCodeAt(1),i=e.charCodeAt(2),n=e.charCodeAt(3),a=this.readData(4);return r===a[0]&&t===a[1]&&i===a[2]&&n===a[3]};ArrayReader.prototype.readData=function(e){this.checkOffset(e);if(0===e)return[];var r=this.data.slice(this.zero+this.index,this.zero+this.index+e);this.index+=e;return r};oe=ArrayReader;return oe}var fe={},de=false;function dew$7(){if(de)return fe;de=true;var e=dew$9();var r=dew$t();function StringReader(r){e.call(this,r)}r.inherits(StringReader,e);StringReader.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)};StringReader.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero};StringReader.prototype.readAndCheckSignature=function(e){var r=this.readData(4);return e===r};StringReader.prototype.readData=function(e){this.checkOffset(e);var r=this.data.slice(this.zero+this.index,this.zero+this.index+e);this.index+=e;return r};fe=StringReader;return fe}var he={},ce=false;function dew$6(){if(ce)return he;ce=true;var e=dew$8();var r=dew$t();function Uint8ArrayReader(r){e.call(this,r)}r.inherits(Uint8ArrayReader,e);Uint8ArrayReader.prototype.readData=function(e){this.checkOffset(e);if(0===e)return new Uint8Array(0);var r=this.data.subarray(this.zero+this.index,this.zero+this.index+e);this.index+=e;return r};he=Uint8ArrayReader;return he}var le={},pe=false;function dew$5(){if(pe)return le;pe=true;var e=dew$6();var r=dew$t();function NodeBufferReader(r){e.call(this,r)}r.inherits(NodeBufferReader,e);NodeBufferReader.prototype.readData=function(e){this.checkOffset(e);var r=this.data.slice(this.zero+this.index,this.zero+this.index+e);this.index+=e;return r};le=NodeBufferReader;return le}var me={},ve=false;function dew$4(){if(ve)return me;ve=true;var e=dew$t();var r=dew$x();var t=dew$8();var i=dew$7();var n=dew$5();var a=dew$6();
/**
   * Create a reader adapted to the data.
   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
   * @return {DataReader} the data reader.
   */me=function(s){var o=e.getTypeOf(s);e.checkSupport(o);return"string"!==o||r.uint8array?"nodebuffer"===o?new n(s):r.uint8array?new a(e.transformTo("uint8array",s)):new t(e.transformTo("array",s)):new i(s)};return me}var ye={},we=false;function dew$3(){if(we)return ye;we=true;var e=dew$4();var r=dew$t();var t=dew$i();var i=dew$l();var n=dew$r();var a=dew$f();var s=dew$x();var o=0;var u=3;
/**
   * Find a compression registered in JSZip.
   * @param {string} compressionMethod the method magic to find.
   * @return {Object|null} the JSZip compression object, null if none found.
   */var findCompression=function(e){for(var r in a)if(Object.prototype.hasOwnProperty.call(a,r)&&a[r].magic===e)return a[r];return null};
/**
   * An entry in the zip file.
   * @constructor
   * @param {Object} options Options of the current file.
   * @param {Object} loadOptions Options for loading the stream.
   */function ZipEntry(e,r){this.options=e;this.loadOptions=r}ZipEntry.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},
/**
     * Read the local part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
readLocalPart:function(e){var i,n;e.skip(22);this.fileNameLength=e.readInt(2);n=e.readInt(2);this.fileName=e.readData(this.fileNameLength);e.skip(n);if(-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");i=findCompression(this.compressionMethod);if(null===i)throw new Error("Corrupted zip : compression "+r.pretty(this.compressionMethod)+" unknown (inner file : "+r.transformTo("string",this.fileName)+")");this.decompressed=new t(this.compressedSize,this.uncompressedSize,this.crc32,i,e.readData(this.compressedSize))},
/**
     * Read the central part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
readCentralPart:function(e){this.versionMadeBy=e.readInt(2);e.skip(2);this.bitFlag=e.readInt(2);this.compressionMethod=e.readString(2);this.date=e.readDate();this.crc32=e.readInt(4);this.compressedSize=e.readInt(4);this.uncompressedSize=e.readInt(4);var r=e.readInt(2);this.extraFieldsLength=e.readInt(2);this.fileCommentLength=e.readInt(2);this.diskNumberStart=e.readInt(2);this.internalFileAttributes=e.readInt(2);this.externalFileAttributes=e.readInt(4);this.localHeaderOffset=e.readInt(4);if(this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(r);this.readExtraFields(e);this.parseZIP64ExtraField(e);this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null;this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes);e===o&&(this.dosPermissions=63&this.externalFileAttributes);e===u&&(this.unixPermissions=this.externalFileAttributes>>16&65535);this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=true)},
/**
     * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
     * @param {DataReader} reader the reader to use.
     */
parseZIP64ExtraField:function(){if(this.extraFields[1]){var t=e(this.extraFields[1].value);this.uncompressedSize===r.MAX_VALUE_32BITS&&(this.uncompressedSize=t.readInt(8));this.compressedSize===r.MAX_VALUE_32BITS&&(this.compressedSize=t.readInt(8));this.localHeaderOffset===r.MAX_VALUE_32BITS&&(this.localHeaderOffset=t.readInt(8));this.diskNumberStart===r.MAX_VALUE_32BITS&&(this.diskNumberStart=t.readInt(4))}},
/**
     * Read the central part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
readExtraFields:function(e){var r,t,i,n=e.index+this.extraFieldsLength;this.extraFields||(this.extraFields={});while(e.index+4<n){r=e.readInt(2);t=e.readInt(2);i=e.readData(t);this.extraFields[r]={id:r,length:t,value:i}}e.setIndex(n)},handleUTF8:function(){var e=s.uint8array?"uint8array":"array";if(this.useUTF8()){this.fileNameStr=n.utf8decode(this.fileName);this.fileCommentStr=n.utf8decode(this.fileComment)}else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var i=r.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(i)}var a=this.findExtraFieldUnicodeComment();if(null!==a)this.fileCommentStr=a;else{var o=r.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(o)}}},findExtraFieldUnicodePath:function(){var r=this.extraFields[28789];if(r){var t=e(r.value);return 1!==t.readInt(1)||i(this.fileName)!==t.readInt(4)?null:n.utf8decode(t.readData(r.length-5))}return null},findExtraFieldUnicodeComment:function(){var r=this.extraFields[25461];if(r){var t=e(r.value);return 1!==t.readInt(1)||i(this.fileComment)!==t.readInt(4)?null:n.utf8decode(t.readData(r.length-5))}return null}};ye=ZipEntry;return ye}var ge={},ke=false;function dew$2(){if(ke)return ge;ke=true;var e=dew$4();var r=dew$t();var t=dew$e();var i=dew$3();var n=dew$x();
/**
   * All the entries in the zip file.
   * @constructor
   * @param {Object} loadOptions Options for loading the stream.
   */function ZipEntries(e){this.files=[];this.loadOptions=e}ZipEntries.prototype={
/**
     * Check that the reader is on the specified signature.
     * @param {string} expectedSignature the expected signature.
     * @throws {Error} if it is an other signature.
     */
checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+r.pretty(t)+", expected "+r.pretty(e)+")")}},
/**
     * Check if the given signature is at the given index.
     * @param {number} askedIndex the index to check.
     * @param {string} expectedSignature the signature to expect.
     * @return {boolean} true if the signature is here, false otherwise.
     */
isSignature:function(e,r){var t=this.reader.index;this.reader.setIndex(e);var i=this.reader.readString(4);var n=i===r;this.reader.setIndex(t);return n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2);this.diskWithCentralDirStart=this.reader.readInt(2);this.centralDirRecordsOnThisDisk=this.reader.readInt(2);this.centralDirRecords=this.reader.readInt(2);this.centralDirSize=this.reader.readInt(4);this.centralDirOffset=this.reader.readInt(4);this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength);var t=n.uint8array?"uint8array":"array";var i=r.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(i)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8);this.reader.skip(4);this.diskNumber=this.reader.readInt(4);this.diskWithCentralDirStart=this.reader.readInt(4);this.centralDirRecordsOnThisDisk=this.reader.readInt(8);this.centralDirRecords=this.reader.readInt(8);this.centralDirSize=this.reader.readInt(8);this.centralDirOffset=this.reader.readInt(8);this.zip64ExtensibleData={};var e,r,t,i=this.zip64EndOfCentralSize-44,n=0;while(n<i){e=this.reader.readInt(2);r=this.reader.readInt(4);t=this.reader.readData(r);this.zip64ExtensibleData[e]={id:e,length:r,value:t}}},readBlockZip64EndOfCentralLocator:function(){this.diskWithZip64CentralDirStart=this.reader.readInt(4);this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8);this.disksCount=this.reader.readInt(4);if(this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,r;for(e=0;e<this.files.length;e++){r=this.files[e];this.reader.setIndex(r.localHeaderOffset);this.checkSignature(t.LOCAL_FILE_HEADER);r.readLocalPart(this.reader);r.handleUTF8();r.processAttributes()}},readCentralDir:function(){var e;this.reader.setIndex(this.centralDirOffset);while(this.reader.readAndCheckSignature(t.CENTRAL_FILE_HEADER)){e=new i({zip64:this.zip64},this.loadOptions);e.readCentralPart(this.reader);this.files.push(e)}if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(t.CENTRAL_DIRECTORY_END);if(e<0){var i=!this.isSignature(0,t.LOCAL_FILE_HEADER);throw i?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory")}this.reader.setIndex(e);var n=e;this.checkSignature(t.CENTRAL_DIRECTORY_END);this.readBlockEndOfCentral();if(this.diskNumber===r.MAX_VALUE_16BITS||this.diskWithCentralDirStart===r.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===r.MAX_VALUE_16BITS||this.centralDirRecords===r.MAX_VALUE_16BITS||this.centralDirSize===r.MAX_VALUE_32BITS||this.centralDirOffset===r.MAX_VALUE_32BITS){this.zip64=true;e=this.reader.lastIndexOfSignature(t.ZIP64_CENTRAL_DIRECTORY_LOCATOR);if(e<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");this.reader.setIndex(e);this.checkSignature(t.ZIP64_CENTRAL_DIRECTORY_LOCATOR);this.readBlockZip64EndOfCentralLocator();if(!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,t.ZIP64_CENTRAL_DIRECTORY_END)){this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(t.ZIP64_CENTRAL_DIRECTORY_END);if(this.relativeOffsetEndOfZip64CentralDir<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory")}this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);this.checkSignature(t.ZIP64_CENTRAL_DIRECTORY_END);this.readBlockZip64EndOfCentral()}var a=this.centralDirOffset+this.centralDirSize;if(this.zip64){a+=20;a+=12+this.zip64EndOfCentralSize}var s=n-a;if(s>0)this.isSignature(n,t.CENTRAL_FILE_HEADER)||(this.reader.zero=s);else if(s<0)throw new Error("Corrupted zip: missing "+Math.abs(s)+" bytes.")},prepareReader:function(r){this.reader=e(r)},
/**
     * Read a zip file and create ZipEntries.
     * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
     */
load:function(e){this.prepareReader(e);this.readEndOfCentral();this.readCentralDir();this.readLocalFiles()}};ge=ZipEntries;return ge}var Se={},Ce=false;function dew$1(){if(Ce)return Se;Ce=true;var e=dew$t();var r=dew$u();var t=dew$r();var i=dew$2();var n=dew$k();var a=dew$v();
/**
   * Check the CRC32 of an entry.
   * @param {ZipEntry} zipEntry the zip entry to check.
   * @return {Promise} the result.
   */function checkEntryCRC32(e){return new r.Promise((function(r,t){var i=e.decompressed.getContentWorker().pipe(new n);i.on("error",(function(e){t(e)})).on("end",(function(){i.streamInfo.crc32!==e.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):r()})).resume()}))}Se=function(n,s){var o=this;s=e.extend(s||{},{base64:false,checkCRC32:false,optimizedBinaryString:false,createFolders:false,decodeFileName:t.utf8decode});return a.isNode&&a.isStream(n)?r.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):e.prepareContent("the loaded zip file",n,true,s.optimizedBinaryString,s.base64).then((function(e){var r=new i(s);r.load(e);return r})).then((function checkCRC32(e){var t=[r.Promise.resolve(e)];var i=e.files;if(s.checkCRC32)for(var n=0;n<i.length;n++)t.push(checkEntryCRC32(i[n]));return r.Promise.all(t)})).then((function addFiles(r){var t=r.shift();var i=t.files;for(var n=0;n<i.length;n++){var a=i[n];var u=a.fileNameStr;var f=e.resolve(a.fileNameStr);o.file(f,a.decompressed,{binary:true,optimizedBinaryString:true,date:a.date,dir:a.dir,comment:a.fileCommentStr.length?a.fileCommentStr:null,unixPermissions:a.unixPermissions,dosPermissions:a.dosPermissions,createFolders:s.createFolders});a.dir||(o.file(f).unsafeOriginalName=u)}t.zipComment.length&&(o.comment=t.zipComment);return o}))};return Se}var be={},Ae=false;function dew(){if(Ae)return be;Ae=true;function JSZip(){if(!(this instanceof JSZip))return new JSZip;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null);this.comment=null;this.root="";this.clone=function(){var e=new JSZip;for(var r in this)"function"!==typeof this[r]&&(e[r]=this[r]);return e}}JSZip.prototype=dew$a();JSZip.prototype.loadAsync=dew$1();JSZip.support=dew$x();JSZip.defaults=dew$n();JSZip.version="3.10.1";JSZip.loadAsync=function(e,r){return(new JSZip).loadAsync(e,r)};JSZip.external=dew$u();be=JSZip;return be}var Ee=dew();export{Ee as default};

