/******************************************************************************
 * @project sp-tools                                                          *
 * @description Set of tools for easily life inside of browser                *
 * @version 0.9.0                                                             *
 * @repository https://github.com/digitalhitler/sp-tools                      *
 *                                                                            *
 * @author Sergey Petrenko <spetrenko@me.com>                                 *
 * @license Creative Commons Attribution-NonCommercial 4.0                    *
 * @licenseUrl  http://creativecommons.org/licenses/by-nc/4.0/                *
 *                                                                            *
 ******************************************************************************/

/**
 * # playground.js
 *   File used to test & play with features before publishing
 */

"use strict";

let spTools = require('./src/index');
console.log(` * SP-tools ${spTools.__spToolsVersion} loaded.`);
console.dir(spTools);

console.log("\n * Testing globalizing...");
spTools.Globalize();
console.log(SP.__spToolsVersion + " detected in global scope.");