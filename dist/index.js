(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
    'string',
    'boolean',
    'number'
];

},{}],2:[function(require,module,exports){
module.exports = [
    'getDefaultProps',
    'getInitialState',

    'constructor',
    'componentWillMount',
    'render',
    'componentDidMount',

    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',

    'componentWillUnmount',

    'isMounted',
    'setState',
    'replaceState',
    'forceUpdate'
];

},{}],3:[function(require,module,exports){
module.exports = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];

},{}],4:[function(require,module,exports){
var ATTRS_TYPES = require('./consts/allowed-attr-types');
var SELF_CLOSING_TAGS = require('./consts/self-closing-tag');
var LIFE_CYCLE_METHODS = require('./consts/life-cycle-methods');

var uuid = require('uuid');

var extend = require('./utils/extend');

var escapeHtml = require('./utils/escape/html');
var escapeAttr = require('./utils/escape/attr');

var dasherize = require('./utils/dasherize');

var hasPrefixes = require('./utils/has-prefixes');
var isContain = require('./utils/is-contain');

/**
 * @typedef {Object} RenderElement
 * @property {Function|String} element.type
 * @property {Object} element.props
 */

/**
 * @param {ReactElement} [element]
 * @param {Object} [options]
 * @param {ICache} [options.cache]
 * @param {Object} [options.context]
 * @param {Boolean} [options.shouldAutobind=false]
 * @returns {String} html
 */
function renderElement(element, options) {
    if (!element) {
        return '';
    }

    var type = element.type;
    var props = element.props;

    if (typeof type === 'string') {
        return renderNativeComponent(type, props, options);
    } else if (typeof type === 'function') {
        if (typeof type.prototype.render === 'function') {
            return renderComponent(type, props, options);
        } else {
            return renderElement(type(props, options && options.context || {}), options);
        }
    }

    return '';
}

/**
 * @param {String} type
 * @param {Object} props
 * @param {Object} [options]
 * @param {ICache} [options.cache]
 * @param {Object} [options.context]
 * @returns {String} html
 */
function renderNativeComponent(type, props, options) {
    var content = '';
    if (type === 'textarea') {
        content = renderChildren([props.value], options);
    } else if (props.dangerouslySetInnerHTML) {
        content = props.dangerouslySetInnerHTML.__html;
    } else if (typeof props.children !== 'undefined') {
        if (type === 'select') {
            content = renderSelect(props, options);
        } else {
            content = renderChildren(
                Array.isArray(props.children) ? props.children : [].concat(props.children),
                options
            );
        }
    }

    var attrs = renderAttrs(type, props);

    if (isContain(SELF_CLOSING_TAGS, type)) {
        return '<' + type + attrs + ' />' + content;
    }

    return '<' + type + attrs + '>' + content + '</' + type + '>';
}

/**
 * @param {Function} Component
 * @param {Object} props
 * @param {Object} [options]
 * @param {ICache} [options.cache]
 * @param {Object} [options.context]
 * @param {Boolean} [options.shouldAutobind=false]
 * @returns {String} html
 */
function renderComponent(Component, props, options) {
    var context = (options && options.context) || {};
    var instance = new Component(props, context);

    var hasCache = typeof instance.getCacheKey === 'function';
    if (hasCache) {
        Component._renderCachePrefix = Component._renderCachePrefix || Component.displayName || uuid.v1();
    }

    var cache = options && options.cache;
    var cacheKey = cache && hasCache ? Component._renderCachePrefix + instance.getCacheKey() : null;

    if (cacheKey && cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    if (typeof instance.getChildContext === 'function') {
        context = extend(context, instance.getChildContext());
    }

    if (options && options.shouldAutobind) {
        for (var key in instance) {
            if (typeof instance[key] === 'function' && !isContain(LIFE_CYCLE_METHODS, key)) {
                instance[key] = instance[key].bind(instance);
            }
        }
    }

    if (typeof instance.componentWillMount === 'function') {
        instance.componentWillMount();
    }

    var html = renderElement(instance.render(), extend(options, {context: context}));

    if (cacheKey) {
        cache.set(cacheKey, html);
    }

    return html;
}

/**
 * @param {Object} props
 * @param {Object} [options]
 * @param {ICache} [options.cache]
 * @param {Object} [options.context]
 * @returns {String} html
 */
function renderSelect(props, options) {
    var value = props.value || props.defaultValue;
    value = !props.multiple ? [value] : value;

    var i = value.length;
    while (i--) {
        value[i] = value[i].toString();
    }
    return renderChildren(markSelectChildren(props.children, value), options);
}

/**
 * @param {RenderElement[]} originalChildren
 * @param {String[]} values
 * @returns {RenderElement} children
 */
function markSelectChildren(originalChildren, values) {
    var children = [].concat(originalChildren);

    var i = children.length;
    while (i--) {
        var type = children[i].type;
        var props = children[i].props;

        var patch = null;
        if (type === 'option' && isContain(values, props.value.toString())) {
            patch = {selected: true};
        }
        if (type === 'optgroup' && Array.isArray(props.children)) {
            patch = {children: markSelectChildren(props.children, values)};
        }

        if (patch) {
            children[i] = extend(children[i], {props: extend(props, patch)});
        }
    }

    return children;
}

/**
 * @param {String[]|String[][]|Number[]|Number[][]} children
 * @param {Object} [options]
 * @param {ICache} [options.cache] Cache instance.
 * @param {Object} [options.context] Render context.
 * @returns {String} html
 */
function renderChildren(children, options) {
    var str = '';

    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (typeof child === 'string') {
            str += escapeHtml(child);
        } else if (Array.isArray(child)) {
            str += renderChildren(child, options);
        } else if (typeof child === 'object' && child) {
            str += renderElement(child, options);
        } else if (typeof child === 'number') {
            str += child;
        }
    }

    return str;
}

/**
 * @param {Object} attrs
 * @returns {String} str
 */
function renderAttrs(tag, attrs) {
    var str = '';

    for (var key in attrs) {
        var value = key === 'style' ? renderStyle(attrs[key]) : attrs[key];

        var isAsIsRenderAttr = false;
        if (typeof value === 'boolean') {
            isAsIsRenderAttr = hasPrefixes(['data-', 'aria-'], key);
        }

        if (value === false && !isAsIsRenderAttr ||
            shouldIgnoreAttr(tag, key) || !isContain(ATTRS_TYPES, typeof value)
        ) {
            continue;
        }

        var attr = key;
        if (key === 'htmlFor') {
            attr = 'for';
        } else if (key === 'className') {
            attr = 'class';
        }

        str += ' ' + attr;

        if (typeof value !== 'boolean' || isAsIsRenderAttr) {
            str += '="' + (typeof value === 'string' ? escapeAttr(value) : value) + '"';
        }
    }

    return str;
}

/**
 * @param {Object} style
 * @returns {String} result
 */
function renderStyle(style) {
    var str = '';
    for (var property in style) {
        str += dasherize(property) + ': ' + style[property] + ';';
    }
    return str;
}

/**
 * @param {String} tag
 * @param {Object} attr
 * @returns {Boolean} shouldIgnore
 */
function shouldIgnoreAttr(tag, attr) {
    if (attr === 'key' || attr === 'children') {
        return true;
    }

    if (tag === 'textarea') {
        return attr === 'value';
    } else if (tag === 'select') {
        return attr === 'value' || attr === 'defaultValue';
    }

    return false;
}

module.exports = {
    elementToString: renderElement
};

},{"./consts/allowed-attr-types":1,"./consts/life-cycle-methods":2,"./consts/self-closing-tag":3,"./utils/dasherize":5,"./utils/escape/attr":6,"./utils/escape/html":7,"./utils/extend":8,"./utils/has-prefixes":9,"./utils/is-contain":10,"uuid":17}],5:[function(require,module,exports){
var PATTERN = /([^A-Z]+)([A-Z])/g;

/**
 * @param {String} str
 * @returns {String} result
 */
module.exports = function (str) {
    return str.replace(PATTERN, '$1-$2').toLowerCase();
};

},{}],6:[function(require,module,exports){
/**
 * @param {String} value
 * @returns {String} result
 */
module.exports = function (value) {
    var escapeAmp = false;
    var escapeQuot = false;

    var i = value.length;
    while (--i >= 0) {
        if (value[i] === '&' && !escapeAmp) {
            escapeAmp = true;
        } else if (value[i] === '"' && !escapeQuot) {
            escapeQuot = true;
        }
    }

    if (escapeAmp) {
        value = value.replace(/&/g, '&amp;');
    }
    if (escapeQuot) {
        value = value.replace(/"/g, '&quot;');
    }

    return value;
};

},{}],7:[function(require,module,exports){
var PATTERN = /[&<>]/;

/**
 * @param {String} value
 * @returns {String} result
 */
module.exports = function (value) {
    if (!PATTERN.test(value)) {
        return value;
    }

    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

},{}],8:[function(require,module,exports){
/**
 * @param {...Object} source
 * @returns {Object} result
 */
module.exports = function (source) {
    var result = {};

    var i = 0;
    while (i < arguments.length) {
        var object = arguments[i++];

        for (var key in object) {
            result[key] = object[key];
        }
    }

    return result;
};

},{}],9:[function(require,module,exports){
/**
 * @param {String} str
 * @param {String[]} prefixes
 * @returns {Boolean} hasPrefixes
 */
module.exports = function (prefixes, str) {
    var i = prefixes.length;
    while (--i >= 0) {
        var j = prefixes[i].length;
        while (--j >= 0) {
            if (prefixes[i][j] !== str[j]) {
                j = -2;
            }
        }

        if (j === -1) {
            return true;
        }
    }

    return false;
};

},{}],10:[function(require,module,exports){
/**
 * @param {String[]} array
 * @param {String} value
 * @returns {Boolean} isContain
 */
module.exports = function (array, value) {
    var i = array.length;
    while (i-- > 0) {
        if (value === array[i]) {
            return true;
        }
    }

    return false;
};

},{}],11:[function(require,module,exports){
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var PropTypes = _interopRequire(__webpack_require__(1));

	var validate = _interopRequire(__webpack_require__(2));

	var validateWithErrors = _interopRequire(__webpack_require__(3));

	var assign = Object.assign || function (target) {
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

	module.exports = assign({}, PropTypes, { validate: validate, validateWithErrors: validateWithErrors });

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	function nullFunction() {
	  return null;
	}

	var ANONYMOUS = "<<anonymous>>";

	// Equivalent of `typeof` but with special handling for array and regexp.
	function getPropType(propValue) {
	  var propType = typeof propValue;
	  if (Array.isArray(propValue)) {
	    return "array";
	  }
	  if (propValue instanceof RegExp) {
	    // Old webkits (at least until Android 4.0) return 'function' rather than
	    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	    // passes PropTypes.object.
	    return "object";
	  }
	  return propType;
	}

	function createChainableTypeChecker(validate) {
	  function checkType(isRequired, props, propName, descriptiveName, location) {
	    descriptiveName = descriptiveName || ANONYMOUS;
	    if (props[propName] == null) {
	      var locationName = location;
	      if (isRequired) {
	        return new Error("Required " + locationName + " `" + propName + "` was not specified in " + ("`" + descriptiveName + "`."));
	      }
	      return null;
	    } else {
	      return validate(props, propName, descriptiveName, location);
	    }
	  }

	  var chainedCheckType = checkType.bind(null, false);
	  chainedCheckType.isRequired = checkType.bind(null, true);

	  return chainedCheckType;
	}

	function createPrimitiveTypeChecker(expectedType) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== expectedType) {
	      var locationName = location;
	      // `propValue` being instance of, say, date/regexp, pass the 'object'
	      // check, but we can offer a more precise error message here rather than
	      // 'of type `object`'.
	      var preciseType = getPreciseType(propValue);

	      return new Error("Invalid " + locationName + " `" + propName + "` of type `" + preciseType + "` " + ("supplied to `" + descriptiveName + "`, expected `" + expectedType + "`."));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createAnyTypeChecker() {
	  return createChainableTypeChecker(nullFunction);
	}

	function createArrayOfTypeChecker(typeChecker) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    if (!Array.isArray(propValue)) {
	      var locationName = location;
	      var propType = getPropType(propValue);
	      return new Error("Invalid " + locationName + " `" + propName + "` of type " + ("`" + propType + "` supplied to `" + descriptiveName + "`, expected an array."));
	    }
	    for (var i = 0; i < propValue.length; i++) {
	      var error = typeChecker(propValue, i, descriptiveName, location);
	      if (error instanceof Error) {
	        return error;
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createInstanceTypeChecker(expectedClass) {
	  function validate(props, propName, descriptiveName, location) {
	    if (!(props[propName] instanceof expectedClass)) {
	      var locationName = location;
	      var expectedClassName = expectedClass.name || ANONYMOUS;
	      return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + descriptiveName + "`, expected instance of `" + expectedClassName + "`."));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createEnumTypeChecker(expectedValues) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    for (var i = 0; i < expectedValues.length; i++) {
	      if (propValue === expectedValues[i]) {
	        return null;
	      }
	    }

	    var locationName = location;
	    var valuesString = JSON.stringify(expectedValues);
	    return new Error("Invalid " + locationName + " `" + propName + "` of value `" + propValue + "` " + ("supplied to `" + descriptiveName + "`, expected one of " + valuesString + "."));
	  }
	  return createChainableTypeChecker(validate);
	}

	function createObjectOfTypeChecker(typeChecker) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== "object") {
	      var locationName = location;
	      return new Error("Invalid " + locationName + " `" + propName + "` of type " + ("`" + propType + "` supplied to `" + descriptiveName + "`, expected an object."));
	    }
	    for (var key in propValue) {
	      if (propValue.hasOwnProperty(key)) {
	        var error = typeChecker(propValue, key, descriptiveName, location);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createUnionTypeChecker(arrayOfTypeCheckers) {
	  function validate(props, propName, descriptiveName, location) {
	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (checker(props, propName, descriptiveName, location) == null) {
	        return null;
	      }
	    }

	    var locationName = location;
	    return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + descriptiveName + "`."));
	  }
	  return createChainableTypeChecker(validate);
	}

	function createShapeTypeChecker(shapeTypes) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== "object") {
	      var locationName = location;
	      return new Error("Invalid " + locationName + " `" + propName + "` of type `" + propType + "` " + ("supplied to `" + descriptiveName + "`, expected `object`."));
	    }
	    for (var key in shapeTypes) {
	      var checker = shapeTypes[key];
	      if (!checker) {
	        continue;
	      }
	      var error = checker(propValue, key, descriptiveName, location);
	      if (error) {
	        return error;
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	// This handles more types than `getPropType`. Only used for error messages.
	// See `createPrimitiveTypeChecker`.
	function getPreciseType(propValue) {
	  var propType = getPropType(propValue);
	  if (propType === "object") {
	    if (propValue instanceof Date) {
	      return "date";
	    } else if (propValue instanceof RegExp) {
	      return "regexp";
	    }
	  }
	  return propType;
	}

	module.exports = {
	  array: createPrimitiveTypeChecker("array"),
	  bool: createPrimitiveTypeChecker("boolean"),
	  func: createPrimitiveTypeChecker("function"),
	  number: createPrimitiveTypeChecker("number"),
	  object: createPrimitiveTypeChecker("object"),
	  string: createPrimitiveTypeChecker("string"),

	  any: createAnyTypeChecker(),
	  arrayOf: createArrayOfTypeChecker,
	  instanceOf: createInstanceTypeChecker,
	  objectOf: createObjectOfTypeChecker,
	  oneOf: createEnumTypeChecker,
	  oneOfType: createUnionTypeChecker,
	  shape: createShapeTypeChecker
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	var invariant = _interopRequire(__webpack_require__(5));

	var warning = _interopRequire(__webpack_require__(4));

	var loggedTypeFailures = {};

	var validate = function (propTypes, props, className) {
	  for (var propName in propTypes) {
	    if (propTypes.hasOwnProperty(propName)) {
	      var error;
	      // Prop type validation may throw. In case they do, we don't want to
	      // fail the render phase where it didn't fail before. So we log it.
	      // After these have been cleaned up, we'll let them throw.
	      try {
	        // This is intentionally an invariant that gets caught. It's the same
	        // behavior as without this statement except with a better message.
	        invariant(typeof propTypes[propName] === "function", "%s: %s type `%s` is invalid; it must be a function, usually from " + "PropTypes.", className, "attributes", propName);

	        error = propTypes[propName](props, propName, className, "prop");
	      } catch (ex) {
	        error = ex;
	      }
	      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	        // Only monitor this failure once because there tends to be a lot of the
	        // same error.
	        loggedTypeFailures[error.message] = true;
	        warning(false, "Failed propType: " + error.message);
	      }
	    }
	  }
	};

	module.exports = validate;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	var invariant = _interopRequire(__webpack_require__(5));

	var validateWithErrors = function (propTypes, props, className) {
	  for (var propName in propTypes) {
	    if (propTypes.hasOwnProperty(propName)) {
	      var error;
	      // Prop type validation may throw. In case they do, we don't want to
	      // fail the render phase where it didn't fail before. So we log it.
	      // After these have been cleaned up, we'll let them throw.
	      try {
	        // This is intentionally an invariant that gets caught. It's the same
	        // behavior as without this statement except with a better message.
	        invariant(typeof propTypes[propName] === "function", "%s: %s type `%s` is invalid; it must be a function, usually from " + "PropTypes.", className, "attributes", propName);

	        error = propTypes[propName](props, propName, className, "prop");
	      } catch (ex) {
	        error = ex;
	      }
	      // rethrow the error
	      if (error instanceof Error) {
	        throw error;
	      }
	    }
	  }
	};

	module.exports = validateWithErrors;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	var warning = function (condition, format) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  if (format === undefined) {
	    throw new Error("`warning(condition, format, ...args)` requires a warning " + "message argument");
	  }

	  if (format.length < 10 || /^[s\W]*$/.test(format)) {
	    throw new Error("The warning format should be able to uniquely identify this " + "warning. Please, use a more descriptive format than: " + format);
	  }

	  if (!condition) {
	    var argIndex = 0;
	    var message = "Warning: " + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    console.warn(message);
	    try {
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  }
	};

	module.exports = warning;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * BSD License
	 *
	 * For Flux software
	 *
	 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 * are permitted provided that the following conditions are met:
	 *
	 *  * Redistributions of source code must retain the above copyright notice, this
	 *    list of conditions and the following disclaimer.
	 *
	 *  * Redistributions in binary form must reproduce the above copyright notice,
	 *    this list of conditions and the following disclaimer in the
	 *    documentation and/or other materials provided with the distribution.
	 *
	 *  * Neither the name Facebook nor the names of its contributors may be used to
	 *    endorse or promote products derived from this software without specific
	 *    prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
	 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
	 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 *
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function (condition, format, a, b, c, d, e, f) {
	  // if (process.env.NODE_ENV !== 'production') {
	  //   if (format === undefined) {
	  //     throw new Error('invariant requires an error message argument');
	  //   }
	  // }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error("Minified exception occurred; use the non-minified dev environment " + "for the full error message and additional helpful warnings.");
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error("Invariant Violation: " + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

/***/ }
/******/ ]);
},{}],12:[function(require,module,exports){
var PropTypes = require('prop-types');

var children = require('./utils/children');
var extend = require('./utils/extend');
var isObject = require('./utils/isObject');

var FastReactServer = {
    Component: function (props, context) {
        this.props = props;
        this.context = context;
    },

    Children: children,

    PropTypes: PropTypes,

    /**
     * @param {Object} decl React component declaration.
     * @returns {Function}
     */
    createClass: function (decl) {
        var mixins = Array.isArray(decl.mixins) ? decl.mixins : [];
        var proto = extend.apply(this, mixins.concat([decl]));

        proto.setState = function (data) {
            this.state = extend(this.state, data);
        };

        var Component = function (props, context) {
            this.props = props;
            this.context = context;

            this.state = this.getInitialState ? this.getInitialState() : {};
        };

        Component.defaultProps = proto.getDefaultProps ? proto.getDefaultProps() : {};

        if (decl.statics) {
            for (var method in decl.statics) {
                Component[method] = decl.statics[method];
            }
        }

        Component.prototype = extend(proto);

        return Component;
    },

    /**
     * @param {Function|String} type
     * @param {Object} [props]
     * @param {...String} [child]
     * @returns {RenderElement} element
     */
    createElement: function (type, props, child) {
        var children = child || props && props.children;

        var i = arguments.length;
        if (i > 3) {
            children = [];

            while (i-- > 2) {
                children[i - 2] = arguments[i];
            }
        }

        return {
            type: type,
            props: extend(type && type.defaultProps, props, {children: children})
        };
    },

    /**
     * @param {RenderElement} element
     * @param {Object} [props]
     * @param {...String} [child]
     * @returns {RenderElement} newElement
     */
    cloneElement: function (element, props) {
        var newArgs = [element.type, extend(element.props, props)];

        var i = arguments.length;
        while (i-- > 2) {
            newArgs[i] = arguments[i];
        }

        return this.createElement.apply(this, newArgs);
    },

    /**
     * @param {*} element
     * @returns {Boolean} isValid
     */
    isValidElement: function (element) {
        return element === null ||
            (isObject(element) && element.hasOwnProperty('type') && isObject(element.props));
    }
};

FastReactServer.PureComponent = FastReactServer.Component;
FastReactServer.PropTypes.element = FastReactServer.PropTypes.instanceOf(FastReactServer.Component);
FastReactServer.PropTypes.node = FastReactServer.PropTypes.object;

module.exports = FastReactServer;

},{"./utils/children":13,"./utils/extend":14,"./utils/isObject":15,"prop-types":11}],13:[function(require,module,exports){
var extend = require('./extend');

module.exports = {
    /**
     * @param {Object[]|Object} [children]
     * @returns {Object[]} children
     */
    toArray: function (children) {
        var childrenArray = toArray(children);

        var result = [];

        var i = childrenArray.length;
        while (--i >= 0) {
            result[i] = extend({key: i}, childrenArray[i]);
        }

        return result;
    },

    /**
     * @param {Object[]|Object} [children]
     * @returns {Number} count
     */
    count: function (children) {
        return Array.isArray(children) ? children.length : (children ? 1 : 0);
    },

    /**
     * @param {Object[]|Object} [children]
     * @returns {Object|null} children
     */
    only: function (children) {
        return !Array.isArray(children) ? children : null;
    },

    /**
     * @param {Object[]|Object} [children]
     * @param {Function} callback
     * @param {Function} [thisArg]
     * @returns {*} result
     */
    map: function (children, callback, thisArg) {
        if (!children) {
            return children;
        }

        var childrenArray = toArray(children);

        var result = [];

        var i = childrenArray.length;
        while (--i >= 0) {
            result[i] = callback.call(thisArg || this, childrenArray[i], i);
        }

        return result;
    },

    /**
     * @param {Object[]|Object} [children]
     * @param {Function} callback
     * @param {Function} [thisArg]
     */
    forEach: function (children, callback, thisArg) {
        if (!children) {
            return children;
        }

        var childrenArray = toArray(children);

        for (var i = 0; i < childrenArray.length; i++) {
            callback.call(thisArg || this, childrenArray[i], i);
        }
    }
};

/**
 * @param {Object[]|Object} [children]
 * @returns {Object[]} children
 */
function toArray(children) {
    return Array.isArray(children) ? children : (children ? [children] : []);
}

},{"./extend":14}],14:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],15:[function(require,module,exports){
module.exports = function (object) {
    return object !== null && typeof object === 'object' && !Array.isArray(object);
};

},{}],16:[function(require,module,exports){
(function (global){

var rng;

if (global.crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],17:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = require('./rng');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;

},{"./rng":16}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fastReactServer = require('fast-react-server');

var _fastReactServer2 = _interopRequireDefault(_fastReactServer);

var _fastReactRender = require('fast-react-render');

var _fastReactRender2 = _interopRequireDefault(_fastReactRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Img = _fastReactServer2.default.createClass({
    displayName: 'Img',

    render: function render() {
        console.log(this.props);
        return _fastReactServer2.default.createElement('span', {}, this.props.text);
    }
});

var App = function (_Component) {
    _inherits(App, _Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return _fastReactServer2.default.createElement(
                'div',
                null,
                _fastReactServer2.default.createElement(Img, { src: 'hello' })
            );
        }
    }]);

    return App;
}(_fastReactServer.Component);

var html = _fastReactRender2.default.elementToString(_fastReactServer2.default.createElement(App, null));
console.log(html);

},{"fast-react-render":4,"fast-react-server":12}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmFzdC1yZWFjdC1yZW5kZXIvc3JjL2NvbnN0cy9hbGxvd2VkLWF0dHItdHlwZXMuanMiLCJub2RlX21vZHVsZXMvZmFzdC1yZWFjdC1yZW5kZXIvc3JjL2NvbnN0cy9saWZlLWN5Y2xlLW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvZmFzdC1yZWFjdC1yZW5kZXIvc3JjL2NvbnN0cy9zZWxmLWNsb3NpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2Zhc3QtcmVhY3QtcmVuZGVyL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mYXN0LXJlYWN0LXJlbmRlci9zcmMvdXRpbHMvZGFzaGVyaXplLmpzIiwibm9kZV9tb2R1bGVzL2Zhc3QtcmVhY3QtcmVuZGVyL3NyYy91dGlscy9lc2NhcGUvYXR0ci5qcyIsIm5vZGVfbW9kdWxlcy9mYXN0LXJlYWN0LXJlbmRlci9zcmMvdXRpbHMvZXNjYXBlL2h0bWwuanMiLCJub2RlX21vZHVsZXMvZmFzdC1yZWFjdC1yZW5kZXIvc3JjL3V0aWxzL2V4dGVuZC5qcyIsIm5vZGVfbW9kdWxlcy9mYXN0LXJlYWN0LXJlbmRlci9zcmMvdXRpbHMvaGFzLXByZWZpeGVzLmpzIiwibm9kZV9tb2R1bGVzL2Zhc3QtcmVhY3QtcmVuZGVyL3NyYy91dGlscy9pcy1jb250YWluLmpzIiwibm9kZV9tb2R1bGVzL2Zhc3QtcmVhY3Qtc2VydmVyL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mYXN0LXJlYWN0LXNlcnZlci9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmFzdC1yZWFjdC1zZXJ2ZXIvc3JjL3V0aWxzL2NoaWxkcmVuLmpzIiwibm9kZV9tb2R1bGVzL2Zhc3QtcmVhY3Qtc2VydmVyL3NyYy91dGlscy9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy91dWlkL3JuZy1icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V1aWQvdXVpZC5qcyIsInNyY1xcaW5kZXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBOzs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN2TEE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxNQUFNLDBCQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUIsWUFBUSxrQkFBWTtBQUNoQixnQkFBUSxHQUFSLENBQVksS0FBSyxLQUFqQjtBQUNBLGVBQU8sMEJBQU0sYUFBTixDQUFvQixNQUFwQixFQUE0QixFQUE1QixFQUFnQyxLQUFLLEtBQUwsQ0FBVyxJQUEzQyxDQUFQO0FBQ0g7QUFKeUIsQ0FBbEIsQ0FBWjs7SUFPTSxHOzs7Ozs7Ozs7OztpQ0FDTztBQUNMLG1CQUNJO0FBQUE7QUFBQTtBQUNFLHdEQUFDLEdBQUQsSUFBSyxLQUFJLE9BQVQ7QUFERixhQURKO0FBS0g7Ozs7OztBQUdMLElBQU0sT0FBTywwQkFBWSxlQUFaLENBQTRCLHdDQUFDLEdBQUQsT0FBNUIsQ0FBYjtBQUNBLFFBQVEsR0FBUixDQUFZLElBQVoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgJ3N0cmluZycsXG4gICAgJ2Jvb2xlYW4nLFxuICAgICdudW1iZXInXG5dO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgJ2dldERlZmF1bHRQcm9wcycsXG4gICAgJ2dldEluaXRpYWxTdGF0ZScsXG5cbiAgICAnY29uc3RydWN0b3InLFxuICAgICdjb21wb25lbnRXaWxsTW91bnQnLFxuICAgICdyZW5kZXInLFxuICAgICdjb21wb25lbnREaWRNb3VudCcsXG5cbiAgICAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsXG4gICAgJ3Nob3VsZENvbXBvbmVudFVwZGF0ZScsXG4gICAgJ2NvbXBvbmVudFdpbGxVcGRhdGUnLFxuICAgICdjb21wb25lbnREaWRVcGRhdGUnLFxuXG4gICAgJ2NvbXBvbmVudFdpbGxVbm1vdW50JyxcblxuICAgICdpc01vdW50ZWQnLFxuICAgICdzZXRTdGF0ZScsXG4gICAgJ3JlcGxhY2VTdGF0ZScsXG4gICAgJ2ZvcmNlVXBkYXRlJ1xuXTtcbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgICdhcmVhJyxcbiAgICAnYmFzZScsXG4gICAgJ2JyJyxcbiAgICAnY29sJyxcbiAgICAnY29tbWFuZCcsXG4gICAgJ2VtYmVkJyxcbiAgICAnaHInLFxuICAgICdpbWcnLFxuICAgICdpbnB1dCcsXG4gICAgJ2tleWdlbicsXG4gICAgJ2xpbmsnLFxuICAgICdtZXRhJyxcbiAgICAncGFyYW0nLFxuICAgICdzb3VyY2UnLFxuICAgICd0cmFjaycsXG4gICAgJ3dicidcbl07XG4iLCJ2YXIgQVRUUlNfVFlQRVMgPSByZXF1aXJlKCcuL2NvbnN0cy9hbGxvd2VkLWF0dHItdHlwZXMnKTtcbnZhciBTRUxGX0NMT1NJTkdfVEFHUyA9IHJlcXVpcmUoJy4vY29uc3RzL3NlbGYtY2xvc2luZy10YWcnKTtcbnZhciBMSUZFX0NZQ0xFX01FVEhPRFMgPSByZXF1aXJlKCcuL2NvbnN0cy9saWZlLWN5Y2xlLW1ldGhvZHMnKTtcblxudmFyIHV1aWQgPSByZXF1aXJlKCd1dWlkJyk7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuL3V0aWxzL2V4dGVuZCcpO1xuXG52YXIgZXNjYXBlSHRtbCA9IHJlcXVpcmUoJy4vdXRpbHMvZXNjYXBlL2h0bWwnKTtcbnZhciBlc2NhcGVBdHRyID0gcmVxdWlyZSgnLi91dGlscy9lc2NhcGUvYXR0cicpO1xuXG52YXIgZGFzaGVyaXplID0gcmVxdWlyZSgnLi91dGlscy9kYXNoZXJpemUnKTtcblxudmFyIGhhc1ByZWZpeGVzID0gcmVxdWlyZSgnLi91dGlscy9oYXMtcHJlZml4ZXMnKTtcbnZhciBpc0NvbnRhaW4gPSByZXF1aXJlKCcuL3V0aWxzL2lzLWNvbnRhaW4nKTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBSZW5kZXJFbGVtZW50XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufFN0cmluZ30gZWxlbWVudC50eXBlXG4gKiBAcHJvcGVydHkge09iamVjdH0gZWxlbWVudC5wcm9wc1xuICovXG5cbi8qKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IFtlbGVtZW50XVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtJQ2FjaGV9IFtvcHRpb25zLmNhY2hlXVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmNvbnRleHRdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNob3VsZEF1dG9iaW5kPWZhbHNlXVxuICogQHJldHVybnMge1N0cmluZ30gaHRtbFxuICovXG5mdW5jdGlvbiByZW5kZXJFbGVtZW50KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gZWxlbWVudC50eXBlO1xuICAgIHZhciBwcm9wcyA9IGVsZW1lbnQucHJvcHM7XG5cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJOYXRpdmVDb21wb25lbnQodHlwZSwgcHJvcHMsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlLnByb3RvdHlwZS5yZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQodHlwZSwgcHJvcHMsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlckVsZW1lbnQodHlwZShwcm9wcywgb3B0aW9ucyAmJiBvcHRpb25zLmNvbnRleHQgfHwge30pLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0lDYWNoZX0gW29wdGlvbnMuY2FjaGVdXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuY29udGV4dF1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IGh0bWxcbiAqL1xuZnVuY3Rpb24gcmVuZGVyTmF0aXZlQ29tcG9uZW50KHR5cGUsIHByb3BzLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRlbnQgPSAnJztcbiAgICBpZiAodHlwZSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgICBjb250ZW50ID0gcmVuZGVyQ2hpbGRyZW4oW3Byb3BzLnZhbHVlXSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCkge1xuICAgICAgICBjb250ZW50ID0gcHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwuX19odG1sO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHByb3BzLmNoaWxkcmVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSByZW5kZXJTZWxlY3QocHJvcHMsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGVudCA9IHJlbmRlckNoaWxkcmVuKFxuICAgICAgICAgICAgICAgIEFycmF5LmlzQXJyYXkocHJvcHMuY2hpbGRyZW4pID8gcHJvcHMuY2hpbGRyZW4gOiBbXS5jb25jYXQocHJvcHMuY2hpbGRyZW4pLFxuICAgICAgICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXR0cnMgPSByZW5kZXJBdHRycyh0eXBlLCBwcm9wcyk7XG5cbiAgICBpZiAoaXNDb250YWluKFNFTEZfQ0xPU0lOR19UQUdTLCB0eXBlKSkge1xuICAgICAgICByZXR1cm4gJzwnICsgdHlwZSArIGF0dHJzICsgJyAvPicgKyBjb250ZW50O1xuICAgIH1cblxuICAgIHJldHVybiAnPCcgKyB0eXBlICsgYXR0cnMgKyAnPicgKyBjb250ZW50ICsgJzwvJyArIHR5cGUgKyAnPic7XG59XG5cbi8qKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ29tcG9uZW50XG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7SUNhY2hlfSBbb3B0aW9ucy5jYWNoZV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5jb250ZXh0XVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG91bGRBdXRvYmluZD1mYWxzZV1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IGh0bWxcbiAqL1xuZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KENvbXBvbmVudCwgcHJvcHMsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCA9IChvcHRpb25zICYmIG9wdGlvbnMuY29udGV4dCkgfHwge307XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG5cbiAgICB2YXIgaGFzQ2FjaGUgPSB0eXBlb2YgaW5zdGFuY2UuZ2V0Q2FjaGVLZXkgPT09ICdmdW5jdGlvbic7XG4gICAgaWYgKGhhc0NhY2hlKSB7XG4gICAgICAgIENvbXBvbmVudC5fcmVuZGVyQ2FjaGVQcmVmaXggPSBDb21wb25lbnQuX3JlbmRlckNhY2hlUHJlZml4IHx8IENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCB1dWlkLnYxKCk7XG4gICAgfVxuXG4gICAgdmFyIGNhY2hlID0gb3B0aW9ucyAmJiBvcHRpb25zLmNhY2hlO1xuICAgIHZhciBjYWNoZUtleSA9IGNhY2hlICYmIGhhc0NhY2hlID8gQ29tcG9uZW50Ll9yZW5kZXJDYWNoZVByZWZpeCArIGluc3RhbmNlLmdldENhY2hlS2V5KCkgOiBudWxsO1xuXG4gICAgaWYgKGNhY2hlS2V5ICYmIGNhY2hlLmhhcyhjYWNoZUtleSkpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlLmdldChjYWNoZUtleSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5nZXRDaGlsZENvbnRleHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29udGV4dCA9IGV4dGVuZChjb250ZXh0LCBpbnN0YW5jZS5nZXRDaGlsZENvbnRleHQoKSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zaG91bGRBdXRvYmluZCkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2Vba2V5XSA9PT0gJ2Z1bmN0aW9uJyAmJiAhaXNDb250YWluKExJRkVfQ1lDTEVfTUVUSE9EUywga2V5KSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlW2tleV0gPSBpbnN0YW5jZVtrZXldLmJpbmQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5jb21wb25lbnRXaWxsTW91bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaW5zdGFuY2UuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgfVxuXG4gICAgdmFyIGh0bWwgPSByZW5kZXJFbGVtZW50KGluc3RhbmNlLnJlbmRlcigpLCBleHRlbmQob3B0aW9ucywge2NvbnRleHQ6IGNvbnRleHR9KSk7XG5cbiAgICBpZiAoY2FjaGVLZXkpIHtcbiAgICAgICAgY2FjaGUuc2V0KGNhY2hlS2V5LCBodG1sKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7SUNhY2hlfSBbb3B0aW9ucy5jYWNoZV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5jb250ZXh0XVxuICogQHJldHVybnMge1N0cmluZ30gaHRtbFxuICovXG5mdW5jdGlvbiByZW5kZXJTZWxlY3QocHJvcHMsIG9wdGlvbnMpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9wcy52YWx1ZSB8fCBwcm9wcy5kZWZhdWx0VmFsdWU7XG4gICAgdmFsdWUgPSAhcHJvcHMubXVsdGlwbGUgPyBbdmFsdWVdIDogdmFsdWU7XG5cbiAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhbHVlW2ldID0gdmFsdWVbaV0udG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlckNoaWxkcmVuKG1hcmtTZWxlY3RDaGlsZHJlbihwcm9wcy5jaGlsZHJlbiwgdmFsdWUpLCBvcHRpb25zKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1JlbmRlckVsZW1lbnRbXX0gb3JpZ2luYWxDaGlsZHJlblxuICogQHBhcmFtIHtTdHJpbmdbXX0gdmFsdWVzXG4gKiBAcmV0dXJucyB7UmVuZGVyRWxlbWVudH0gY2hpbGRyZW5cbiAqL1xuZnVuY3Rpb24gbWFya1NlbGVjdENoaWxkcmVuKG9yaWdpbmFsQ2hpbGRyZW4sIHZhbHVlcykge1xuICAgIHZhciBjaGlsZHJlbiA9IFtdLmNvbmNhdChvcmlnaW5hbENoaWxkcmVuKTtcblxuICAgIHZhciBpID0gY2hpbGRyZW4ubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIHR5cGUgPSBjaGlsZHJlbltpXS50eXBlO1xuICAgICAgICB2YXIgcHJvcHMgPSBjaGlsZHJlbltpXS5wcm9wcztcblxuICAgICAgICB2YXIgcGF0Y2ggPSBudWxsO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ29wdGlvbicgJiYgaXNDb250YWluKHZhbHVlcywgcHJvcHMudmFsdWUudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgIHBhdGNoID0ge3NlbGVjdGVkOiB0cnVlfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gJ29wdGdyb3VwJyAmJiBBcnJheS5pc0FycmF5KHByb3BzLmNoaWxkcmVuKSkge1xuICAgICAgICAgICAgcGF0Y2ggPSB7Y2hpbGRyZW46IG1hcmtTZWxlY3RDaGlsZHJlbihwcm9wcy5jaGlsZHJlbiwgdmFsdWVzKX07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGF0Y2gpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldID0gZXh0ZW5kKGNoaWxkcmVuW2ldLCB7cHJvcHM6IGV4dGVuZChwcm9wcywgcGF0Y2gpfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmdbXXxTdHJpbmdbXVtdfE51bWJlcltdfE51bWJlcltdW119IGNoaWxkcmVuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0lDYWNoZX0gW29wdGlvbnMuY2FjaGVdIENhY2hlIGluc3RhbmNlLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmNvbnRleHRdIFJlbmRlciBjb250ZXh0LlxuICogQHJldHVybnMge1N0cmluZ30gaHRtbFxuICovXG5mdW5jdGlvbiByZW5kZXJDaGlsZHJlbihjaGlsZHJlbiwgb3B0aW9ucykge1xuICAgIHZhciBzdHIgPSAnJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHN0ciArPSBlc2NhcGVIdG1sKGNoaWxkKTtcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgICAgICAgICAgc3RyICs9IHJlbmRlckNoaWxkcmVuKGNoaWxkLCBvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdvYmplY3QnICYmIGNoaWxkKSB7XG4gICAgICAgICAgICBzdHIgKz0gcmVuZGVyRWxlbWVudChjaGlsZCwgb3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgc3RyICs9IGNoaWxkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gYXR0cnNcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0clxuICovXG5mdW5jdGlvbiByZW5kZXJBdHRycyh0YWcsIGF0dHJzKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuXG4gICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtleSA9PT0gJ3N0eWxlJyA/IHJlbmRlclN0eWxlKGF0dHJzW2tleV0pIDogYXR0cnNba2V5XTtcblxuICAgICAgICB2YXIgaXNBc0lzUmVuZGVyQXR0ciA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlzQXNJc1JlbmRlckF0dHIgPSBoYXNQcmVmaXhlcyhbJ2RhdGEtJywgJ2FyaWEtJ10sIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlICYmICFpc0FzSXNSZW5kZXJBdHRyIHx8XG4gICAgICAgICAgICBzaG91bGRJZ25vcmVBdHRyKHRhZywga2V5KSB8fCAhaXNDb250YWluKEFUVFJTX1RZUEVTLCB0eXBlb2YgdmFsdWUpXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXR0ciA9IGtleTtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2h0bWxGb3InKSB7XG4gICAgICAgICAgICBhdHRyID0gJ2Zvcic7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgICAgYXR0ciA9ICdjbGFzcyc7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gJyAnICsgYXR0cjtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicgfHwgaXNBc0lzUmVuZGVyQXR0cikge1xuICAgICAgICAgICAgc3RyICs9ICc9XCInICsgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBlc2NhcGVBdHRyKHZhbHVlKSA6IHZhbHVlKSArICdcIic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxuICogQHJldHVybnMge1N0cmluZ30gcmVzdWx0XG4gKi9cbmZ1bmN0aW9uIHJlbmRlclN0eWxlKHN0eWxlKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHN0eWxlKSB7XG4gICAgICAgIHN0ciArPSBkYXNoZXJpemUocHJvcGVydHkpICsgJzogJyArIHN0eWxlW3Byb3BlcnR5XSArICc7JztcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFnXG4gKiBAcGFyYW0ge09iamVjdH0gYXR0clxuICogQHJldHVybnMge0Jvb2xlYW59IHNob3VsZElnbm9yZVxuICovXG5mdW5jdGlvbiBzaG91bGRJZ25vcmVBdHRyKHRhZywgYXR0cikge1xuICAgIGlmIChhdHRyID09PSAna2V5JyB8fCBhdHRyID09PSAnY2hpbGRyZW4nKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0YWcgPT09ICd0ZXh0YXJlYScpIHtcbiAgICAgICAgcmV0dXJuIGF0dHIgPT09ICd2YWx1ZSc7XG4gICAgfSBlbHNlIGlmICh0YWcgPT09ICdzZWxlY3QnKSB7XG4gICAgICAgIHJldHVybiBhdHRyID09PSAndmFsdWUnIHx8IGF0dHIgPT09ICdkZWZhdWx0VmFsdWUnO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZWxlbWVudFRvU3RyaW5nOiByZW5kZXJFbGVtZW50XG59O1xuIiwidmFyIFBBVFRFUk4gPSAvKFteQS1aXSspKFtBLVpdKS9nO1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHJlc3VsdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoUEFUVEVSTiwgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbn07XG4iLCIvKipcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge1N0cmluZ30gcmVzdWx0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGVzY2FwZUFtcCA9IGZhbHNlO1xuICAgIHZhciBlc2NhcGVRdW90ID0gZmFsc2U7XG5cbiAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aDtcbiAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgaWYgKHZhbHVlW2ldID09PSAnJicgJiYgIWVzY2FwZUFtcCkge1xuICAgICAgICAgICAgZXNjYXBlQW1wID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZVtpXSA9PT0gJ1wiJyAmJiAhZXNjYXBlUXVvdCkge1xuICAgICAgICAgICAgZXNjYXBlUXVvdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXNjYXBlQW1wKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvJi9nLCAnJmFtcDsnKTtcbiAgICB9XG4gICAgaWYgKGVzY2FwZVF1b3QpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xufTtcbiIsInZhciBQQVRURVJOID0gL1smPD5dLztcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHJlc3VsdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghUEFUVEVSTi50ZXN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn07XG4iLCIvKipcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBzb3VyY2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IHJlc3VsdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBhcmd1bWVudHNbaSsrXTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nW119IHByZWZpeGVzXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaGFzUHJlZml4ZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocHJlZml4ZXMsIHN0cikge1xuICAgIHZhciBpID0gcHJlZml4ZXMubGVuZ3RoO1xuICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICB2YXIgaiA9IHByZWZpeGVzW2ldLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKC0taiA+PSAwKSB7XG4gICAgICAgICAgICBpZiAocHJlZml4ZXNbaV1bal0gIT09IHN0cltqXSkge1xuICAgICAgICAgICAgICAgIGogPSAtMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChqID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLyoqXG4gKiBAcGFyYW0ge1N0cmluZ1tdfSBhcnJheVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXNDb250YWluXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFycmF5LCB2YWx1ZSkge1xuICAgIHZhciBpID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gYXJyYXlbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID1cbi8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG5cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG5cblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgUHJvcFR5cGVzID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciB2YWxpZGF0ZSA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDIpKTtcblxuXHR2YXIgdmFsaWRhdGVXaXRoRXJyb3JzID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMykpO1xuXG5cdHZhciBhc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcblx0ICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHQgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblx0ICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcblx0ICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcblx0ICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiB0YXJnZXQ7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBhc3NpZ24oe30sIFByb3BUeXBlcywgeyB2YWxpZGF0ZTogdmFsaWRhdGUsIHZhbGlkYXRlV2l0aEVycm9yczogdmFsaWRhdGVXaXRoRXJyb3JzIH0pO1xuXG4vKioqLyB9LFxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG5cdCAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuXHQgKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcblx0ICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG5cdCAqXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIG51bGxGdW5jdGlvbigpIHtcblx0ICByZXR1cm4gbnVsbDtcblx0fVxuXG5cdHZhciBBTk9OWU1PVVMgPSBcIjw8YW5vbnltb3VzPj5cIjtcblxuXHQvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG5cdGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuXHQgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG5cdCAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuXHQgICAgcmV0dXJuIFwiYXJyYXlcIjtcblx0ICB9XG5cdCAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuXHQgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuXHQgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG5cdCAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cblx0ICAgIHJldHVybiBcIm9iamVjdFwiO1xuXHQgIH1cblx0ICByZXR1cm4gcHJvcFR5cGU7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuXHQgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGRlc2NyaXB0aXZlTmFtZSwgbG9jYXRpb24pIHtcblx0ICAgIGRlc2NyaXB0aXZlTmFtZSA9IGRlc2NyaXB0aXZlTmFtZSB8fCBBTk9OWU1PVVM7XG5cdCAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcblx0ICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IGxvY2F0aW9uO1xuXHQgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuXHQgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJSZXF1aXJlZCBcIiArIGxvY2F0aW9uTmFtZSArIFwiIGBcIiArIHByb3BOYW1lICsgXCJgIHdhcyBub3Qgc3BlY2lmaWVkIGluIFwiICsgKFwiYFwiICsgZGVzY3JpcHRpdmVOYW1lICsgXCJgLlwiKSk7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBkZXNjcmlwdGl2ZU5hbWUsIGxvY2F0aW9uKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcblx0ICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuXHQgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG5cdCAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBkZXNjcmlwdGl2ZU5hbWUsIGxvY2F0aW9uKSB7XG5cdCAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuXHQgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcblx0ICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG5cdCAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBsb2NhdGlvbjtcblx0ICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG5cdCAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuXHQgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG5cdCAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cblx0ICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkludmFsaWQgXCIgKyBsb2NhdGlvbk5hbWUgKyBcIiBgXCIgKyBwcm9wTmFtZSArIFwiYCBvZiB0eXBlIGBcIiArIHByZWNpc2VUeXBlICsgXCJgIFwiICsgKFwic3VwcGxpZWQgdG8gYFwiICsgZGVzY3JpcHRpdmVOYW1lICsgXCJgLCBleHBlY3RlZCBgXCIgKyBleHBlY3RlZFR5cGUgKyBcImAuXCIpKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG5cdCAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKG51bGxGdW5jdGlvbik7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcblx0ICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGRlc2NyaXB0aXZlTmFtZSwgbG9jYXRpb24pIHtcblx0ICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG5cdCAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuXHQgICAgICB2YXIgbG9jYXRpb25OYW1lID0gbG9jYXRpb247XG5cdCAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG5cdCAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb25OYW1lICsgXCIgYFwiICsgcHJvcE5hbWUgKyBcImAgb2YgdHlwZSBcIiArIChcImBcIiArIHByb3BUeXBlICsgXCJgIHN1cHBsaWVkIHRvIGBcIiArIGRlc2NyaXB0aXZlTmFtZSArIFwiYCwgZXhwZWN0ZWQgYW4gYXJyYXkuXCIpKTtcblx0ICAgIH1cblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgZGVzY3JpcHRpdmVOYW1lLCBsb2NhdGlvbik7XG5cdCAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG5cdCAgICAgICAgcmV0dXJuIGVycm9yO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbnVsbDtcblx0ICB9XG5cdCAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuXHQgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgZGVzY3JpcHRpdmVOYW1lLCBsb2NhdGlvbikge1xuXHQgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcblx0ICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IGxvY2F0aW9uO1xuXHQgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuXHQgICAgICByZXR1cm4gbmV3IEVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uTmFtZSArIFwiIGBcIiArIHByb3BOYW1lICsgXCJgIHN1cHBsaWVkIHRvIFwiICsgKFwiYFwiICsgZGVzY3JpcHRpdmVOYW1lICsgXCJgLCBleHBlY3RlZCBpbnN0YW5jZSBvZiBgXCIgKyBleHBlY3RlZENsYXNzTmFtZSArIFwiYC5cIikpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG51bGw7XG5cdCAgfVxuXHQgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcblx0ICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGRlc2NyaXB0aXZlTmFtZSwgbG9jYXRpb24pIHtcblx0ICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIGlmIChwcm9wVmFsdWUgPT09IGV4cGVjdGVkVmFsdWVzW2ldKSB7XG5cdCAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIGxvY2F0aW9uTmFtZSA9IGxvY2F0aW9uO1xuXHQgICAgdmFyIHZhbHVlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkVmFsdWVzKTtcblx0ICAgIHJldHVybiBuZXcgRXJyb3IoXCJJbnZhbGlkIFwiICsgbG9jYXRpb25OYW1lICsgXCIgYFwiICsgcHJvcE5hbWUgKyBcImAgb2YgdmFsdWUgYFwiICsgcHJvcFZhbHVlICsgXCJgIFwiICsgKFwic3VwcGxpZWQgdG8gYFwiICsgZGVzY3JpcHRpdmVOYW1lICsgXCJgLCBleHBlY3RlZCBvbmUgb2YgXCIgKyB2YWx1ZXNTdHJpbmcgKyBcIi5cIikpO1xuXHQgIH1cblx0ICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuXHQgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgZGVzY3JpcHRpdmVOYW1lLCBsb2NhdGlvbikge1xuXHQgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcblx0ICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG5cdCAgICBpZiAocHJvcFR5cGUgIT09IFwib2JqZWN0XCIpIHtcblx0ICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IGxvY2F0aW9uO1xuXHQgICAgICByZXR1cm4gbmV3IEVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uTmFtZSArIFwiIGBcIiArIHByb3BOYW1lICsgXCJgIG9mIHR5cGUgXCIgKyAoXCJgXCIgKyBwcm9wVHlwZSArIFwiYCBzdXBwbGllZCB0byBgXCIgKyBkZXNjcmlwdGl2ZU5hbWUgKyBcImAsIGV4cGVjdGVkIGFuIG9iamVjdC5cIikpO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuXHQgICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0ICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgZGVzY3JpcHRpdmVOYW1lLCBsb2NhdGlvbik7XG5cdCAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0ICAgICAgICAgIHJldHVybiBlcnJvcjtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG5cdCAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBkZXNjcmlwdGl2ZU5hbWUsIGxvY2F0aW9uKSB7XG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuXHQgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGRlc2NyaXB0aXZlTmFtZSwgbG9jYXRpb24pID09IG51bGwpIHtcblx0ICAgICAgICByZXR1cm4gbnVsbDtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICB2YXIgbG9jYXRpb25OYW1lID0gbG9jYXRpb247XG5cdCAgICByZXR1cm4gbmV3IEVycm9yKFwiSW52YWxpZCBcIiArIGxvY2F0aW9uTmFtZSArIFwiIGBcIiArIHByb3BOYW1lICsgXCJgIHN1cHBsaWVkIHRvIFwiICsgKFwiYFwiICsgZGVzY3JpcHRpdmVOYW1lICsgXCJgLlwiKSk7XG5cdCAgfVxuXHQgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcblx0ICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGRlc2NyaXB0aXZlTmFtZSwgbG9jYXRpb24pIHtcblx0ICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG5cdCAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuXHQgICAgaWYgKHByb3BUeXBlICE9PSBcIm9iamVjdFwiKSB7XG5cdCAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBsb2NhdGlvbjtcblx0ICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIkludmFsaWQgXCIgKyBsb2NhdGlvbk5hbWUgKyBcIiBgXCIgKyBwcm9wTmFtZSArIFwiYCBvZiB0eXBlIGBcIiArIHByb3BUeXBlICsgXCJgIFwiICsgKFwic3VwcGxpZWQgdG8gYFwiICsgZGVzY3JpcHRpdmVOYW1lICsgXCJgLCBleHBlY3RlZCBgb2JqZWN0YC5cIikpO1xuXHQgICAgfVxuXHQgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcblx0ICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG5cdCAgICAgIGlmICghY2hlY2tlcikge1xuXHQgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGRlc2NyaXB0aXZlTmFtZSwgbG9jYXRpb24pO1xuXHQgICAgICBpZiAoZXJyb3IpIHtcblx0ICAgICAgICByZXR1cm4gZXJyb3I7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBudWxsO1xuXHQgIH1cblx0ICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuXHR9XG5cblx0Ly8gVGhpcyBoYW5kbGVzIG1vcmUgdHlwZXMgdGhhbiBgZ2V0UHJvcFR5cGVgLiBPbmx5IHVzZWQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuXHQvLyBTZWUgYGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyYC5cblx0ZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG5cdCAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcblx0ICBpZiAocHJvcFR5cGUgPT09IFwib2JqZWN0XCIpIHtcblx0ICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG5cdCAgICAgIHJldHVybiBcImRhdGVcIjtcblx0ICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdCAgICAgIHJldHVybiBcInJlZ2V4cFwiO1xuXHQgICAgfVxuXHQgIH1cblx0ICByZXR1cm4gcHJvcFR5cGU7XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJhcnJheVwiKSxcblx0ICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcImJvb2xlYW5cIiksXG5cdCAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJmdW5jdGlvblwiKSxcblx0ICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKFwibnVtYmVyXCIpLFxuXHQgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoXCJvYmplY3RcIiksXG5cdCAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihcInN0cmluZ1wiKSxcblxuXHQgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcblx0ICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG5cdCAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcblx0ICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcblx0ICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuXHQgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcblx0ICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlclxuXHR9O1xuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0LyoqXG5cdCAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG5cdCAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuXHQgKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcblx0ICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG5cdCAqXG5cdCAqL1xuXG5cdHZhciBpbnZhcmlhbnQgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg1KSk7XG5cblx0dmFyIHdhcm5pbmcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg0KSk7XG5cblx0dmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuXG5cdHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uIChwcm9wVHlwZXMsIHByb3BzLCBjbGFzc05hbWUpIHtcblx0ICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wVHlwZXMpIHtcblx0ICAgIGlmIChwcm9wVHlwZXMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG5cdCAgICAgIHZhciBlcnJvcjtcblx0ICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cblx0ICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuXHQgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG5cdCAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuXHQgICAgICAgIGludmFyaWFudCh0eXBlb2YgcHJvcFR5cGVzW3Byb3BOYW1lXSA9PT0gXCJmdW5jdGlvblwiLCBcIiVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gXCIgKyBcIlByb3BUeXBlcy5cIiwgY2xhc3NOYW1lLCBcImF0dHJpYnV0ZXNcIiwgcHJvcE5hbWUpO1xuXG5cdCAgICAgICAgZXJyb3IgPSBwcm9wVHlwZXNbcHJvcE5hbWVdKHByb3BzLCBwcm9wTmFtZSwgY2xhc3NOYW1lLCBcInByb3BcIik7XG5cdCAgICAgIH0gY2F0Y2ggKGV4KSB7XG5cdCAgICAgICAgZXJyb3IgPSBleDtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuXHQgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuXHQgICAgICAgIC8vIHNhbWUgZXJyb3IuXG5cdCAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblx0ICAgICAgICB3YXJuaW5nKGZhbHNlLCBcIkZhaWxlZCBwcm9wVHlwZTogXCIgKyBlcnJvci5tZXNzYWdlKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRlO1xuXG4vKioqLyB9LFxuLyogMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0LyoqXG5cdCAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG5cdCAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuXHQgKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcblx0ICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG5cdCAqXG5cdCAqL1xuXG5cdHZhciBpbnZhcmlhbnQgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg1KSk7XG5cblx0dmFyIHZhbGlkYXRlV2l0aEVycm9ycyA9IGZ1bmN0aW9uIChwcm9wVHlwZXMsIHByb3BzLCBjbGFzc05hbWUpIHtcblx0ICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wVHlwZXMpIHtcblx0ICAgIGlmIChwcm9wVHlwZXMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG5cdCAgICAgIHZhciBlcnJvcjtcblx0ICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cblx0ICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuXHQgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG5cdCAgICAgIHRyeSB7XG5cdCAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG5cdCAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuXHQgICAgICAgIGludmFyaWFudCh0eXBlb2YgcHJvcFR5cGVzW3Byb3BOYW1lXSA9PT0gXCJmdW5jdGlvblwiLCBcIiVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gXCIgKyBcIlByb3BUeXBlcy5cIiwgY2xhc3NOYW1lLCBcImF0dHJpYnV0ZXNcIiwgcHJvcE5hbWUpO1xuXG5cdCAgICAgICAgZXJyb3IgPSBwcm9wVHlwZXNbcHJvcE5hbWVdKHByb3BzLCBwcm9wTmFtZSwgY2xhc3NOYW1lLCBcInByb3BcIik7XG5cdCAgICAgIH0gY2F0Y2ggKGV4KSB7XG5cdCAgICAgICAgZXJyb3IgPSBleDtcblx0ICAgICAgfVxuXHQgICAgICAvLyByZXRocm93IHRoZSBlcnJvclxuXHQgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuXHQgICAgICAgIHRocm93IGVycm9yO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGVXaXRoRXJyb3JzO1xuXG4vKioqLyB9LFxuLyogNCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG5cdCAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cdCAqXG5cdCAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuXHQgKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcblx0ICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG5cdCAqXG5cdCAqL1xuXG5cdHZhciB3YXJuaW5nID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG5cdCAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdCAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcblx0ICB9XG5cblx0ICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcihcImB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nIFwiICsgXCJtZXNzYWdlIGFyZ3VtZW50XCIpO1xuXHQgIH1cblxuXHQgIGlmIChmb3JtYXQubGVuZ3RoIDwgMTAgfHwgL15bc1xcV10qJC8udGVzdChmb3JtYXQpKSB7XG5cdCAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgd2FybmluZyBmb3JtYXQgc2hvdWxkIGJlIGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBcIiArIFwid2FybmluZy4gUGxlYXNlLCB1c2UgYSBtb3JlIGRlc2NyaXB0aXZlIGZvcm1hdCB0aGFuOiBcIiArIGZvcm1hdCk7XG5cdCAgfVxuXG5cdCAgaWYgKCFjb25kaXRpb24pIHtcblx0ICAgIHZhciBhcmdJbmRleCA9IDA7XG5cdCAgICB2YXIgbWVzc2FnZSA9IFwiV2FybmluZzogXCIgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuXHQgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcblx0ICAgIH0pO1xuXHQgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuXHQgICAgdHJ5IHtcblx0ICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG5cdCAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdCAgICB9IGNhdGNoICh4KSB7fVxuXHQgIH1cblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7XG5cbi8qKiovIH0sXG4vKiA1ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKipcblx0ICogQlNEIExpY2Vuc2Vcblx0ICpcblx0ICogRm9yIEZsdXggc29mdHdhcmVcblx0ICpcblx0ICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXHQgKlxuXHQgKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuXHQgKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cdCAqXG5cdCAqICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpc1xuXHQgKiAgICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cblx0ICpcblx0ICogICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuXHQgKiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuXHQgKiAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXHQgKlxuXHQgKiAgKiBOZWl0aGVyIHRoZSBuYW1lIEZhY2Vib29rIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0b1xuXHQgKiAgICBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpY1xuXHQgKiAgICBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5cdCAqXG5cdCAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuXHQgKiBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuXHQgKiBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFXG5cdCAqIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5cdCAqIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuXHQgKiAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG5cdCAqIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuXHQgKiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuXHQgKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuXHQgKiBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cblx0ICpcblx0ICovXG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cblx0ICpcblx0ICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcblx0ICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG5cdCAqIGV4cGVjdGluZy5cblx0ICpcblx0ICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcblx0ICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuXHQgKi9cblxuXHR2YXIgaW52YXJpYW50ID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG5cdCAgLy8gaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcblx0ICAvLyAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuXHQgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG5cdCAgLy8gICB9XG5cdCAgLy8gfVxuXG5cdCAgaWYgKCFjb25kaXRpb24pIHtcblx0ICAgIHZhciBlcnJvcjtcblx0ICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICBlcnJvciA9IG5ldyBFcnJvcihcIk1pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50IFwiICsgXCJmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLlwiKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuXHQgICAgICB2YXIgYXJnSW5kZXggPSAwO1xuXHQgICAgICBlcnJvciA9IG5ldyBFcnJvcihcIkludmFyaWFudCBWaW9sYXRpb246IFwiICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcblx0ICAgICAgfSkpO1xuXHQgICAgfVxuXG5cdCAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG5cdCAgICB0aHJvdyBlcnJvcjtcblx0ICB9XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG5cbi8qKiovIH1cbi8qKioqKiovIF0pOyIsInZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG5cbnZhciBjaGlsZHJlbiA9IHJlcXVpcmUoJy4vdXRpbHMvY2hpbGRyZW4nKTtcbnZhciBleHRlbmQgPSByZXF1aXJlKCcuL3V0aWxzL2V4dGVuZCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi91dGlscy9pc09iamVjdCcpO1xuXG52YXIgRmFzdFJlYWN0U2VydmVyID0ge1xuICAgIENvbXBvbmVudDogZnVuY3Rpb24gKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB9LFxuXG4gICAgQ2hpbGRyZW46IGNoaWxkcmVuLFxuXG4gICAgUHJvcFR5cGVzOiBQcm9wVHlwZXMsXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVjbCBSZWFjdCBjb21wb25lbnQgZGVjbGFyYXRpb24uXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGNyZWF0ZUNsYXNzOiBmdW5jdGlvbiAoZGVjbCkge1xuICAgICAgICB2YXIgbWl4aW5zID0gQXJyYXkuaXNBcnJheShkZWNsLm1peGlucykgPyBkZWNsLm1peGlucyA6IFtdO1xuICAgICAgICB2YXIgcHJvdG8gPSBleHRlbmQuYXBwbHkodGhpcywgbWl4aW5zLmNvbmNhdChbZGVjbF0pKTtcblxuICAgICAgICBwcm90by5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gZXh0ZW5kKHRoaXMuc3RhdGUsIGRhdGEpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBDb21wb25lbnQgPSBmdW5jdGlvbiAocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldEluaXRpYWxTdGF0ZSA/IHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkgOiB7fTtcbiAgICAgICAgfTtcblxuICAgICAgICBDb21wb25lbnQuZGVmYXVsdFByb3BzID0gcHJvdG8uZ2V0RGVmYXVsdFByb3BzID8gcHJvdG8uZ2V0RGVmYXVsdFByb3BzKCkgOiB7fTtcblxuICAgICAgICBpZiAoZGVjbC5zdGF0aWNzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBtZXRob2QgaW4gZGVjbC5zdGF0aWNzKSB7XG4gICAgICAgICAgICAgICAgQ29tcG9uZW50W21ldGhvZF0gPSBkZWNsLnN0YXRpY3NbbWV0aG9kXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUgPSBleHRlbmQocHJvdG8pO1xuXG4gICAgICAgIHJldHVybiBDb21wb25lbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSB0eXBlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtwcm9wc11cbiAgICAgKiBAcGFyYW0gey4uLlN0cmluZ30gW2NoaWxkXVxuICAgICAqIEByZXR1cm5zIHtSZW5kZXJFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24gKHR5cGUsIHByb3BzLCBjaGlsZCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBjaGlsZCB8fCBwcm9wcyAmJiBwcm9wcy5jaGlsZHJlbjtcblxuICAgICAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGlmIChpID4gMykge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAgICAgd2hpbGUgKGktLSA+IDIpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltpIC0gMl0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHByb3BzOiBleHRlbmQodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcywgcHJvcHMsIHtjaGlsZHJlbjogY2hpbGRyZW59KVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1JlbmRlckVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3Byb3BzXVxuICAgICAqIEBwYXJhbSB7Li4uU3RyaW5nfSBbY2hpbGRdXG4gICAgICogQHJldHVybnMge1JlbmRlckVsZW1lbnR9IG5ld0VsZW1lbnRcbiAgICAgKi9cbiAgICBjbG9uZUVsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50LCBwcm9wcykge1xuICAgICAgICB2YXIgbmV3QXJncyA9IFtlbGVtZW50LnR5cGUsIGV4dGVuZChlbGVtZW50LnByb3BzLCBwcm9wcyldO1xuXG4gICAgICAgIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSA+IDIpIHtcbiAgICAgICAgICAgIG5ld0FyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFbGVtZW50LmFwcGx5KHRoaXMsIG5ld0FyZ3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0geyp9IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXNWYWxpZFxuICAgICAqL1xuICAgIGlzVmFsaWRFbGVtZW50OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudCA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgKGlzT2JqZWN0KGVsZW1lbnQpICYmIGVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ3R5cGUnKSAmJiBpc09iamVjdChlbGVtZW50LnByb3BzKSk7XG4gICAgfVxufTtcblxuRmFzdFJlYWN0U2VydmVyLlB1cmVDb21wb25lbnQgPSBGYXN0UmVhY3RTZXJ2ZXIuQ29tcG9uZW50O1xuRmFzdFJlYWN0U2VydmVyLlByb3BUeXBlcy5lbGVtZW50ID0gRmFzdFJlYWN0U2VydmVyLlByb3BUeXBlcy5pbnN0YW5jZU9mKEZhc3RSZWFjdFNlcnZlci5Db21wb25lbnQpO1xuRmFzdFJlYWN0U2VydmVyLlByb3BUeXBlcy5ub2RlID0gRmFzdFJlYWN0U2VydmVyLlByb3BUeXBlcy5vYmplY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gRmFzdFJlYWN0U2VydmVyO1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0W118T2JqZWN0fSBbY2hpbGRyZW5dXG4gICAgICogQHJldHVybnMge09iamVjdFtdfSBjaGlsZHJlblxuICAgICAqL1xuICAgIHRvQXJyYXk6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICB2YXIgY2hpbGRyZW5BcnJheSA9IHRvQXJyYXkoY2hpbGRyZW4pO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICB2YXIgaSA9IGNoaWxkcmVuQXJyYXkubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IGV4dGVuZCh7a2V5OiBpfSwgY2hpbGRyZW5BcnJheVtpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfE9iamVjdH0gW2NoaWxkcmVuXVxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9IGNvdW50XG4gICAgICovXG4gICAgY291bnQ6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbi5sZW5ndGggOiAoY2hpbGRyZW4gPyAxIDogMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0W118T2JqZWN0fSBbY2hpbGRyZW5dXG4gICAgICogQHJldHVybnMge09iamVjdHxudWxsfSBjaGlsZHJlblxuICAgICAqL1xuICAgIG9ubHk6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gIUFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4gOiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfE9iamVjdH0gW2NoaWxkcmVuXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoaXNBcmddXG4gICAgICogQHJldHVybnMgeyp9IHJlc3VsdFxuICAgICAqL1xuICAgIG1hcDogZnVuY3Rpb24gKGNoaWxkcmVuLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgICBpZiAoIWNoaWxkcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW5BcnJheSA9IHRvQXJyYXkoY2hpbGRyZW4pO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICB2YXIgaSA9IGNoaWxkcmVuQXJyYXkubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IGNhbGxiYWNrLmNhbGwodGhpc0FyZyB8fCB0aGlzLCBjaGlsZHJlbkFycmF5W2ldLCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0W118T2JqZWN0fSBbY2hpbGRyZW5dXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhpc0FyZ11cbiAgICAgKi9cbiAgICBmb3JFYWNoOiBmdW5jdGlvbiAoY2hpbGRyZW4sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAgIGlmICghY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZHJlbkFycmF5ID0gdG9BcnJheShjaGlsZHJlbik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcgfHwgdGhpcywgY2hpbGRyZW5BcnJheVtpXSwgaSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0W118T2JqZWN0fSBbY2hpbGRyZW5dXG4gKiBAcmV0dXJucyB7T2JqZWN0W119IGNoaWxkcmVuXG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbiA6IChjaGlsZHJlbiA/IFtjaGlsZHJlbl0gOiBbXSk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iamVjdCk7XG59O1xuIiwiXG52YXIgcm5nO1xuXG5pZiAoZ2xvYmFsLmNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gIC8vIFdIQVRXRyBjcnlwdG8tYmFzZWQgUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICB2YXIgX3JuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhfcm5kczgpO1xuICAgIHJldHVybiBfcm5kczg7XG4gIH07XG59XG5cbmlmICghcm5nKSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyICBfcm5kcyA9IG5ldyBBcnJheSgxNik7XG4gIHJuZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBfcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gX3JuZHM7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcm5nO1xuXG4iLCIvLyAgICAgdXVpZC5qc1xuLy9cbi8vICAgICBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMiBSb2JlcnQgS2llZmZlclxuLy8gICAgIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXG4vLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgV2UgZmVhdHVyZVxuLy8gZGV0ZWN0IHRvIGRldGVybWluZSB0aGUgYmVzdCBSTkcgc291cmNlLCBub3JtYWxpemluZyB0byBhIGZ1bmN0aW9uIHRoYXRcbi8vIHJldHVybnMgMTI4LWJpdHMgb2YgcmFuZG9tbmVzcywgc2luY2UgdGhhdCdzIHdoYXQncyB1c3VhbGx5IHJlcXVpcmVkXG52YXIgX3JuZyA9IHJlcXVpcmUoJy4vcm5nJyk7XG5cbi8vIE1hcHMgZm9yIG51bWJlciA8LT4gaGV4IHN0cmluZyBjb252ZXJzaW9uXG52YXIgX2J5dGVUb0hleCA9IFtdO1xudmFyIF9oZXhUb0J5dGUgPSB7fTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgX2J5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG4gIF9oZXhUb0J5dGVbX2J5dGVUb0hleFtpXV0gPSBpO1xufVxuXG4vLyAqKmBwYXJzZSgpYCAtIFBhcnNlIGEgVVVJRCBpbnRvIGl0J3MgY29tcG9uZW50IGJ5dGVzKipcbmZ1bmN0aW9uIHBhcnNlKHMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gKGJ1ZiAmJiBvZmZzZXQpIHx8IDAsIGlpID0gMDtcblxuICBidWYgPSBidWYgfHwgW107XG4gIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bMC05YS1mXXsyfS9nLCBmdW5jdGlvbihvY3QpIHtcbiAgICBpZiAoaWkgPCAxNikgeyAvLyBEb24ndCBvdmVyZmxvdyFcbiAgICAgIGJ1ZltpICsgaWkrK10gPSBfaGV4VG9CeXRlW29jdF07XG4gICAgfVxuICB9KTtcblxuICAvLyBaZXJvIG91dCByZW1haW5pbmcgYnl0ZXMgaWYgc3RyaW5nIHdhcyBzaG9ydFxuICB3aGlsZSAoaWkgPCAxNikge1xuICAgIGJ1ZltpICsgaWkrK10gPSAwO1xuICB9XG5cbiAgcmV0dXJuIGJ1Zjtcbn1cblxuLy8gKipgdW5wYXJzZSgpYCAtIENvbnZlcnQgVVVJRCBieXRlIGFycmF5IChhbGEgcGFyc2UoKSkgaW50byBhIHN0cmluZyoqXG5mdW5jdGlvbiB1bnBhcnNlKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDAsIGJ0aCA9IF9ieXRlVG9IZXg7XG4gIHJldHVybiAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xufVxuXG4vLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbi8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG52YXIgX3NlZWRCeXRlcyA9IF9ybmcoKTtcblxuLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG52YXIgX25vZGVJZCA9IFtcbiAgX3NlZWRCeXRlc1swXSB8IDB4MDEsXG4gIF9zZWVkQnl0ZXNbMV0sIF9zZWVkQnl0ZXNbMl0sIF9zZWVkQnl0ZXNbM10sIF9zZWVkQnl0ZXNbNF0sIF9zZWVkQnl0ZXNbNV1cbl07XG5cbi8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG52YXIgX2Nsb2Nrc2VxID0gKF9zZWVkQnl0ZXNbNl0gPDwgOCB8IF9zZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuXG4vLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcbnZhciBfbGFzdE1TZWNzID0gMCwgX2xhc3ROU2VjcyA9IDA7XG5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbmZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICB2YXIgYiA9IGJ1ZiB8fCBbXTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gIC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuICB2YXIgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7XG5cbiAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICB2YXIgZHQgPSAobXNlY3MgLSBfbGFzdE1TZWNzKSArIChuc2VjcyAtIF9sYXN0TlNlY3MpLzEwMDAwO1xuXG4gIC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfVxuXG4gIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gIC8vIHRpbWUgaW50ZXJ2YWxcbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH1cblxuICAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG4gIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXVpZC52MSgpOiBDYW5cXCd0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlYycpO1xuICB9XG5cbiAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gIF9jbG9ja3NlcSA9IGNsb2Nrc2VxO1xuXG4gIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDtcblxuICAvLyBgdGltZV9sb3dgXG4gIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfbWlkYFxuICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRtaCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjtcblxuICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwO1xuXG4gIC8vIGBjbG9ja19zZXFfbG93YFxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgLy8gYG5vZGVgXG4gIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgbisrKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IHVucGFyc2UoYik7XG59XG5cbi8vICoqYHY0KClgIC0gR2VuZXJhdGUgcmFuZG9tIFVVSUQqKlxuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAvLyBEZXByZWNhdGVkIC0gJ2Zvcm1hdCcgYXJndW1lbnQsIGFzIHN1cHBvcnRlZCBpbiB2MS4yXG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICBidWYgPSBvcHRpb25zID09ICdiaW5hcnknID8gbmV3IEFycmF5KDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgdW5wYXJzZShybmRzKTtcbn1cblxuLy8gRXhwb3J0IHB1YmxpYyBBUElcbnZhciB1dWlkID0gdjQ7XG51dWlkLnYxID0gdjE7XG51dWlkLnY0ID0gdjQ7XG51dWlkLnBhcnNlID0gcGFyc2U7XG51dWlkLnVucGFyc2UgPSB1bnBhcnNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAnZmFzdC1yZWFjdC1zZXJ2ZXInO1xyXG5pbXBvcnQgUmVhY3RSZW5kZXIgZnJvbSAnZmFzdC1yZWFjdC1yZW5kZXInO1xyXG5cclxuY29uc3QgSW1nID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7fSwgdGhpcy5wcm9wcy50ZXh0KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPEltZyBzcmM9XCJoZWxsb1wiLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaHRtbCA9IFJlYWN0UmVuZGVyLmVsZW1lbnRUb1N0cmluZyg8QXBwIC8+KTtcclxuY29uc29sZS5sb2coaHRtbCk7XHJcbiJdfQ==
