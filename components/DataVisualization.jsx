'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DataVisualization() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Sample data representing cinematographer expertise/skills/projects
    const data = [
      { name: "Commercial", value: 85 },
      { name: "Feature Films", value: 92 },
      { name: "Music Videos", value: 78 },
      { name: "Documentary", value: 88 },
      { name: "Short Films", value: 95 }
    ];

    // SVG dimensions
    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add gradient definition
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", innerHeight);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ff9000");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ff2070");

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Create group for chart elements
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add bars with animation
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", "url(#bar-gradient)")
      .attr("rx", 4)
      .attr("ry", 4)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 150)
      .attr("y", d => y(d.value))
      .attr("height", d => innerHeight - y(d.value));

    // Add value labels
    g.selectAll(".value-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 10)
      .attr("text-anchor", "middle")
      .text(d => `${d.value}%`)
      .style("font-size", "12px")
      .style("fill", "#ffffff")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 150 + 500)
      .style("opacity", 1);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#ffffff")
      .attr("dx", "0")
      .attr("dy", "20");

    // Style axes
    g.selectAll(".domain, .tick line")
      .style("stroke", "#ffffff");

    // Add the background lines for y-axis to improve readability
    g.selectAll("grid-line")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("y1", d => y(d))
      .attr("x2", innerWidth)
      .attr("y2", d => y(d))
      .style("stroke", "rgba(255, 255, 255, 0.1)")
      .style("stroke-dasharray", "4,4");

  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h3 className="text-3xl font-serif mb-10 text-center">Expertise By Category</h3>
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet"></svg>
      </div>
      <p className="text-center mt-6 text-gray-400 text-sm">
        Based on client satisfaction and industry recognition
      </p>
    </div>
  );
}
