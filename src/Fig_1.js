import Total_Covid_State_2020 from '../static/Total_Covid_State_2020.csv'

// bubbleChart creation function; instantiate new bubble chart given a DOM element to display it in and a dataset to visualise
function bubbleChart() {
  const width = 1100;
  const height = 900;

  // location to centre the bubbles
  const centre = { x: width/2, y: height/2 };

  // strength to apply to the position forces
  const forceStrength = 0.03;

  // these will be set in createNodes and chart functions
  let svg = null;
  let bubbles = null;
  let labels = null;
  let nodes = [];

  // charge is dependent on size of the bubble, so bigger towards the middle
  function charge(d) {
    return Math.pow(d.radius, 2.0)
  }

  // create a force simulation and add forces to it
  const simulation = d3.forceSimulation()
    .alpha(0.04)
    .force('charge', d3.forceManyBody().strength(charge))
    // .force('center', d3.forceCenter(centre.x, centre.y))
    .force('x', d3.forceX().strength(forceStrength).x(centre.x))
    .force('y', d3.forceY().strength(forceStrength).y(centre.y))
    .force('collision', d3.forceCollide().radius(d => d.radius + 1));

  // force simulation starts up automatically, which we don't want as there aren't any nodes yet
  simulation.stop();

  // set up colour scale
  const fillColour = d3.scaleLinear()
     .domain([0, 0.06, 0.09, 0.13])
     .range(["#d1f7ff", "#05d9e8", "#00b7ff", "#005678"]);

  // data manipulation function takes raw data from csv and converts it into an array of node objects
  // each node will store data and visualisation values to draw a bubble
  // rawData is expected to be an array of data objects, read in d3.csv
  // function returns the new node array, with a node for each element in the rawData input
  function createNodes(rawData) {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    const maxSize = d3.max(rawData, d => +d.Confrimed_Case);

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([10, 80])

    // use map() to convert raw data into node data
    const myNodes = rawData.map(d => ({
      ...d,
      radius: radiusScale(+d.Confrimed_Case),
      size: +d.Confrimed_Case,
      x: Math.random() * 1200,
      y: Math.random() * 500
    }))

    return myNodes;
  }

  // main entry point to bubble chart, returned by parent closure
  // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
  let chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // create svg element inside provided selector
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
        .attr('transform', 'translate('+0+','+50+')')

    // bind nodes data to circle elements
    const elements = svg.selectAll('.bubble')
      .data(nodes, d => d.Province_State)
      .enter()
      .append('g')

    bubbles = elements
      .append('circle')
      .classed('bubble', true)
      .attr('r', d => d.radius)
      .attr('fill', d => fillColour(d.Infection_rate))
      .attr('stroke',"#66d4ff")
      .attr('stroke-width','3px')
      .attr('stroke-opacity',0.5)

    // labels
    labels = elements
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', d => d.radius/2.8)
      .text(d => d.Province_State)

    // set simulation's nodes to our newly created nodes array
    // simulation starts running automatically once nodes are set
    simulation.nodes(nodes)
      .on('tick', ticked)
      .restart();
  }

  // callback function called after every tick of the force simulation
  // here we do the actual repositioning of the circles based on current x and y value of their bound node data
  // x and y values are modified by the force simulation
  function ticked() {
    bubbles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y)
  }

  // return chart function from closure
  return chart;
}

// new bubble chart instance
let myBubbleChart = bubbleChart();

// function called once promise is resolved and data is loaded from csv
// calls bubble chart function to display inside #vis div
function display(data) {
  myBubbleChart('#d3_bubble_chart', data);
}

// load data
d3.csv(Total_Covid_State_2020).then(display);




