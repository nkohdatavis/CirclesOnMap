// import { feature } from 'topojson';
// import { csv, json } from 'd3';

export const loadAndProcessData = () => 
  Promise
    .all([
      // tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
      d3.csv('https://gist.githubusercontent.com/nkohdatavis/268451b90e82c0b5432107dd80825aa8/raw/un-population-estimates-medium.csv'),
      d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
    ])
    .then(([unData, topoJSONdata]) => {
      console.log(unData);
      const rowById = unData.reduce((accumulator, d) => {
        accumulator[d['Country code']] = d;
        return accumulator;
      }, {});

      const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);

      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });

      return countries;
    });