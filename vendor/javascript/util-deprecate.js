// util-deprecate@1.0.2 downloaded from https://ga.jspm.io/npm:util-deprecate@1.0.2/browser.js

var e="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;var r={};r=deprecate;function deprecate(r,t){if(config("noDeprecation"))return r;var n=false;function deprecated(){if(!n){if(config("throwDeprecation"))throw new Error(t);config("traceDeprecation")?console.trace(t):console.warn(t);n=true}return r.apply(this||e,arguments)}return deprecated}function config(r){try{if(!e.localStorage)return false}catch(e){return false}var t=e.localStorage[r];return null!=t&&"true"===String(t).toLowerCase()}var t=r;export default t;

