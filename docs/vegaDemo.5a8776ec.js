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
module.exports = "https://cse412.github.io/project-demo/trips_categorize_24@3.92ad604d.csv";
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
    renderer: "canvas"
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
  var scale = {
    domain: ['Walkable Trips', 'Commute Trips', 'Outdoor Trips', 'Traveling Trips'],
    range: ['#e7ba52', '#a7a7a7', '#aec7e8', '#1f77b4']
  };
  var trip_2020 = vl.markBar({
    opacity: 0.8
  }).select(click).data(_trips_categorize_.default).transform(vl.filter(brush)).encode(vl.y().fieldN('dist').axis({
    labelAngle: 0
  }).sort(null).title('trip distance'), vl.x().average('value').title('The Number of Trips'), vl.color().value('grey').if(click, vl.color().fieldN('dist'))).title('Distribution of the Avg.Trips in United States in 2020').width(1200);
  var trip_Point = vl.markPoint({
    filled: true
  }).data(_trips_categorize_.default).encode(vl.x().month('Date'), vl.y().average('value').title('The Number of Trips'), vl.color().value('grey').if(brush, vl.color().fieldN('dist')), vl.opacity().if(click, vl.value(1)).value(0.2)).title('Trips Distance in Each Month').select(brush).transform(vl.filter(click)).width(1200);
  var trip_Line = vl.markLine().data(_trips_categorize_.default).encode(vl.x().month('Date'), vl.y().average('value').title('The Number of Trips'), vl.color().fieldN('dist'), vl.opacity().if(click, vl.value(1)).value(0.2));
  return vl.vconcat(vl.layer(trip_Line, trip_Point), trip_2020).autosize({
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
//# sourceMappingURL=https://cse412.github.io/project-demo/vegaDemo.5a8776ec.js.map