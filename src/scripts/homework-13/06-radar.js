import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('transform', `translate(${width / 2},${height / 2})`)

d3.csv(require('/data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  // Cut and paste from 02-radial-line.js

  const categories = ['Food', 'Service', 'Atmosphere', 'Price', 'Trendiness']
  const angleScale = d3
    .scaleBand()
    .domain(categories)
    .range([0, Math.PI * 2])
  const radius = 150
  // If I sell 0 houses, I have a radius of 0
  // If I sell 70 houses, I have a radius of... radius? 150
  const radiusScale = d3
    .scaleLinear()
    .domain([0, 5])
    .range([0, radius])
  const line = d3
    .radialLine()
    .angle(d => angleScale(d.category))
    .radius(d => radiusScale(d.score))

  // Throw January onto the end so it connects

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightpink')
    .attr('opacity', 0.5)
    .attr('stroke', 'black')
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
  const bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  // Draw a circle for each item in bands
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightblue')
    .attr('r', function(d) {
      console.log(d)
      return radiusScale(d)
    })
    .lower()

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
    .attr('stroke', 'grey')
    .style('transform', function(d) {
      console.log(d, angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })
  console.log('everything in the angle scale', angleScale.domain())

  svg
    .selectAll('outside-label')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', -radius)
    .attr('dy', -10)
    .attr('text-anchor', 'middle')
    .attr('stroke', 'black')
    .style('transform', function(d) {
      console.log(d, angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })

  // Add text-elemnt for each category
}
