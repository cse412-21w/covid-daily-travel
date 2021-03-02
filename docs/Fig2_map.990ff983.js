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
})({"TwnH":[function(require,module,exports) {
var margin = {
  top: 100,
  bottom: 100,
  left: 10,
  right: 100
};
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom; // Creates sources <svg> element and inner g (for margins)

var svg = d3.select("#d3_interactive_Map").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(".concat(margin.left, ", ").concat(margin.top, ")")); /////////////////////////

var projection = d3.geoAlbersUsa();
var path = d3.geoPath(projection);
var color = d3.scaleSequential(d3.interpolateBlues);
d3.json("https://cdn.jsdelivr.net/npm/us-atlas/states-10m.json").then(function (us) {
  var states = topojson.feature(us, us.objects.states).features;
  var nation = topojson.feature(us, us.objects.nation).features[0]; // scale to fit bounds

  projection.fitSize([width, height], nation);
  var data = states.map(function (feature) {
    return {
      feature: feature,
      name: feature.properties.name,
      value: Math.random() // random value

    };
  });
  var paths = svg.attr("class", "state").selectAll("path").data(data).join(function (enter) {
    var p = enter.append("path");
    p.on("mouseenter", function () {
      // move the SVG element after all other elements to be on the top
      d3.select(this).raise();
    });
    p.append("title");
    return p;
  }).attr("d", function (d) {
    return path(d.feature);
  }).attr("fill", "grey").style("stroke", "white").style("stroke-width", "1px");
  paths.select("title").text(function (d) {
    return d.name;
  });
});
},{}]},{},["TwnH"], null)
//# sourceMappingURL=https://cse412-21w.github.io/project-demo/Fig2_map.990ff983.js.map