"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { Axis } from "./elements/Axis";
import { useTheme } from "next-themes";
import { HeatmapData } from "./types";
import useResizeObserver from "@/hooks/useResizeObserver";
import { HeatmapTooltipRenderer as DefaultTooltipRenderer } from "./elements/TooltipRenderer";
import { scaleBand, scaleSequential } from "d3-scale";
import { extent } from "d3-array";
import { interpolateRgb } from "d3-interpolate";
import { rgb } from "d3-color";
import * as d3selection from "d3-selection";
import "d3-transition";
import { useTooltip } from "./utils";

export interface HeatmapProps {
  data: HeatmapData[];
  margin?: { top: number; right: number; bottom: number; left: number };
  themeColors?: { dark: { color: string }; light: { color: string } };
  tooltipRenderer?: (props: {
    data: HeatmapData;
    color: string;
  }) => React.ReactNode;
}

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  themeColors = {
    dark: {
      color: "#00B393",
    },
    light: {
      color: "#00866E",
    },
  },
  tooltipRenderer = DefaultTooltipRenderer,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { width, height, containerRef } = useResizeObserver<HTMLDivElement>();

  const { theme } = useTheme();
  const color = useMemo(() => {
    return theme === "dark" ? themeColors.dark.color : themeColors.light.color;
  }, [theme, themeColors]);

  const { xScale, yScale, colorScale, heatmapTransform, axisTransform } =
    useMemo(() => {
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const xDomain = Array.from(new Set(data.map((d) => d.x.toString())));
      const yDomain = Array.from(new Set(data.map((d) => d.y.toString())));

      const xBandwidth = innerWidth / xDomain.length;
      const yBandwidth = innerHeight / yDomain.length;

      const cellSize = Math.min(xBandwidth, yBandwidth);

      const xScale = scaleBand()
        .domain(xDomain)
        .range([0, cellSize * xDomain.length])
        .padding(0.1);
      const yScale = scaleBand()
        .domain(yDomain)
        .range([cellSize * yDomain.length, 0])
        .padding(0.1);

      const colorScale = scaleSequential()
        .domain(extent(data, (d) => d.value) as [number, number])
        .interpolator(
          interpolateRgb(rgb(color).copy({ opacity: 0 }), rgb(color))
        );

      const heatmapWidth = cellSize * xDomain.length;
      const heatmapHeight = cellSize * yDomain.length;
      const heatmapTransform = `translate(${(innerWidth - heatmapWidth) / 2 + margin.left}, ${(innerHeight - heatmapHeight) / 2 + margin.top})`;
      const axisTransform = `translate(${(innerWidth - heatmapWidth) / 2}, ${(innerHeight - heatmapHeight) / 2})`;

      return { xScale, yScale, colorScale, heatmapTransform, axisTransform };
    }, [data, width, height, color, margin]);

  const { onMouseOver, onMouseOut, renderTooltipPortal } = useTooltip<any, any>(
    {
      tooltipRenderer: tooltipRenderer,
      getAdditionalProps: (d) => ({
        color: colorScale(d.value),
        data: d,
      }),
    }
  );

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3selection.select(svgRef.current);

      svg
        .select<SVGGElement>(".x-axis")
        .attr(
          "transform",
          `translate(${margin.left}, ${height - margin.bottom})`
        );

      svg
        .select<SVGGElement>(".y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      svg
        .select<SVGGElement>(".heatmap")
        .attr("transform", heatmapTransform)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => xScale(d.x.toString()) || 0)
        .attr("y", (d) => yScale(d.y.toString()) || 0)
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", (d) => colorScale(d.value))
        .on("mouseover", (event, d) => onMouseOver(event, d))
        .on("mouseout", onMouseOut);

      svg.select(".axis").attr("transform", axisTransform);
    }
  }, [
    axisTransform,
    colorScale,
    data,
    heatmapTransform,
    height,
    margin.bottom,
    margin.left,
    margin.top,
    onMouseOut,
    onMouseOver,
    xScale,
    yScale,
  ]);

  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center"
        ref={containerRef}
      >
        {width !== 0 && height !== 0 && (
          <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
            <g className="axis">
              <Axis
                scale={xScale}
                length={height}
                size={width}
                position="bottom"
                vertical={false}
                margin={margin}
              />
              <Axis
                scale={yScale}
                length={width}
                size={height}
                position="left"
                vertical={false}
                margin={margin}
              />
            </g>

            <g className="heatmap" />
          </svg>
        )}
      </div>
      {renderTooltipPortal()}
    </>
  );
};
