/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const queue = [];

Window.prototype.$d = (arg) => {

  if(arg instanceof HTMLElement){
    return new DOMNodeCollection([arg]);
  } else if(arg instanceof Function) {

    if(document.readyState === 'complete'){
      arg();
    } else {
      queue.push(arg);
    }
  } else {
    if(arg[0] === '<' && arg[arg.length - 1] === '>'){
      return new DOMNodeCollection([document.createElement(arg.slice(1, arg.length - 1))]);
    } else {
      let NodeList = document.querySelectorAll(arg);
      NodeList = Array.from(NodeList);
      return new DOMNodeCollection(NodeList);
    }
  }
};

$d.extend = (obj, ...args) => {
  args.forEach((arg) => {
    for(let i in arg) {
      obj[i] = arg[i];
    }
  });
  return obj;
};

$d.ajax = (options) => {
  return new Promise(function(resolve, reject) {
    defaults = {
      method: 'GET',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      data: {},
      url: document.URL,
      success: () => {},
      error: () => {}
    };

    options = $d.extend(defaults, options);
    if(options.method === 'GET'){
      options.url += "?" + addToQueryString(options.data);
    }

    const xhr = new XMLHttpRequest();

    xhr.open(options.method, options.url, true);
    xhr.onload = function() {
      if(xhr.status >= 200 && xhr.status < 300){
        options.success(JSON.parse(xhr.response));
        resolve(JSON.parse(xhr.response));
      } else {
        options.error(xhr.response);
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(JSON.stringify(options.data));
  });
};

addToQueryString = obj => {
  let results = "";
  for(let property in obj){
    if(obj.hasOwnProperty(`${property}`)){
      results += `${property}` + "=" + obj[property] + "&";
    }
  }
  return results.substring(0, results.length - 1);
};

function trigger (array) {
  for (let i = 0; i < array.length; i++) {
    let func = array[i];
    func();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  trigger(queue);
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {

  constructor(arr) {
    this.elements = arr;
    this.elements.forEach ( (el) => el.callbacks = {});
  }

  html(string) {
    if (string) {
      for (let i = 0; i < this.elements.length; i++) {
        let el = this.elements[i];
        el.innerHTML = string;
      }
    } else {
      return this.elements[0].innerHTML;
    }
  }

  empty() {
    for (let i = 0; i <this.elements.length; i++) {
      let el = this.elements[i];
      el.innerHTML = "";
    }
  }

  append(args) {

    if(args instanceof HTMLElement){
      args = window.$d(args);
    }

    if (args instanceof DOMNodeCollection) {
      for (let i = 0; i < this.elements.length; i++) {
        let el = this.elements[i];
        for (let j = 0; j < args.elements.length; j++) {
          el.innerHTML += args.elements[j].outerHTML;
        }
      }
    } else {
      for (let i = 0; i < this.elements.length; i++) {
        let el = this.elements[i];
          el.innerHTML += args;
      }
    }
  }

  attr(name, value) {
    if(value) {
      for ( let i = 0; i < this.elements.length; i++ ) {
        this.elements[i].setAttribute(name, value);
      }
    } else {
      return this.elements[0].getAttribute(name);
    }
  }

  addClass(value) {
    for (let i = 0; i < this.elements.length; i++) {
      let el = this.elements[i];
      el.className ? el.className += ` ${value}` : el.className = value;
    }
  }

  removeClass(arg = null) {
      for (let i = 0; i < this.elements.length; i++) {
        let el = this.elements[i];
        if(arg === null) {
          el.className = "";
        } else {
          el.classList.remove(arg);
        }
      }
    }

  children() {
    let children = [];
    for( let i = 0; i < this.elements.length; i++ ){
      let subArray = Array.from(this.elements[i].children);
      children = children.concat(subArray);
    }
      return new DOMNodeCollection(children);
  }

  parent() {
    let parents = [];
    for( let i = 0; i < this.elements.length; i++ ){
      if (!parents.includes(this.elements[i].parentElement)) {
      parents.push(this.elements[i].parentElement);
    }
  }
      return new DOMNodeCollection(parents);
  }

  find(selec) {
    let descendants = [];
    for (let i = 0; i < this.elements.length; i++) {
      let el = this.elements[i];
      let subArray = Array.from(el.querySelectorAll(selec));
      descendants = descendants.concat(subArray);
    }
    return new DOMNodeCollection(descendants);
  }

  remove() {
    this.elements.forEach ( (el) => {
      el.remove();
    });
    this.elements = [];
  }

  on(type, callback) {
    for (var i = 0; i < this.elements.length; i++) {
      let el = this.elements[i];
      el.addEventListener(type, callback);
      if ( !el.callbacks[type] ) {
        el.callbacks[type] = [callback];
      } else {
        el.callbacks[type].push(callback);
      }
    }
  }

  off(type) {
    for (let i = 0; i < this.elements.length; i++) {
      let el = this.elements[i];
      for(let j = 0; j < el.callbacks[type].length; j++) {
        el.removeEventListener(type, el.callbacks[type][j]);
      }
    }
  }
}


module.exports = DOMNodeCollection;


/***/ })
/******/ ]);
