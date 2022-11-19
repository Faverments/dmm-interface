import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { useWindowSize } from 'hooks/useWindowSize'
export const useD3 = (renderChartFn: any, dependencies: any) => {
  const ref = React.useRef()

  React.useEffect(() => {
    renderChartFn(d3.select(ref.current as any))
    return () => {}
  }, dependencies)
  return ref
}

export interface BubbleChartProps {
  overflow?: boolean
  graph?: {
    zoom: number
    offsetX: number
    offsetY: number
  }
  width?: number
  height?: number
  padding?: number
  showLegend?: boolean
  legendPercentage?: number
  legendFont?: {
    family: string
    size: number
    color: string
    weight: string
  }
  valueFont?: {
    family: string
    size: number
    color: string
    weight: string
    lineColor?: string
    lineWeight?: string
  }
  labelFont?: {
    family: string
    size: number
    color: string
    weight: string
    lineColor?: string
    lineWeight?: string
  }
  bubbleClickFun?: (bubble: any) => void
  legendClickFun?: (legend: any) => void
  data?: Array<{
    label: string
    value: number
  }>
}

export default function BubbleChart({
  overflow = false,
  graph = {
    zoom: 1.1,
    offsetX: -0.05,
    offsetY: -0.01,
  },
  width = 1000,
  height = 800,
  padding = 0,
  showLegend = true,
  legendPercentage = 20,
  legendFont = {
    family: 'Arial',
    size: 12,
    color: '#000',
    weight: 'bold',
  },
  valueFont = {
    family: 'Arial',
    size: 16,
    color: '#fff',
    weight: 'bold',
    lineColor: undefined,
    lineWeight: undefined,
  },
  labelFont = {
    family: 'Arial',
    size: 11,
    color: '#fff',
    weight: 'normal',
    lineColor: undefined,
    lineWeight: undefined,
  },
  bubbleClickFun = label => {
    console.log(`Bubble ${label} is clicked ...`)
  },
  legendClickFun = label => {
    console.log(`Legend ${label} is clicked ...`)
  },
  data = [
    { label: 'CRM', value: 1 },
    { label: 'API', value: 1 },
    { label: 'Data', value: 1 },
    { label: 'Commerce', value: 1 },
    { label: 'AI', value: 3 },
    { label: 'Management', value: 5 },
    { label: 'Testing', value: 6 },
    { label: 'Mobile', value: 9 },
    { label: 'Conversion', value: 9 },
    { label: 'Misc', value: 21 },
    { label: 'Databases', value: 22 },
    { label: 'DevOps', value: 22 },
    { label: 'Javascript', value: 23 },
    { label: 'Languages / Frameworks', value: 25 },
    { label: 'Front End', value: 26 },
    { label: 'Content', value: 26 },
  ],
}: BubbleChartProps) {
  const d3Container = useRef(null)

  const { height: windowHeight, width: windowWidth } = useWindowSize()

  // height = windowHeight! * 0.8
  // width = windowWidth! * 0.8

  useEffect(
    () => {
      if (d3Container.current) {
        const svg = d3.select(d3Container.current)

        if (overflow) {
          svg.style('overflow', 'visible')
        }

        const bubblesWidth = showLegend ? width * (1 - legendPercentage / 100) : width
        const legendWidth = width - bubblesWidth

        const color = d3.scaleOrdinal(d3.schemeCategory10)
        const pack = d3
          .pack()
          .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
          .padding(padding)

        const root = d3
          .hierarchy({ children: data })
          .sum(function(d: any) {
            return d.value
          })
          .sort(function(a: any, b: any) {
            return b.value - a.value
          })
          .each((d: any) => {
            if (d.data.label) {
              d.label = d.data.label
              d.id = d.data.label.toLowerCase().replace(/ |\//g, '-')
            }
          })
        const nodes = pack(root).leaves()

        const bubbleChart = svg
          .append('g')
          .attr('class', 'bubble-chart')
          .attr('transform', function(d) {
            return 'translate(' + width * graph.offsetX + ',' + width * graph.offsetY + ')'
          })

        const node = bubbleChart
          .selectAll('.node')
          .data(nodes)
          .enter()
          .append('g')
          .attr('class', 'node')
          .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')'
          })
          .on('click', function(d) {
            bubbleClickFun(d.label)
          })

        node
          .append('circle')
          .attr('id', function(d: any) {
            return d.id
          } as any)
          .attr('r', function(d) {
            return d.r - d.r * 0.04
          })
          .style('fill', function(d: any) {
            return d.data.color ? d.data.color : color(String(nodes.indexOf(d)))
          })
          .style('z-index', 1)
        // .on('mouseover', function(d) {
        //   d3.select(this).attr('r', d.r * 1.04)
        // })
        // .on('mouseout', function(d) {
        //   const r = d.r - d.r * 0.04
        //   d3.select(this).attr('r', r)
        // })

        node
          .append('clipPath')
          .attr('id', function(d) {
            return 'clip-' + d.id
          })
          .append('use')
          .attr('xlink:href', function(d) {
            return '#' + d.id
          })

        node
          .append('text')
          .attr('class', 'value-text')
          .style('font-size', `${valueFont.size}px`)
          .attr('clip-path', function(d) {
            return 'url(#clip-' + d.id + ')'
          })
          .style('font-weight', d => {
            return valueFont.weight ? valueFont.weight : 600
          })
          .style('font-family', valueFont.family)
          .style('fill', () => {
            return valueFont.color ? valueFont.color : '#000'
          })
          .style('stroke', () => {
            return valueFont.lineColor ? valueFont.lineColor : '#000'
          })
          .style('stroke-width', () => {
            return valueFont.lineWeight ? valueFont.lineWeight : 0
          })
          .text(function(d: any) {
            return d.value
          } as any)

        node
          .append('text')
          .attr('class', 'label-text')
          .style('font-size', `${labelFont.size}px`)
          .attr('clip-path', function(d) {
            return 'url(#clip-' + d.id + ')'
          })
          .style('font-weight', d => {
            return labelFont.weight ? labelFont.weight : 600
          })
          .style('font-family', labelFont.family)
          .style('fill', () => {
            return labelFont.color ? labelFont.color : '#000'
          })
          .style('stroke', () => {
            return labelFont.lineColor ? labelFont.lineColor : '#000'
          })
          .style('stroke-width', () => {
            return labelFont.lineWeight ? labelFont.lineWeight : 0
          })
          .text(function(d: any) {
            return d.label
          } as any)

        // Center the texts inside the circles.
        d3.selectAll('.label-text')
          .attr('x', function(d) {
            const self = d3.select(this) as any
            const width = self.node().getBBox().width
            return -(width / 2)
          })
          .style('opacity', function(d: any) {
            const self = d3.select(this) as any
            const width = self.node().getBBox().width
            d.hideLabel = width * 1.05 > d.r * 2
            return d.hideLabel ? 0 : 1
          })
          .attr('y', function(d) {
            return labelFont.size / 2
          })

        // Center the texts inside the circles.
        d3.selectAll('.value-text')
          .attr('x', function(d) {
            const self = d3.select(this) as any
            const width = self.node().getBBox().width
            return -(width / 2)
          })
          .attr('y', function(d: any) {
            if (d.hideLabel) {
              return valueFont.size / 3
            } else {
              return -valueFont.size * 0.5
            }
          })

        node.append('title').text(function(d: any) {
          return d.label
        })
      }
    },

    /*
            useEffect has a dependency array (below). It's a list of dependency
            variables for this useEffect block. The block will run after mount
            and whenever any of these variables change. We still have to check
            if the variables are valid, but we do not have to compare old props
            to next props to decide whether to rerender.
        */
    [d3Container.current],
  )

  return <svg className="d3-component" width={windowWidth} height={windowHeight} ref={d3Container} />
}
