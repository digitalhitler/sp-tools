class SPSingleton {
  constructor(instanceType) {
    if(!SPSingleton.instances) {
      SPSingleton.instances = {};
      global.SPSingleton = SPSingleton;
    }

    if(!SPSingleton.instances[instanceType]) {
      SPSingleton.instances[instanceType] = this;
    }

    Object.freeze(SPSingleton.instances[instanceType]);
    return {
      __isSingletonInstance: true,
      __instance: SPSingleton.instances[instanceType],
      __instanceType: instanceType
    };
  }

  static get instances() {
    return this.__instances;
  }

  static set instances(newVal) {
    this.__instances = newVal;
  }
}


module.exports = SPSingleton;
