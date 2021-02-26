import travel_data from '../static/trips_categorize_24@3.csv'    // import dataset
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables

/*var sunshineArray = [];   // used to store data later
var citySet = [];
*/
const options = {
  config: {
    // Vega-Lite default configuration
  },
  init: (view) => {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas",
  },
};

vl.register(vega, vegaLite, options);

// Again, We use d3.csv() to process data
d3.csv(travel_data).then(drawBarVegaLite); /*{
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
  
    const click = vl.selectMulti().encodings('color');
    const brush = vl.selectInterval().encodings('x');
      
    const scale = {
        domain: ['Walkable Trips', 'Commute Trips', 'Outdoor Trips', 'Traveling Trips'],
        range: ['#e7ba52', '#a7a7a7', '#aec7e8', '#1f77b4']
      };
    
    const trip_2020 = vl.markBar({opacity: 0.8})
                       .select(click)
                       .data(travel_data)
                       .transform(vl.filter(brush))
                       .encode(
                         vl.y().fieldN('dist').axis({ labelAngle: 0}).sort(null).title('trip distance'),
                         vl.x().average('value').title('The Number of Trips'),
                         vl.color().value('grey').if(click, vl.color().fieldN('dist'))
                       )
                       .title('Distribution of the Avg.Trips in United States in 2020')
                       .width(1200)
    
    const trip_Point =vl.markPoint({filled: true})
                   .data(travel_data)
                   .encode(
                     vl.x().month('Date'),
                     vl.y().average('value').title('The Number of Trips'),
                     vl.color().value('grey')
                              .if(brush, vl.color().fieldN('dist')),
                     vl.opacity().if(click, vl.value(1)).value(0.2)
                   )
                   .title('Trips Distance in Each Month')
                   .select(brush)
                   .transform(vl.filter(click))
                   .width(1200)
    
    const trip_Line =vl.markLine()
                   .data(travel_data)
                   .encode(
                     vl.x().month('Date'),
                     vl.y().average('value').title('The Number of Trips'),
                     vl.color().fieldN('dist'),
                     vl.opacity().if(click, vl.value(1)).value(0.2))
    
    return vl.vconcat( vl.layer(trip_Line, trip_Point), trip_2020)
                .autosize({type: 'fit-x', contains: 'padding'})
                .resolve({scale: {y: 'shared'}})
                .render()
                .then(viewElement => {
                  // render returns a promise to a DOM element containing the chart
                  // viewElement.value contains the Vega View object instance
                  document.getElementById('view').appendChild(viewElement);
  });
}
  
