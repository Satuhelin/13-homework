import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  // I give you a month
  // you give me back a number of radians
  const angleScale = d3
    .scaleBand()
    .domain(months)
    .range([0, Math.PI * 2])
  const radius = 150
  // If I sell 0 houses, I have a radius of 0
  // If I sell 70 houses, I have a radius of... radius? 150
  const radiusScale = d3
    .scaleLinear()
    .domain([0, 84])
    .range([0, radius])
  // Make the outside of the shape based on
  // the high temperature
  // make the inside of the shape based
  // on the low temperature

  const line = d3
    .radialArea()
    .angle(d => angleScale(d.month_name))
    .innerRadius(d => radiusScale(d.low_temp))
    .outerRadius(d => radiusScale(d.high_temp))

  svg
    .append('text')
    .attr('cx', 0)
    .attr('cy', 0)
    .text('NYC')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 600)
    .style('font-size', 20)

  const bands = [20, 30, 40, 50, 60, 70, 80, 90]
  // Draw a circle for each item in bands
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('r', function(d) {
      console.log(d)
      return radiusScale(d)
    })
    .lower()

  const bands1 = [30, 50, 70, 90]
  svg
    .selectAll('.label')
    .data(bands1)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightblue')
    .lower()
}
