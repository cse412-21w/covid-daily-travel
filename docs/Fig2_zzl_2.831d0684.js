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
})({"b6ee":[function(require,module,exports) {
//Define Variables
var margin = {
  top: 10,
  bottom: 10,
  left: 100,
  right: 100
},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
var margin_line = {
  top: 0,
  right: 20,
  bottom: 50,
  left: 70
},
    width_line = 800 - margin_line.left / 1.5 - margin_line.right,
    height_line = 320 - margin_line.top - margin_line.bottom;

var htmlCategory = function () {
  var mapping = {
    pop_rate: 'Stay-Home Rate',
    area_rate: 'Stay-Home Density',
    unemployment_rate: 'Unemployment Change',
    NumberOfTrips: 'Total Trips'
  };
  return function (codename) {
    return mapping[codename];
  };
}();

var categorySelector = {};
var options = ['pop_rate', 'area_rate', 'unemployment_rate', 'NumberOfTrips']; // Creates sources Mapsvg element 

var mapsvg = d3.select("#map-wrapper").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(".concat(margin.left, ", ").concat(margin.top, ")"));
var projection = d3.geoAlbersUsa();
var path = d3.geoPath(projection);
var color = d3.scaleSequential(d3.interpolateBlues); // parse the date / time

var parseTime = d3.timeParse("%Y/%m/%d");
var parseTime_2 = d3.timeParse("%m");
var active = d3.select(null); // set the ranges

var x = d3.scaleTime().range([0, width_line]);
var y = d3.scaleLinear().range([height_line, 0 + 10]); //creates line chart svg elements

var svg = d3.select("#line").append("svg").attr("width", width_line + margin_line.left + margin_line.right).attr("height", height_line + margin_line.top + margin_line.bottom).append("g").attr("transform", "translate(" + margin_line.left + "," + margin_line.top + ")"); // var name = d.name;
// for debug
// console.log(print, i.name);

var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b"));
var wrapper = d3.select('#Category-selector');

function drawLine(name) {
  d3.csv("line_test.csv").then(function (data) {
    data.forEach(function (dat) {
      dat.date = parseTime(dat.Date);
      dat.pop_rate = dat.pop_rate;
      dat.State_Code = dat.State_Code;
      dat.State_Name = dat.State_Name;
    });
    var valueline = d3.line().x(function (d) {
      return x(d.date);
    }).y(function (d) {
      return y(d.pop_rate);
    });
    x.domain(d3.extent(data, function (d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
      return d.pop_rate;
    })); // Add the X Axis

    svg.append("g").attr("transform", "translate(0," + height_line + ")").style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma').call(xAxis).selectAll("text").style("text-anchor", "middle").attr("transform", "translate(35,0)"); // Add the Y Axis

    svg.append("g").call(d3.axisLeft(y)).style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma'); //text label for the y axis

    svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin_line.left).attr("x", 0 - height_line / 2).attr("dy", "1em").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Stay Home Rate"); // text label for the x axis

    svg.append("text").attr("transform", "translate(" + width_line / 2 + " ," + (height_line + margin_line.top + 35) + ")").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Date");
    svg.append("text").attr("x", 570).attr("y", 40).style("text-anchor", "middle").style("font-size", "40px").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff67f2, 0 0 20px #ff67f2").text(name); // Add the valueline path.

    svg.append("path").data([data]).datum(data.filter(function (d) {
      return d.State_Name == name;
    })).attr('fill', 'none').attr("class", "line").style("stroke", "#ef5cff").style("stroke-width", "2.1px").attr("d", valueline);
  });
}

;

function drawLine_area_rate(name) {
  d3.csv("line_test.csv").then(function (data) {
    data.forEach(function (dat) {
      dat.date = parseTime(dat.Date);
      dat.area_rate = dat.area_rate;
      dat.State_Code = dat.State_Code;
      dat.State_Name = dat.State_Name;
    });
    var valueline = d3.line().x(function (d) {
      return x(d.date);
    }).y(function (d) {
      return y(d.area_rate);
    });
    x.domain(d3.extent(data, function (d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
      return d.area_rate;
    })); // Add the X Axis

    svg.append("g").attr("transform", "translate(0," + height_line + ")").style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma').call(xAxis).selectAll("text").style("text-anchor", "middle").attr("transform", "translate(35,0)"); // Add the Y Axis

    svg.append("g").call(d3.axisLeft(y)).style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma'); //text label for the y axis

    svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin_line.left).attr("x", 0 - height_line / 2).attr("dy", "1em").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Stay Home Density"); // text label for the x axis

    svg.append("text").attr("transform", "translate(" + width_line / 2 + " ," + (height_line + margin_line.top + 35) + ")").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Date");
    svg.append("text").attr("x", 570).attr("y", 40).style("text-anchor", "middle").style("font-size", "40px").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff67f2, 0 0 20px #ff67f2").text(name); // Add the valueline path.

    svg.append("path").data([data]).datum(data.filter(function (d) {
      return d.State_Name == name;
    })).attr('fill', 'none').attr("class", "line").style("stroke", "#ef5cff").style("stroke-width", "2.1px").attr("d", valueline).transition().ease(d3.easeLinear);
  });
}

;

function drawLine_unemployment_rate(name) {
  d3.csv("line_test.csv").then(function (data) {
    data.forEach(function (dat) {
      dat.month = parseTime_2(dat.month);
      dat.unemployment_rate = dat.unemployment_rate / 100;
      dat.State_Code = dat.State_Code;
      dat.State_Name = dat.State_Name;
    });
    var valueline = d3.line().x(function (d) {
      return x(d.month);
    }).y(function (d) {
      return y(d.unemployment_rate);
    });
    x.domain(d3.extent(data, function (d) {
      return d.month;
    }));
    y.domain(d3.extent(data, function (d) {
      return d.unemployment_rate;
    })); // Add the X Axis

    svg.append("g").attr("transform", "translate(0," + height_line + ")").style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma').call(xAxis); // Add the Y Axis

    svg.append("g").call(d3.axisLeft(y)).style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma'); //text label for the y axis

    svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin_line.left).attr("x", 0 - height_line / 2).attr("dy", "1em").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Unemployment Change"); // text label for the x axis

    svg.append("text").attr("transform", "translate(" + width_line / 2 + " ," + (height_line + margin_line.top + 35) + ")").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Date");
    svg.append("text") // text label for the x axis
    .attr("x", 570).attr("y", 40).style("text-anchor", "middle").style("font-size", "40px").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff67f2, 0 0 20px #ff67f2").text(name); // Add the valueline path.

    svg.append("path").data([data]).datum(data.filter(function (d) {
      return d.State_Name == name;
    })).attr('fill', 'none').attr("class", "line").style("stroke", "#ef5cff").style("stroke-width", "2.1px").attr("d", valueline).transition().ease(d3.easeLinear);
  });
}

;

function drawLine_NumberOfTrips(name) {
  d3.csv("line_test.csv").then(function (data) {
    data.forEach(function (dat) {
      dat.date = parseTime(dat.Date);
      dat.NumberOfTrips = dat.NumberOfTrips / 1000000;
      dat.State_Code = dat.State_Code;
      dat.State_Name = dat.State_Name;
    });
    var valueline = d3.line().x(function (d) {
      return x(d.date);
    }).y(function (d) {
      return y(d.NumberOfTrips);
    });
    x.domain(d3.extent(data, function (d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
      return d.NumberOfTrips;
    })); // Add the X Axis

    svg.append("g").attr("transform", "translate(0," + height_line + ")").style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma').call(xAxis).selectAll("text").style("text-anchor", "middle").attr("transform", "translate(35,0)"); // Add the Y Axis

    svg.append("g").call(d3.axisLeft(y)).style("color", "rgb(110,255,224)").style('font-size', 13).style('font-family', 'Tahoma'); //text label for the y axis

    svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin_line.left).attr("x", 0 - height_line / 2).attr("dy", "1em").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Number of trips (Millions)"); // text label for the x axis

    svg.append("text").attr("transform", "translate(" + width_line / 2 + " ," + (height_line + margin_line.top + 35) + ")").style("text-anchor", "middle").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 3px #fff").text("Date");
    svg.append("text") // text label for the x axis
    .attr("x", 570).attr("y", 40).style("text-anchor", "middle").style("font-size", "40px").style("fill", "rgb(255,103,242)").style("text-shadow", "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff67f2, 0 0 20px #ff67f2").text(name); // Add the valueline path.

    svg.append("path").data([data]).datum(data.filter(function (d) {
      return d.State_Name == name;
    })).attr('fill', 'none').attr("class", "line").style("stroke", "#ef5cff").style("stroke-width", "2.1px").attr("d", valueline).transition().ease(d3.easeLinear);
    /*
     * Glow effects (Optional)
     */
    // const defs = svg.append('defs')
    // const glowDeviation = '4.5'
    // // Filter for the outside glow
    // const filter = defs.append('filter').attr('id', 'glow')
    // filter.append('feGaussianBlur')
    //     .attr('stdDeviation', glowDeviation)
    //     .attr('result', 'coloredBlur')
    // const feMerge = filter.append('feMerge')
    // feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    // feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
    // // Add the glow!!
    // d3.selectAll('.glowed').style('filter', 'url(#glow)')
  });
}

;

function reset() {
  svg.selectAll("path").remove();
  svg.selectAll("g").remove();
  svg.selectAll("text").remove();
}

;

function draw_initial(state) {
  drawLine(state);
  wrapper.selectAll('div').data(options).on('click', function (d, category) {
    if (category == "pop_rate") {
      reset();
      drawLine(state);
    }

    ;

    if (category == "area_rate") {
      reset();
      drawLine_area_rate(state);
    }

    ;

    if (category == "unemployment_rate") {
      reset();
      drawLine_unemployment_rate(state);
    }

    ;

    if (category == "NumberOfTrips") {
      reset();
      drawLine_NumberOfTrips(state);
    }

    ;
  });
}

; //main comes from here

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
  wrapper.selectAll('div').data(options).enter().append('div').attr('class', function (d) {
    return 'category ' + d;
  }).html(function (d) {
    return htmlCategory(d);
  });
  var paths = mapsvg.attr("class", "state").selectAll("path").data(data).join(function (enter) {
    var p = enter.append("path");
    p.on("mouseenter", function () {
      // move the SVG element after all other elements to be on the top
      d3.select(this).raise();
    });
    p.append("title");
    return p;
  }).attr("d", function (d) {
    return path(d.feature);
  }).attr("fill", "black").style("stroke", "rgb(110,255,224)").style("stroke-width", "2px").on("mouseover", function (d, i) {
    d3.select(this).attr("fill", "rgb(255,103,242)");
  }).on("mouseout", function (d, i) {
    d3.select(this).attr("fill", "black");
  }).on("click", function (d, i) {
    //for debug
    //console.log(print, i.name);
    wrapper.selectAll('div').data(options).on('click', function (d, category) {
      if (category == "pop_rate") {
        //draw initial plot
        reset();
        drawLine(i.name);
      }

      ;

      if (category == "area_rate") {
        //draw initial plot
        reset();
        drawLine_area_rate(i.name);
      }

      ;

      if (category == "unemployment_rate") {
        //draw initial plot
        reset();
        drawLine_unemployment_rate(i.name);
      }

      ;

      if (category == "NumberOfTrips") {
        //draw initial plot
        reset();
        drawLine_NumberOfTrips(i.name);
      }

      ;
    });
  }); //draw initial plot

  draw_initial("Washington"); //d3.selectAll("path").transition().duration(1000).ease(d3.easeLinear)

  paths.select("title").text(function (d) {
    return d.name;
  });
  d3.selectAll("path.state").on("click", function (d) {
    console.log(d3.select(d));
  });
});
},{}]},{},["b6ee"], null)
//# sourceMappingURL=https://cse412-21w.github.io/covid-daily-travel/Fig2_zzl_2.831d0684.js.map