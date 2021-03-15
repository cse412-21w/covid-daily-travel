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
})({"Goo8":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/covid-daily-travel/trips_categorize_24@3.92ad604d.csv";
},{}],"CsaW":[function(require,module,exports) {
"use strict";

var _trips_categorize_ = _interopRequireDefault(require("../static/trips_categorize_24@3.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dataset
"use strict"; // the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables

/*var sunshineArray = [];   // used to store data later
var citySet = [];
*/


var options = {
  config: {// Vega-Lite default configuration
  },
  init: function init(view) {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "svg",
    stroke: "transparent"
  }
};
vl.register(vega, vegaLite, options); // Again, We use d3.csv() to process data

d3.csv(_trips_categorize_.default).then(drawBarVegaLite);
/*{
data.forEach(function(d){
sunshineArray.push(d);
if (!citySet.includes(d.city)) {
citySet.push(d.city);
}
})
drawBarVegaLite();
})*/

function drawBarVegaLite() {
  // var sunshine = add_data(vl, sunshine.csv, format_type = NULL);
  // your visualization goes here
  var click = vl.selectMulti().encodings('color');
  var brush = vl.selectInterval().encodings('x');
  var brusha = {
    domain: ['Walkable Trips', 'Commute Trips', 'Outdoor Trips', 'Traveling Trips'],
    range: ['#e7ba52', '#a7a7a7', '#aec7e8', '#ff9af3']
  };
  var trip_2020 = vl.markBar({
    opacity: 0.8
  }).select(click).data(_trips_categorize_.default).transform(vl.filter(brush)).encode(vl.y().fieldN('dist').axis({
    labelAngle: 0,
    titleColor: '#d1f7ff',
    labelColor: '#d1f7ff',
    tickColor: '#d1f7ff',
    domainColor: '#d1f7ff',
    labelFont: 'Tahoma',
    labelFontSize: 11,
    titleFontSize: 12,
    titleFont: 'Tahoma'
  }).sort(null).title('trip distance'), vl.x().average('value').title('The Number of Trips').axis({
    labelAngle: 0,
    grid: false,
    titleColor: '#d1f7ff',
    labelColor: '#d1f7ff',
    tickColor: '#d1f7ff',
    domainColor: '#d1f7ff',
    labelFont: 'Tahoma',
    labelFontSize: 11,
    titleFontSize: 12,
    titleFont: 'Tahoma'
  }), vl.color().if(click, vl.color().fieldN('dist').title('Distance Range')), vl.opacity().if(click, vl.value(1)).value(0.2)).title({
    text: 'Distribution of the Avg.Trips in United States in 2020',
    color: '#d1f7ff',
    fontSize: 15,
    font: 'Tahoma'
  }).width(950);
  var trip_Point = vl.markCircle({
    filled: true,
    size: 6
  }).data(_trips_categorize_.default).encode(vl.x().fieldT('Date').axis({
    labelAngle: 0,
    grid: false,
    titleColor: '#d1f7ff',
    labelColor: '#d1f7ff',
    domainColor: '#d1f7ff',
    labelFont: 'Tahoma',
    labelFontSize: 11
  }), vl.y().average('value').title({
    text: 'The Number of Trips'
  }).axis({
    labelAngle: 0,
    grid: false,
    titleColor: '#d1f7ff',
    labelColor: '#d1f7ff',
    tickColor: '#d1f7ff',
    domainColor: '#d1f7ff',
    labelFont: 'Tahoma',
    labelFontSize: 11
  }), vl.color().value('black').if(brush, vl.color().fieldN('dist')), vl.opacity().if(click, vl.value(1)).value(0.2)).title({
    text: 'Trips Distance in Each Month',
    color: '#d1f7ff',
    fontSize: 15,
    font: 'Tahoma'
  }).select(brush).transform(vl.filter(click)).width(950);
  var trip_Line = vl.markLine().data(_trips_categorize_.default).encode(vl.x().fieldT('Date').axis({
    labelAngle: 0,
    grid: false,
    titleColor: '#d1f7ff',
    labelColor: '#d1f7ff',
    tickColor: '#d1f7ff',
    domainColor: '#d1f7ff',
    titleFontSize: 12,
    titleFont: 'Tahoma'
  }), vl.y().average('value').title({
    text: 'The Number of Trips'
  }).axis({
    labelAngle: 0,
    grid: false,
    titleColor: '#d1f7ff',
    labelColor: '#d1f7ff',
    domainColor: '#d1f7ff',
    titleFontSize: 12,
    titleFont: 'Tahoma'
  }), vl.color().fieldN('dist').legend({
    fillColor: 'black',
    titleColor: '#d1f7ff',
    labelColor: '#d1f7ff',
    labelFont: 'Tahoma',
    labelFontSize: 11,
    titleFont: 'Tahoma',
    titleFontSize: 12
  }), vl.opacity().if(click, vl.value(0.5)).value(0.2)).height(300);
  return vl.vconcat(vl.layer(trip_Line, trip_Point), trip_2020).background({
    color: 'black'
  }).autosize({
    type: 'fit-x',
    contains: 'padding'
  }).resolve({
    scale: {
      y: 'shared'
    }
  }).render().then(function (viewElement) {
    // render returns a promise to a DOM element containing the chart
    // viewElement.value contains the Vega View object instance
    document.getElementById('view').appendChild(viewElement);
  });
}
},{"../static/trips_categorize_24@3.csv":"Goo8"}]},{},["CsaW"], null)
//# sourceMappingURL=https://cse412-21w.github.io/covid-daily-travel/vegaDemo.8a6c7add.js.map