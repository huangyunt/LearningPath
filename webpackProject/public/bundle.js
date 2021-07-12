/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app/Greeter.js":
/*!************************!*\
  !*** ./app/Greeter.js ***!
  \************************/
/***/ ((module) => {

eval("// Greeter.js\nmodule.exports = function() {\n    var greet = document.createElement('div');\n    greet.textContent = \"Hi there and greetings!\";\n    return greet;\n  };//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrcHJvamVjdC8uL2FwcC9HcmVldGVyLmpzP2I0MTMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vYXBwL0dyZWV0ZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBHcmVldGVyLmpzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBncmVldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGdyZWV0LnRleHRDb250ZW50ID0gXCJIaSB0aGVyZSBhbmQgZ3JlZXRpbmdzIVwiO1xuICAgIHJldHVybiBncmVldDtcbiAgfTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./app/Greeter.js\n");

/***/ }),

/***/ "./app/main.js":
/*!*********************!*\
  !*** ./app/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("//main.js \nconst greeter = __webpack_require__(/*! ./Greeter.js */ \"./app/Greeter.js\");\ndocument.querySelector(\"#root\").appendChild(greeter());//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrcHJvamVjdC8uL2FwcC9tYWluLmpzP2YxNjEiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxnQkFBZ0IsbUJBQU8sQ0FBQyxzQ0FBYztBQUN0QyIsImZpbGUiOiIuL2FwcC9tYWluLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9tYWluLmpzIFxuY29uc3QgZ3JlZXRlciA9IHJlcXVpcmUoJy4vR3JlZXRlci5qcycpO1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyb290XCIpLmFwcGVuZENoaWxkKGdyZWV0ZXIoKSk7Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./app/main.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app/main.js");
/******/ 	
/******/ })()
;