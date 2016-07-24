/******************************************************************************
 * @project sp-tools                                                          *
 * @description Set of tools for easily life inside of browser                *
 * @version 0.9.1                                                             *
 * @repository https://github.com/digitalhitler/sp-tools                      *
 *                                                                            *
 * @author Sergey Petrenko <spetrenko@me.com>                                 *
 * @license Creative Commons Attribution-NonCommercial 4.0                    *
 * @licenseUrl  http://creativecommons.org/licenses/by-nc/4.0/                *
 *                                                                            *
 ******************************************************************************/

/**
 * # index.js
 *   Set of functions and methods used to extend JS native possibilities
 *   with some humanity & usability.
 *
 *   Never extends base prototypes (Number, Object etc.)
 *
 *   @todo: Move to arrow functions everywhere in name of truth.
 */
"use strict";

(function (exports) {

  const TOOLS_VERSION = "0.9.1";

  const EventEmitter = require('./EventEmitter');

  if(typeof spTools === 'undefined') {
    var spTools = {
      __spToolsVersion: TOOLS_VERSION,
      __data: {}
    };
  }

  spTools.App = null;

  spTools.Emitter = new EventEmitter();

  spTools.Globalize = () => {
    let globalScope = (typeof window !== 'undefined' ? window : global);
    if(!globalScope.SP || !globalScope.spTools.__spToolsVersion) {
      globalScope.SP = spTools;
      globalScope.SP.__spToolsGlobalized = true;
    }
  };

  spTools.Const = {
    /**
     * Timespans in seconds and milliseconds for better readability
     */
    ONE_HOUR_S:          3600,
    ONE_DAY_S:          86400,
    ONE_YEAR_S:      31536000,
    ONE_HOUR_MS:      3600000,
    ONE_DAY_MS:      86400000,
    ONE_WEEK_MS:    604800000,
    ONE_MONTH_MS:  2628000000,
    ONE_YEAR_MS:  31536000000,
  };

  spTools.Initializer = {
    add: function(callback) {
      if(callback && typeof callback === "function") {
        spTools.Emitter.once('__core_init', callback);
      } else return false;
    }
  };


  /*** Object ***/
  spTools.Object = {
    isBasedOn: (obj, name) => {
      return (
          obj &&
          typeof obj === "object" &&
          obj instanceof name
      );
    },

    hasValue: (arr, val) => {
      if(arr && arr.length && val) {

      }
    },

    isIterable: (obj) => {
      // checks for null and undefined
      if (obj == null) {
        return false;
      }
      return typeof obj[Symbol.iterator] === 'function';
    },

    isFunction: function(func) {
      return spTools.Utils.isFunction(func);
    },

    extends: Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    },

    /**
     * expects an array of functions returning a promise
     * @todo: Check everything for bullshitance, may (really) contains errors.
     */
    sequentalExecution: function(tasks /* Any Arguments */) {
        var args = Array.prototype.slice.call(arguments, 1);

        return Promise.reduce(tasks, function (results, task) {
            return task.apply(this, args).then(function (result) {
                results.push(result);
                return results;
            });
        }, []);
    }
  };

  spTools.Detector = {
    Viewport: {
      getWidth: function() {
        if (window.innerWidth) {
          return window.innerWidth;
        } else if (document.body && document.body.offsetWidth) {
          return document.body.offsetWidth;
        } else {
          return null;
        }
      },
      getHeight: function() {
        if (window.innerHeight) {
          return window.innerHeight;
        } else if (document.body && document.body.offsetHeight) {
          return document.body.offsetHeight;
        } else {
          return null;
        }
      },
    }
  };

  spTools.DOM = {
    getNode: function(selector) {
      return document.querySelector(selector);
    },

    hasClass: function(el, className) {
      if (el && el.classList && className)
        return el.classList.contains(className);
      else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    },

    deleteClass: function(el, className) {
      el = spTools.DOM.normalizeElement(el);
      if(el && className) {
        if(spTools.DOM.hasClass(el, className)) {
          spTools.DOM.toggleClass(el, className);
          return true;
        } else {
          return null;
        }
      } else {
        return false;
      }
    },

    normalizeElement: function(elem) {
      if(typeof elem === 'string') {
        elem = spTools.DOM.getNode(elem);
      }
      if(spTools.DOM.isDOMElement(elem)) {
        return elem;
      } else return false;
    },

    addClass: function(el, className) {
      if(!spTools.DOM.hasClass(el, className)) {
        spTools.DOM.toggleClass(el, className);
      }
    },

    toggleVisibility: function(node, properDisplay) {
      let elementDisplay;
      if(!properDisplay || typeof properDisplay !== 'string') {
        elementDisplay = 'block';
      } else {
        elementDisplay = properDisplay;
      }
      if(node.style.display === 'none') {
         node.style.display = elementDisplay;
      } else {
        node.style.display = 'none';
      }
    },

    toggleClass: function(el, className) {
      if (el && el.classList) {
        el.classList.toggle(className);
      } else {
        var classes = el.classList.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0)
          classes.splice(existingIndex, 1);
        else
          classes.push(className);

        el.classList = classes.join(' ');
      }
    },

    /**
     * ### isDOMElement
     *     Checks for `elem` is really DOM node (HTMLElement)
     * @param elem
     * @returns {boolean}
     * #### @Todo
     *      Check every browser for proper working
     * #### @History
     *      7/22/2016   Initial version. Maybe broken, not sure.
     */
    isDOMElement: function(elem) {
      return !!(elem instanceof HTMLElement);
    },

    /**
     * ### isFiredInside
     *     Checks for `eventPath` is proper `event.path` tree and is it containts `elementRoot` inside of this.
     *     E.g. this method checks if click has been made inside of `elementRoot` for example.
     * @param eventPath `path` property of Event object.
     * @param elementRoot DOM node of element that has been fired (clicked etc.)
     * @returns {boolean} `true` if `elementRoot`
     */
    isFiredInside: function(eventPath, elementRoot) {
      if(spTools.DOM.isDOMElement(elementRoot) && eventPath && eventPath.length && eventPath.length > 0) {
        for(let curr in eventPath) {
          if(eventPath.hasOwnProperty(curr) && spTools.DOM.isDOMElement(eventPath[curr])) {
            if(eventPath[curr] == elementRoot) {
              return true;
            }
          }
        }
      } else {
        console.warn('spTools.DOM.isFiredInside: invalid data passed in attributes (evenPath, elementRoot)\n', eventPath, elementRoot);
      }
      return false;
    },

    bodyAttribs: {
      get: function(name) {
        let attrNode = document.body.attributes.getNamedItem(name);
        return (attrNode && attrNode.value ? attrNode.value : undefined);
      },
      set: function(name, value) {
        let currentValue = spTools.DOM.bodyAttribs.get(name);
        if(!currentValue) {
          let newValueAttrib = document.createAttribute(name);
          newValueAttrib.value = value;
          document.body.attributes.setNamedItem(newValueAttrib);
        }
      }
    }
  };

  spTools.Utils = {
    randomNumber: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    extractNumbers: function(inputString) {
      let searchForNonNumbers = /\D+/;
      return (searchForNonNumbers.test(inputString) == false);
    },

    removeExtraSpaces: function(string) {
      if("string" !== typeof string) return false;

      let returnString = "";
      let stringArray = string.split(" ");

      for(let i = 0; i < stringArray.length; i++)
      {
        if (stringArray[i]!="")
        {
          if (i == stringArray.length-1)
            returnString += stringArray[i];
          else
            returnString += stringArray[i] + " ";
        }
      }
      return returnString;
    },

    wrapString: function(inputString, wrapLength, delimiter) {
      if (!delimiter) delimiter = '\n';
      if (!wrapLength) wrapLength = inputString.length;
      let buildString = '';

      for (let i = 0; i < inputString.length; i += wrapLength)
      {
        buildString += inputString.slice(i, i + wrapLength) + delimiter;
      }

      return buildString.slice(0, (buildString.length - delimiter.length));
    },

    makeSafeString: function (string, options) {
      options = options || {};

      // Handle the £ symbol separately, since it needs to be removed before the unicode conversion.
      string = string.replace(/£/g, '-');

      // Remove non ascii characters
      // @todo: unidecode  = require('unidecode');
      // string = unidecode(string);

      // Replace URL reserved chars: `@:/?#[]!$&()*+,;=` as well as `\%<>|^~£"{}` and \`
      string = string.replace(/(\s|\.|@|:|\/|\?|#|\[|\]|!|\$|&|\(|\)|\*|\+|,|;|=|\\|%|<|>|\||\^|~|"|\{|\}|`|–|—)/g, '-')
          // Remove apostrophes
          .replace(/'/g, '')
          // Make the whole thing lowercase
          .toLowerCase();

      // Handle whitespace at the beginning or end.
      string = string.trim();

      return string;
    },

    isContaining: function(inputString, checkString, startingIndex) {
      if (!startingIndex) startingIndex = 0;
      return !!(inputString.indexOf(checkString));
    },

    isNumber: function(inputString) {
      return (!isNaN(parseFloat(inputString))) ? true : false;
    },

    isFunction: function(func) {
      return (func && typeof func === "function");
    },

    isShorter: function(inputString, inputLength) {
      return (inputString && inputString.length && inputString.length <= inputLength) ? true : false;
    },

    isLonger: function(inputString, inputLength) {
      return (inputString && inputString.length && inputString.length >= inputLength) ? true : false;
    },
  };

  /*** Registry ***/
  spTools.Registry = {
    get: function(name) {
      if(spTools.Object.isBasedOn(spTools.__data.registry[name], 'Registry')) {
        return spTools.__data.registry[name];
      }
    },

    set: function(name, object) {
      if(name && typeof name === 'string') {
        object = object || null;
        spTools.__data.registry[name] = object;
        return true;
      } else return false;
    }
  };
  spTools.Initializer.add(function() {
    if(!spTools.__data.registry) {
      spTools.__data.registry = {};
    }
  });

  /*** Storage ***/
  spTools.Storage = {
    Cookie: {
      read: function(cookieName) {
        let name = cookieName + "=";
        let ca = document.cookie.split(';');
        if(ca && ca.length && ca.length > 0) {
          for(var i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) { 
              return c.substring(name.length, c.length);
            }
          }
        }
        return null;
      },
      write: function(cookieName, cookieValue, expDays) {
        let d = new Date();
        d.setTime(d.getTime() + (expDays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
      }
    }
  };

  /*** State ***/
  spTools.State = {
    // loadRouteRoot: function(route) {
    //   if(!spTools.State.routes) {
    //     spTools.State.routes = {};
    //   }
    //   if(route && typeof route === "string") {
    //     spTools.State.routes[route] = require();
    //   }
    // }
  };
  spTools.Initializer.add(() => {
    // spTools.State.router = require('page');
    // spTools.State.router.base('/');
  })


  /*** Debugger ***/
  spTools.Debugger = {

    dumpComponent: function(component) {
      if(component.constructor.name !== "Tag") {
        console.error('dump failed: not a proper component:', component);
        return;
      }
      console.info('dump of #' + component._riot_id + ' (' + (component.isMounted ? 'mounted' : 'not mounted') + '):');
      console.log(' * Next floor buddy: ', this.parent,
          ' * Children: ', this.tags,
          ' * Root', this.root,
          ' * Options, params & state:', this.opts, this.params, this.state);
    }
  };

  spTools.Emitter.emit('__core_init');

  // Expose the class either via AMD, CommonJS or the global object
  if (typeof define === 'function' && define.amd) {
      define(function () {
          return spTools;
      });
  }
  else if (typeof module === 'object' && module.exports){
      module.exports = spTools;
  }
  else {
      exports.spTools = spTools;
  }


}(this || {}));