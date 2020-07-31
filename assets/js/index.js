// import {
//   select,
//   geoPath,
//   geoNaturalEarth1,
//   zoom,
//   event,
//   scaleOrdinal,
//   schemeSpectral
// } from 'd3';

import { loadAndProcessData } from './loadAndProcessData.js';
import { colorLegend } from './colorLegend.js';

const svg = d3.select('svg');

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);
const radiusScale = d3.scaleSqrt();
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

loadAndProcessData().then(countries => {

  radiusScale
    .domain([0, d3.max(countries.features, radiusValue)])
    .range([0, 20]);

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
    .attr('fill', d => d.properties['2020'] ? 'green' : 'red')
    // .attr('fill', d => colorScale(colorValue(d)))
    .append('title')
    .text(d => d.id);
  // ?    .text(d => d.properties.name + ': ' + colorValue(d));

  g.selectAll('circle').data(countries.featuresWithPopulation)
    .enter().append('circle')
    .attr('class', 'country-circle')
    //centroid
    .attr('cx', d => projection(d3.geoCentroid(d))[0])
    .attr('cy', d => projection(d3.geoCentroid(d))[1])
    .attr('r', d => radiusScale(radiusValue(d)));
});