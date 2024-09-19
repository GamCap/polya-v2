"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { chord, ChordGroup } from "d3-chord";
import { arc } from "d3-shape";
import { ribbon } from "d3-chord";
import { select } from "d3-selection";
import useResizeObserver from "@/hooks/useResizeObserver";
import useChartColors from "@/hooks/useChartColors";
import "d3-transition";
import { ChordTooltipRenderer } from "./elements/TooltipRenderer";
import { useTooltip } from "./utils";

export interface ChordDiagramProps {
  matrix: number[][];
  labels: string[];
  width?: number;
  height?: number;
  tooltipRenderer?: (props: {
    data: {
      source: { index: number; value: number };
      target: { index: number; value: number };
    };
    color: string;
    labelSource: string;
    labelTarget: string;
  }) => React.ReactNode;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  matrix,
  labels,
  tooltipRenderer = ChordTooltipRenderer,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef, width, height } = useResizeObserver<HTMLDivElement>();
  const { colors } = useChartColors();

  const { innerRadius, outerRadius } = useMemo(() => {
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 10;
    return { innerRadius, outerRadius };
  }, [width, height]);

  const chordData = useMemo(() => {
    return chord()
      .padAngle(0.05)
      .sortSubgroups((a, b) => b - a)(matrix);
  }, [matrix]);

  const { onMouseOver, onMouseOut, renderTooltipPortal } = useTooltip<any, any>(
    {
      tooltipRenderer,
      getAdditionalProps: (d) => ({
        color: colors[d.target.index % colors.length],
        labelSource: labels[d.source.index],
        labelTarget: labels[d.target.index],
        data: d,
      }),
    }
  );

  useEffect(() => {
    if (!svgRef.current || !chordData) return;

    const svg = select(svgRef.current);
    const group = svg.select(".groups");
    const ribbons = svg.select(".ribbons");

    // Draw outer arcs
    const arcPath = group.selectAll("path").data(chordData.groups);

    arcPath.join(
      (enter) =>
        enter
          .append("path")
          .attr(
            "d",
            arc<ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius)
          )
          .style("fill", (d) => colors[d.index % colors.length])
          .style("stroke", (d) => colors[d.index % colors.length]),
      (update) =>
        update
          .attr(
            "d",
            arc<ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius)
          )
          .style("fill", (d) => colors[d.index % colors.length])
          .style("stroke", (d) => colors[d.index % colors.length]),
      (exit) => exit.remove()
    );

    const text = group.selectAll("text").data(chordData.groups);

    text.join(
      (enter) =>
        enter
          .append("text")
          .attr("dy", "0.35em")
          .text((d) => labels[d.index])
          .attr("text-anchor", "middle")
          .attr("transform", (d) => {
            const angle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;

            const rotateAngle = (angle * 180) / Math.PI - 90;
            const x = Math.cos(angle) * (outerRadius + 10);
            const y = Math.sin(angle) * (outerRadius + 10);

            return angle > Math.PI
              ? `translate(${x},${y}) rotate(${rotateAngle})`
              : `translate(${x},${y}) rotate(${rotateAngle + 180})`;
          }),
      (update) =>
        update
          .text((d) => labels[d.index])
          .attr("transform", (d) => {
            const angle = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;

            const rotateAngle = (angle * 180) / Math.PI - 90;
            const x = Math.cos(angle) * (outerRadius + 10);
            const y = Math.sin(angle) * (outerRadius + 10);
            return angle > Math.PI
              ? `translate(${x},${y}) rotate(${rotateAngle})`
              : `translate(${x},${y}) rotate(${rotateAngle + 180})`;
          }),
      (exit) => exit.remove()
    );

    // Draw inner ribbons
    const ribbonPath = ribbons.selectAll("path").data(chordData);

    ribbonPath
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("d", ribbon().radius(innerRadius) as any)
            .style("fill", (d) => colors[d.target.index % colors.length])
            .style("stroke", (d) => colors[d.target.index % colors.length])
            .attr("fill-opacity", 0.7)
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut),
        (update) =>
          update
            .attr("d", ribbon().radius(innerRadius) as any)
            .style("fill", (d) => colors[d.target.index % colors.length])
            .style("stroke", (d) => colors[d.target.index % colors.length])
            .attr("fill-opacity", 0.7)
            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut),
        (exit) => exit.remove()
      )
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut);

    svg
      .selectAll("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  }, [
    chordData,
    colors,
    innerRadius,
    outerRadius,
    labels,
    width,
    height,
    onMouseOver,
    onMouseOut,
  ]);

  return (
    <>
      <div ref={containerRef} className="w-full h-full">
        {width !== 0 && height !== 0 && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="chart-chord"
          >
            <g className="groups" />
            <g className="ribbons" />
          </svg>
        )}
      </div>
      {renderTooltipPortal()}
    </>
  );
};

export default ChordDiagram;
