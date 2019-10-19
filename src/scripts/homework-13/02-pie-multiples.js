import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const radius = 100

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const angleScale = d3
  .scaleBand()
  .domain(30, 180)
  .range([0, Math.PI * 2])

const XpositionScale = d3
  .scaleOrdinal()
  .domain(['Project 1', 'Project 2', 'Project 3', 'Project 4'])
  .range([0, 100, 200, 300])

const colorScale = d3
  .scaleOrdinal('Typing code', 'Rewriting code', 'Reading StackOverflow')
  .range(['pink', 'cyan', 'magenta'])

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  console.log(pie(datapoints))

  svg
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .append('g')
    .attr('d', function(d) {
      console.log(d)
      return `'transform', 'translate'(` + XpositionScale(d.keys) + `,0)`
    })
    .attr('d', function(d) {
      console.log(d)
      return arc(d.values)
    })

    .each(function(d) {
      const svg = d3.select(this)
      svg
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.data.task))
    })
}
