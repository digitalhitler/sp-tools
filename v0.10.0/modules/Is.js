"use strict";

const isModule = (function() {
  this.prototype.basedOn = (obj, name) => {
    return (
          obj &&
          typeof obj === "obj" &&
          obj instanceof name
      );
  };

  this.prototype.hasPropertyValue = (obj, needleValue, isOwn) => {
    if(!isOwn || typeof isOwn !== 'boolean') {
      isOwn = true;
    }
    if(obj && obj.length > 0) {
      for(let curr in obj) {
        if(obj.hasOwnProperty(curr) || isOwn === true) {
          return true;
        }
      }
    }
    return false;
  }

  this.prototype.iterable = (obj) => {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

  this.prototype.extends = (target) => {
    if(Object.assign) return Object.assign(target);
    
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
})(); 

module.exports = isModule;