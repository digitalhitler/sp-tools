"use strict";

const SPSingleton = require('./Singleton');
const SPTOOLS_VERSION = "0.10.1";
const SPTOOLS_MODULES = [ // This modules will be automatically enabled:
                            'DOM',
                            'Utils'
];

const requiredArgument = () => {
  throw new Error('Missing required argument.');
}


if(typeof privatesData === 'undefined') {
  const privatesData = (key, val) => {
    if(key && val) {
      privatesData[key] = val;
    } else if (key) {
      return privatesData[key] || undefined;
    } else {
      return false;
    }
  };
}

class SPTools extends SPSingleton {
  constructor(config) {
    super('SPTools');
    console.log('this:');
    console.dir(this);
    debugger;
    console.log('spsing:');
    console.dir(SPSingleton);
    debugger;
    if(this.__instance) {
      console.log('No instance');
      console.log;
      SPTools.__spToolsVersion = SPTOOLS_VERSION;
      SPTools.instance = this;
      debugger;
    }

    return SPTools.instance;
  }

  static enableModules(modulesList = requiredArgument()) {
    if(modulesList && modulesList.length) {
      for (let module of modulesList) {
        SPTools[module] = require(`./modules/${module}`);
      }
    }
  }
}

console.dir(SPTools);
module.exports = SPTools;
