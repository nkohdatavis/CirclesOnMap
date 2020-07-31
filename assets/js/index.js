// import {
//   select,
//   geoPath,
//   geoNaturalEarth1,
//   zoom,
//   event,
//   scaleOrdinal,
//   schemeSpectral,
//   scaleSqrt,
//   max,
//   format
// } from 'd3';

import { loadAndProcessData } from './loadAndProcessData.js';
import { colorLegend } from './colorLegend.js';
import { sizeLegend } from './sizeLegend.js';
// import { format } from 'path';

const svg = d3.select('svg');

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

//accessor function
const radiusValue = d => d.properties['2020'];

const g = svg.append('g');

const colorLegendG = svg.append('g')
  .attr('transform', `translate(40,310)`);

g.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({ type: 'Sphere' }));

svg.call(d3.zoom().on('zoom', () => {
  g.attr('transform', d3.event.transform);
}));

// const colorScale = scaleOrdinal();

// // const colorValue = d => d.properties.income_grp;
// const colorValue = d => d.properties.economy;

const populationFormat = d3.format(',');

loadAndProcessData().then(countries => {

  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(countries.features, radiusValue)])
    .range([0, 33]);



  // colorScale
  //   .domain(countries.features.map(colorValue))
  //   .domain(colorScale.domain().sort().reverse())
  //   .range(schemeSpectral[colorScale.domain().length]);

  //   colorLegendG.call(colorLegend, {
  //     colorScale,
  //     circleRadius: 8,
  //     spacing: 20,
  //     textOffset: 12,
  //     backgroundRectWidth: 235
  //   });

  g.selectAll('path').data(countries.features)
    .enter().append('path')
    .attr('class', 'country')
    .attr('d', pathGenerator)
    .attr('fill', d => d.properties['2020'] ? '#e8e8e8' : '#fec1c1')
    .append('title')
    // to display column names in console
    // .text(d => {
    //   console.log(d.properties);
    //   return populationFormat(radiusValue(d));
    // })
    .text(d =>
      isNaN(radiusValue(d))
        ? 'Missing Data'
        : [
          d.properties['Region, subregion, country or area *'],
          populationFormat(radiusValue(d))
        ].join(': ')
    );

  // console.log(radiusValue(countries.features[0]));
  countries.featuresWithPopulation.forEach(d => {
    d.properties.projected = projection(d3.geoCentroid(d));
  });


  g.selectAll('circle').data(countries.featuresWithPopulation)
    .enter().append('circle')
    .attr('class', 'country-circle')
    //centroid
    .attr('cx', d => d.properties.projected[0])
    .attr('cy', d => d.properties.projected[1])
    .attr('r', d => sizeScale(radiusValue(d)));

  g.append('g')
    .attr('transform', `translate(55,215)`)
    .call(sizeLegend, {
      sizeScale,
      spacing: 45,
      textOffset: 10,
      numTicks: 5,
      tickFormat: populationFormat
    })
    .append('text')
    .attr('class', 'legend-title')
    .text('Population')
    .attr('y', -45)
    .attr('x', -30);

});