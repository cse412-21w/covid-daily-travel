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
    renderer: "svg",
    stroke: "transparent"
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
      
    const brusha = {
        domain: ['Walkable Trips', 'Commute Trips', 'Outdoor Trips', 'Traveling Trips'],
        range: ['#e7ba52', '#a7a7a7', '#aec7e8', '#ff9af3']
      };
    
    const trip_2020 = vl.markBar({opacity: 0.8})
                       .select(click)
                       .data(travel_data)
                       .transform(vl.filter(brush))
                       .encode(
                         vl.y().fieldN('dist').axis({ labelAngle: 0, titleColor: '#63d0ff', labelColor: '#63d0ff', tickColor: '#63d0ff',domainColor: '#63d0ff'}).sort(null).title('trip distance'),
                         vl.x().average('value').title('The Number of Trips').axis({ labelAngle: 0, grid: false, titleColor: '#63d0ff', labelColor: '#63d0ff', tickColor: '#63d0ff',domainColor: '#63d0ff'}),
                         vl.color().if(click, vl.color().fieldN('dist').title('Distance Range')),
                         vl.opacity().if(click, vl.value(1)).value(0.2)
                       )
                       .title({text:'Distribution of the Avg.Trips in United States in 2020',color: '#63d0ff'})
                       .width(1000)
    
    const trip_Point =vl.markCircle({filled: true, size: 6})
                   .data(travel_data)
                   .encode(
                     vl.x().fieldT('Date').axis({ labelAngle: 0, grid: false, titleColor: '#63d0ff', labelColor: '#63d0ff', domainColor: '#63d0ff'}),
                     vl.y().average('value').title('The Number of Trips').axis({ labelAngle: 0, grid: false, titleColor: '#63d0ff', labelColor: '#63d0ff', tickColor: '#63d0ff', domainColor: '#63d0ff'}),
                     vl.color().value('black')
                              .if(brush, vl.color().fieldN('dist')),
                     vl.opacity().if(click, vl.value(1)).value(0.2)
                   )
                   .title({text: 'Trips Distance in Each Month', color: '#63d0ff'})
                   .select(brush)
                   .transform(vl.filter(click))
                   .width(1000)
    
    const trip_Line =vl.markLine()
                   .data(travel_data)
                   .encode(
                     vl.x().fieldT('Date').axis({ labelAngle: 0, grid: false, titleColor: '#63d0ff', labelColor: '#63d0ff', tickColor: '#63d0ff', domainColor: '#63d0ff'}),
                     vl.y().average('value').title('The Number of Trips').axis({ labelAngle: 0, grid: false, titleColor: '#63d0ff', labelColor: '#63d0ff', domainColor: '#63d0ff'}),
                     vl.color().fieldN('dist').legend({fillColor:'black', titleColor: '#63d0ff', labelColor: '#63d0ff'}),
                     vl.opacity().if(click, vl.value(0.5)).value(0.2))
                    .height(300)
    
    return vl.vconcat( vl.layer(trip_Line, trip_Point), trip_2020)
                .background({color: 'black'})
                .autosize({type: 'fit-x', contains: 'padding'})
                .resolve({scale: {y: 'shared'}})
                .render()
                .then(viewElement => {
                  // render returns a promise to a DOM element containing the chart
                  // viewElement.value contains the Vega View object instance
                  document.getElementById('view').appendChild(viewElement);
  });
}
  
