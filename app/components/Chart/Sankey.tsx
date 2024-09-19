"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { sankey, SankeyNodeMinimal } from "d3-sankey";
import { select } from "d3-selection";
import { D3DragEvent, drag } from "d3-drag";
import useResizeObserver from "@/hooks/useResizeObserver";
import "d3-transition";
import useChartColors from "@/hooks/useChartColors";
import { SankeyTooltipRenderer as DefaultTooltipRenderer } from "./elements/TooltipRenderer";
import { useTooltip } from "./utils";

//TODO: Get rid of any types

interface SankeyNode {
  id: string;
  name?: string;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLink {
  source: string | SankeyNode;
  target: string | SankeyNode;
  value: number;
  width?: number;
}

interface SankeyChartData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface SankeyChartProps {
  data: SankeyChartData;
  width?: number;
  height?: number;
  tooltipRenderer?: (props: {
    data: SankeyLink;
    color: string;
    labelSource: string;
    labelTarget: string;
  }) => React.ReactNode;
}

export const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  tooltipRenderer = DefaultTooltipRenderer,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { colors } = useChartColors();
  const { containerRef, width, height } = useResizeObserver<HTMLDivElement>();

  const { nodes, links } = useMemo(() => {
    return sankey<SankeyNode, SankeyLink>()
      .nodeId((d) => d.id)
      .nodeWidth(4)
      .nodePadding(15)
      .extent([
        [1, 1],
        [width, height - 1],
      ])({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    });
  }, [data, width, height]);

  // Tooltip logic
  const { onMouseOver, onMouseOut, renderTooltipPortal } = useTooltip<any, any>(
    {
      tooltipRenderer,
      getAdditionalProps: (d) => ({
        color: colors[d.source.index % colors.length],
        labelSource: typeof d.source === "string" ? d.source : d.source.id,
        labelTarget: typeof d.target === "string" ? d.target : d.target.id,
        data: d,
      }),
    }
  );

  const getCustomSankeyLinkPath = (link: any) => {
    const sourceY0 = link.source.y0;
    const targetY0 = link.target.y0;

    const sourceLinkIndex = link.source.sourceLinks.indexOf(link);
    const sourceLinkHeight =
      (link.source.y1 - link.source.y0) * (link.value / link.source.value);

    // Sum of the heights of the links before the current link as offset
    const sourceLinkYOffset = link.source.sourceLinks
      .slice(0, sourceLinkIndex)
      .reduce(
        (acc: number, l: any) =>
          acc +
          (l.value / link.source.value) * (link.source.y1 - link.source.y0),
        0
      );

    const targetLinkIndex = link.target.targetLinks.indexOf(link);
    const targetLinkHeight =
      (link.target.y1 - link.target.y0) * (link.value / link.target.value);
    const targetLinkYOffset = link.target.targetLinks
      .slice(0, targetLinkIndex)
      .reduce(
        (acc: number, l: any) =>
          acc +
          (l.value / link.target.value) * (link.target.y1 - link.target.y0),
        0
      );

    const sourceX = link.source.x1;
    const sourceY = sourceY0 + sourceLinkYOffset + sourceLinkHeight / 2;

    const targetX = link.target.x0;
    const targetY = targetY0 + targetLinkYOffset + targetLinkHeight / 2;

    return `M${sourceX},${sourceY}C${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`;
  };

  // Function to handle dragging
  const dragNode = useCallback(
    (
      event: D3DragEvent<
        SVGRectElement,
        SankeyNodeMinimal<SankeyNode, SankeyLink>,
        SankeyNodeMinimal<SankeyNode, SankeyLink>
      >,
      d: SankeyNodeMinimal<SankeyNode, SankeyLink>
    ) => {
      if (
        d.x0 === undefined ||
        d.x1 === undefined ||
        d.y0 === undefined ||
        d.y1 === undefined
      ) {
        return;
      }

      const w = d.x1 - d.x0;
      const h = d.y1 - d.y0;

      const dx0 = Math.max(0, Math.min(width - w, d.x0 + event.dx));
      const dy0 = Math.max(0, Math.min(height - h, d.y0 + event.dy));
      const dx1 = Math.min(width, dx0 + w);
      const dy1 = Math.min(height, dy0 + h);
      const dx0offset = dx0 + w - dx1;
      const dy0offset = dy0 + h - dy1;

      d.x0 = dx0 - dx0offset;
      d.x1 = dx1;
      d.y0 = dy0 - dy0offset;
      d.y1 = dy1;

      // Select the dragged node and update its position
      select(event.sourceEvent.target).attr("x", d.x0).attr("y", d.y0);

      const svg = select(svgRef.current);

      // Update the node positions
      svg
        .select(".nodes")
        .selectAll("rect")
        .data(nodes)
        .attr("x", (d) => d.x0 || 0)
        .attr("y", (d) => d.y0 || 0);

      // Update the labels to follow the nodes
      svg
        .select(".labels")
        .selectAll("text")
        .data(nodes)
        .attr("x", (d) =>
          d.x0 !== undefined && d.x0 < width / 2
            ? (d.x1 || 0) + 4
            : (d.x0 || 0) - 4
        )
        .attr("y", (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
        .attr("text-anchor", (d) =>
          d.x0 !== undefined && d.x0 < width / 2 ? "start" : "end"
        );

      // Use custom link drawing function for link positions
      svg
        .select(".links")
        .selectAll("path")
        .data(links)
        .attr("d", (link: any) => getCustomSankeyLinkPath(link));
    },
    [links, nodes, width, height]
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);

    // Nodes
    const node = svg.select(".nodes").selectAll("rect").data(nodes);

    node
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => d.x0 || 0)
            .attr("y", (d) => d.y0 || 0)
            .attr("rx", 1)
            .attr("ry", 1)
            .attr("height", (d) => (d.y1 || 0) - (d.y0 || 0))
            .attr("width", (d) => (d.x1 || 0) - (d.x0 || 0))
            .attr("fill", (d, i) => colors[i % colors.length])
            .attr("stroke", "none")
            .style("cursor", "grab")
            .call(drag<any, any>().on("drag", dragNode)),
        (update) =>
          update
            .attr("x", (d) => d.x0 || 0)
            .attr("y", (d) => d.y0 || 0)
            .attr("rx", 1)
            .attr("ry", 1)
            .attr("height", (d) => (d.y1 || 0) - (d.y0 || 0))
            .attr("width", (d) => (d.x1 || 0) - (d.x0 || 0))
            .attr("fill", (d, i) => colors[i % colors.length])
            .attr("stroke", "none")
            .style("cursor", "grab")
            .call(drag<any, any>().on("drag", dragNode)),
        (exit) => exit.remove()
      )
      .append("title")
      .text((d) => `${d.id}\n${d.value}`);

    // Node Labels
    const labels = svg.select(".labels").selectAll("text").data(nodes);

    labels.join(
      (enter) =>
        enter
          .append("text")
          .attr("x", (d) =>
            d.x0 !== undefined && d.x0 < width / 2
              ? (d.x1 || 0) + 4
              : (d.x0 || 0) - 4
          )
          .attr("y", (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", (d) =>
            d.x0 !== undefined && d.x0 < width / 2 ? "start" : "end"
          )
          .text((d) => d.id),
      (update) =>
        update
          .attr("x", (d) =>
            d.x0 !== undefined && d.x0 < width / 2
              ? (d.x1 || 0) + 4
              : (d.x0 || 0) - 4
          )
          .attr("y", (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", (d) =>
            d.x0 !== undefined && d.x0 < width / 2 ? "start" : "end"
          )
          .text((d) => d.id),
      (exit) => exit.remove()
    );

    // Links
    const link = svg.select(".links").selectAll("path").data(links);

    link.join(
      (enter) =>
        enter
          .append("path")
          .attr("d", getCustomSankeyLinkPath)
          .attr("stroke", "url(#link-gradient)")
          .attr("stroke-width", (d) => Math.max(1, d.width || 0))
          .attr("fill", "none")
          .attr("stroke-opacity", 0.5)
          .on("mouseover", (event, d) => onMouseOver(event, d))
          .on("mouseout", onMouseOut),
      (update) =>
        update
          .attr("d", getCustomSankeyLinkPath)
          .attr("stroke", "url(#link-gradient)")
          .attr("stroke-width", (d) => Math.max(1, d.width || 0))
          .attr("fill", "none")
          .attr("stroke-opacity", 0.5)
          .on("mouseover", (event, d) => onMouseOver(event, d))
          .on("mouseout", onMouseOut),
      (exit) => exit.remove()
    );
  }, [
    colors,
    nodes,
    links,
    svgRef,
    width,
    height,
    dragNode,
    onMouseOut,
    onMouseOver,
  ]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {width !== 0 && height !== 0 && (
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="chart-sankey prevent-select"
        >
          <g className="links" />
          <g className="nodes" />
          <g className="labels" />
          <defs>
            <linearGradient id="link-gradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#157C67" />
              <stop offset="100%" stopColor="#3474670D" />
            </linearGradient>
          </defs>
        </svg>
      )}
      {renderTooltipPortal()}
    </div>
  );
};

export default SankeyChart;
