// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"FjQP":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/covid-daily-travel/Total_Covid_State_2020.b8c3f014.csv";
},{}],"ly83":[function(require,module,exports) {
"use strict";

var _Total_Covid_State_ = _interopRequireDefault(require("../static/Total_Covid_State_2020.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// bubbleChart creation function; instantiate new bubble chart given a DOM element to display it in and a dataset to visualise
function bubbleChart() {
  var width = 1100;
  var height = 900; // location to centre the bubbles

  var centre = {
    x: width / 2,
    y: height / 2
  }; // strength to apply to the position forces

  var forceStrength = 0.03; // these will be set in createNodes and chart functions

  var svg = null;
  var bubbles = null;
  var labels = null;
  var nodes = []; // charge is dependent on size of the bubble, so bigger towards the middle

  function charge(d) {
    return Math.pow(d.radius, 2.0);
  } // create a force simulation and add forces to it


  var simulation = d3.forceSimulation().alpha(0.04).force('charge', d3.forceManyBody().strength(charge)) // .force('center', d3.forceCenter(centre.x, centre.y))
  .force('x', d3.forceX().strength(forceStrength).x(centre.x)).force('y', d3.forceY().strength(forceStrength).y(centre.y)).force('collision', d3.forceCollide().radius(function (d) {
    return d.radius + 1;
  })); // force simulation starts up automatically, which we don't want as there aren't any nodes yet

  simulation.stop(); // set up colour scale

  var fillColour = d3.scaleLinear().domain([0, 0.06, 0.09, 0.13]).range(["#d1f7ff", "#05d9e8", "#00b7ff", "#005678"]); // data manipulation function takes raw data from csv and converts it into an array of node objects
  // each node will store data and visualisation values to draw a bubble
  // rawData is expected to be an array of data objects, read in d3.csv
  // function returns the new node array, with a node for each element in the rawData input

  function createNodes(rawData) {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    var maxSize = d3.max(rawData, function (d) {
      return +d.Confrimed_Case;
    }); // size bubbles based on area

    var radiusScale = d3.scaleSqrt().domain([0, maxSize]).range([10, 80]); // use map() to convert raw data into node data

    var myNodes = rawData.map(function (d) {
      return _objectSpread(_objectSpread({}, d), {}, {
        radius: radiusScale(+d.Confrimed_Case),
        size: +d.Confrimed_Case,
        x: Math.random() * 1200,
        y: Math.random() * 500
      });
    });
    return myNodes;
  } // main entry point to bubble chart, returned by parent closure
  // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process


  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData); // create svg element inside provided selector

    svg = d3.select(selector).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + 0 + ',' + 50 + ')'); // bind nodes data to circle elements

    var elements = svg.selectAll('.bubble').data(nodes, function (d) {
      return d.Province_State;
    }).enter().append('g');
    bubbles = elements.append('circle').classed('bubble', true).attr('r', function (d) {
      return d.radius;
    }).attr('fill', function (d) {
      return fillColour(d.Infection_rate);
    }).attr('stroke', "#66d4ff").attr('stroke-width', '3px').attr('stroke-opacity', 0.5); // labels

    labels = elements.append('text').attr('dy', '.3em').style('text-anchor', 'middle').style('font-size', function (d) {
      return d.radius / 2.8;
    }).text(function (d) {
      return d.Province_State;
    }); // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set

    simulation.nodes(nodes).on('tick', ticked).restart();
  }; // callback function called after every tick of the force simulation
  // here we do the actual repositioning of the circles based on current x and y value of their bound node data
  // x and y values are modified by the force simulation


  function ticked() {
    bubbles.attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    });
    labels.attr('x', function (d) {
      return d.x;
    }).attr('y', function (d) {
      return d.y;
    });
  } // return chart function from closure


  return chart;
} // new bubble chart instance


var myBubbleChart = bubbleChart(); // function called once promise is resolved and data is loaded from csv
// calls bubble chart function to display inside #vis div

function display(data) {
  myBubbleChart('#d3_bubble_chart', data);
} // load data


d3.csv(_Total_Covid_State_.default).then(display);
},{"../static/Total_Covid_State_2020.csv":"FjQP"}]},{},["ly83"], null)
//# sourceMappingURL=https://cse412-21w.github.io/covid-daily-travel/Fig_1.d083d157.js.map