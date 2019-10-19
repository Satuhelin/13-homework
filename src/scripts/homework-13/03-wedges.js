import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
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
    // .scalePoint()
    // .padding(0.5)
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
  const colorScale = d3
    .scaleLinear()
    .domain([30, 84])
    .range(['lightblue', 'pink'])

  const line = d3
    .radialArea()
    .angle(d => angleScale(d.month_name))
    .innerRadius(d => radiusScale(d.low_temp))
    .outerRadius(d => radiusScale(d.high_temp))
  // base the outerRadius on the high temp using the radiusScale
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(d => radiusScale(d.high_temp))
    .startAngle(d => angleScale(d.month_name))
    .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

  function ready(datapoints) {
    // Throw January onto the end so it connects
    datapoints.push(datapoints[7])
  }

  svg
    .selectAll('.polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => colorScale(d.high_temp))
  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)
  // No matter what, this is at 70 houses sold
  // svg
  //   .append('circle')
  //   .attr('cx', 0)
  //   .attr('cy', 0)
  //   // .attr('r', 150)
  //   // .attr('r', radius)
  //   .attr('r', radiusScale(70))
  //   .attr('stroke', 'black')
  //   .attr('fill', 'none')
  const bands = [15, 30, 45, 60, 75]
  // Draw a circle for each item in bands

  // Draw one line for every category that this scale knows about
  svg
    .selectAll('.radius-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'none')
    // .style/css knows about radians
    // .style('transform', function(d) {
    //   console.log(d, angleScale(d))
    //   return `rotate(${angleScale(d)}rad)`
    // })
    // for .attr you need to convert to degrees
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) * 180) / Math.PI})`
    })
  // Add one text element for every category
  // that our angleScale knows about
  // we aren't using .data(months) because
  // we want to be able to cut and paste

  console.log('everything in the angle scale', angleScale.domain())
}

svg
  .append('text')
  .text('NYC high temperatures, by month')
  .attr('y', -100)
  .attr('text-anchor', 'middle')
  .attr('font-weight', 600)
  .style('font-size', 40)
