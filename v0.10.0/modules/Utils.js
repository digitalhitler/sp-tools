"use strict";

export default class SPUtils extends SPSingle {

	static extractDomain(url) {
		var match = /\/\/([^\/]+)/.exec(url);
		return match ? match[1] : "";
	}

	static extractAnchor(url) {
		var match = /#(.+)/.exec(url);
		return match ? match[1] : "";
	}

	static cloneObject(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
}