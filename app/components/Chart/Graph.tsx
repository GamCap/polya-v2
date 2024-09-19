// components/ForceDirectedGraph.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import useResizeObserver from "@/hooks/useResizeObserver";
import { debounce } from "lodash";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  Simulation,
} from "d3-force";
import { select, Selection } from "d3-selection";
import { drag, D3DragEvent } from "d3-drag";
import { zoom } from "d3-zoom";
import { useGraphMethods, useTooltip } from "./utils"; // Import useTooltip

export interface BaseNode {
  id: string;
  value?: number;
  fixed?: boolean;
  draggable?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  additionalData?: any;
}

export interface Link<T extends BaseNode = BaseNode> {
  source: string | T;
  target: string | T;
}

interface ForceDirectedGraphProps<T extends BaseNode> {
  nodes: T[];
  links: Link<T>[];
  colorOption?: "individual" | "connected" | "uniform";
  defaultColor?: string;
  tooltipRenderer?: (props: any) => React.ReactNode; // Add tooltipRenderer prop
}

const ForceDirectedGraph = <T extends BaseNode>({
  nodes,
  links,
  colorOption = "uniform",
  defaultColor = "blue",
  tooltipRenderer, // Receive tooltipRenderer prop
}: ForceDirectedGraphProps<T>) => {
  // Refs and state variables
  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgGroupRef = useRef<SVGGElement | null>(null);
  const linkGroupRef = useRef<SVGGElement | null>(null);
  const nodeGroupRef = useRef<SVGGElement | null>(null);
  const linkSelectionRef = useRef<Selection<
    SVGLineElement,
    Link<T>,
    SVGGElement,
    unknown
  > | null>(null);
  const nodeSelectionRef = useRef<Selection<
    SVGGElement,
    T,
    SVGGElement,
    unknown
  > | null>(null);

  const {
    containerRef,
    width: observedWidth,
    height: observedHeight,
  } = useResizeObserver<HTMLDivElement>();

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Debounce the resize handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedResize = useCallback(
    debounce((newWidth: number, newHeight: number) => {
      setDimensions({ width: newWidth, height: newHeight });
    }, 10),
    []
  );

  useEffect(() => {
    debouncedResize(observedWidth, observedHeight);
  }, [observedWidth, observedHeight, debouncedResize]);

  // Initialize the simulation
  const simulationRef = useRef<Simulation<T, Link<T>> | null>(null);
  if (!simulationRef.current) {
    simulationRef.current = forceSimulation<T, Link<T>>();
  }
  // Store previous nodes and links to detect changes
  const prevNodesRef = useRef<T[]>(nodes);
  const prevLinksRef = useRef<Link<T>[]>(links);

  const {
    getNodeRadius,
    getNodeColor,
    getNodeBorderColor,
    getNodeBorderWidth,
    dragstarted,
    dragged,
    dragended,
  } = useGraphMethods({
    simulationRef,
    links,
    nodes,
    colorOption,
    defaultColor,
  });

  // Initialize the simulation and behaviors
  useEffect(() => {
    if (!svgRef.current || !simulationRef.current) return;

    const svg = select(svgRef.current);

    const defs = svg.selectAll("defs").data([null]).join("defs");

    // Create the main group element
    svgGroupRef.current = svg.append<SVGGElement>("g").node();

    // Add zoom behavior
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        select(svgGroupRef.current!).attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    // Create link and node groups
    linkGroupRef.current = select(svgGroupRef.current!)
      .append("g")
      .attr("class", "links")
      .node();

    nodeGroupRef.current = select(svgGroupRef.current!)
      .append("g")
      .attr("class", "nodes")
      .node();

    // Initialize the simulation
    simulationRef.current
      .force(
        "link",
        forceLink<T, Link<T>>()
          .id((d) => d.id)
          .distance(100)
          .strength(1)
      )
      .force("charge", forceManyBody().strength(-1000))
      .force(
        "collide",
        forceCollide<T>().radius((d) => getNodeRadius(d) + 2)
      )
      .on("tick", ticked);

    // Define the ticked function
    function ticked() {
      if (!linkSelectionRef.current || !nodeSelectionRef.current) return;

      linkSelectionRef.current
        .attr("x1", (d) => (d.source as T).x ?? 0)
        .attr("y1", (d) => (d.source as T).y ?? 0)
        .attr("x2", (d) => (d.target as T).x ?? 0)
        .attr("y2", (d) => (d.target as T).y ?? 0);

      nodeSelectionRef.current.attr(
        "transform",
        (d) => `translate(${d.x ?? 0},${d.y ?? 0})`
      );

      defs
        .selectAll<SVGGradientElement, Link<T>>("linearGradient")
        .data(links, (d) => `${(d.source as T).id}-${(d.target as T).id}`)
        .join("linearGradient")
        .attr(
          "id",
          (d) => `gradient-${(d.source as T).id}-${(d.target as T).id}`
        )
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", (d) => (d.source as T).x ?? 0)
        .attr("y1", (d) => (d.source as T).y ?? 0)
        .attr("x2", (d) => (d.target as T).x ?? 0)
        .attr("y2", (d) => (d.target as T).y ?? 0)
        .selectAll("stop")
        .data((d) => [
          { offset: "0%", color: getNodeBorderColor(d.source as T) },
          { offset: "100%", color: getNodeBorderColor(d.target as T) },
        ])
        .join("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);
    }

    setInitialPositions(nodes);

    // Cleanup on unmount
    return () => {
      simulationRef.current?.stop();
    };
  }, []);

  // Function to set initial positions for fixed/draggable nodes
  function setInitialPositions(nodes: T[]) {
    const fixedNodes = nodes.filter((node) => node.fixed || node.draggable);
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) / 4;
    const angleIncrement = (2 * Math.PI) / fixedNodes.length;

    fixedNodes.forEach((node, index) => {
      const angle = index * angleIncrement;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      node.x = x;
      node.y = y;
      if (node.fixed) {
        node.fx = x;
        node.fy = y;
      }
    });
  }

  // Initialize useTooltip
  const { onMouseOver, onMouseOut, renderTooltipPortal } = useTooltip<T, any>({
    tooltipRenderer: tooltipRenderer || defaultTooltipRenderer, // Provide a default renderer if none is supplied
    getAdditionalProps: (d) => {
      // For non-fixed nodes (wallets)
      if (!d.fixed) {
        const walletId = d.id;
        const tokensHeld = Object.entries(d.additionalData || {}).map(
          ([tokenId, amount]) => ({ tokenId, amount })
        );
        return {
          walletId,
          tokensHeld,
        };
      }
      // For other nodes, return empty object
      return {};
    },
  });

  // Update the graph when nodes or links change
  useEffect(() => {
    if (!simulationRef.current) return;
    if (!linkGroupRef.current || !nodeGroupRef.current) return;

    const nodesChanged = prevNodesRef.current !== nodes;
    const linksChanged = prevLinksRef.current !== links;

    prevNodesRef.current = nodes;
    prevLinksRef.current = links;

    // Update the nodes and links in the simulation
    simulationRef.current.nodes(nodes);

    simulationRef.current
      .force(
        "link",
        forceLink<T, Link<T>>(links)
          .id((d) => d.id)
          .strength(1)
      )
      .force("charge", forceManyBody().strength(-500))
      .force(
        "collide",
        forceCollide<T>().radius((d) => getNodeRadius(d) + 2)
      );

    if (nodesChanged || linksChanged) {
      simulationRef.current.alpha(1).restart();
    }

    // Select link and node groups
    const linkGroupSelection = select(linkGroupRef.current!);
    const nodeGroupSelection = select(nodeGroupRef.current!);

    // Update the link elements
    const link = linkGroupSelection
      .selectAll<SVGLineElement, Link<T>>("line")
      .data(links, (d) => `${(d.source as T).id}-${(d.target as T).id}`)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("stroke-width", 2)
            .attr(
              "stroke",
              (d) =>
                `url(#gradient-${(d.source as T).id}-${(d.target as T).id})`
            ), // Use the gradient for stroke
        undefined,
        (exit) => exit.remove()
      );

    // Update the node elements
    const node = nodeGroupSelection
      .selectAll<SVGGElement, T>("g")
      .data(nodes, (d) => d.id)
      .join(
        (enter) => {
          const nodeEnter = enter.append("g");

          nodeEnter
            .append("circle")
            .attr("r", (d) => getNodeRadius(d))
            .attr("fill", (d) => getNodeColor(d))
            .attr("stroke", (d) => getNodeBorderColor(d))
            .attr("stroke-width", (d) => getNodeBorderWidth(d));

          // Draggable and fixed nodes
          nodeEnter
            .filter((d) => !!d.draggable || !!d.fixed)
            .style("cursor", "grab")
            .call(
              drag<SVGGElement, T>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

          // Non-draggable and non-fixed nodes
          const nonDraggableNodes = nodeEnter.filter(
            (d) => !d.draggable && !d.fixed
          );

          nonDraggableNodes
            .style("pointer-events", "auto")
            .style("cursor", "copy")
            .on("click", (event, d) => {
              navigator.clipboard.writeText(d.id).then(() => {
                console.log(`Copied node id ${d.id} to clipboard`);
              });
            })
            .on("mouseover", onMouseOver)
            .on("mouseout", () => {
              onMouseOut();
            });

          return nodeEnter;
        },
        undefined, // Omit the update function
        (exit) => exit.remove()
      );

    // Apply updates to both new and existing nodes
    node
      .select<SVGCircleElement>("circle")
      .attr("fill", (d) => getNodeColor(d))
      .attr("stroke", (d) => getNodeBorderColor(d))
      .attr("stroke-width", (d) => getNodeBorderWidth(d));

    // Store the selections in refs
    linkSelectionRef.current = link;
    nodeSelectionRef.current = node;
  }, [
    nodes,
    links,
    colorOption,
    dimensions,
    dragstarted,
    dragged,
    dragended,
    getNodeColor,
    getNodeRadius,
    getNodeBorderColor,
    getNodeBorderWidth,
    onMouseOver,
    onMouseOut,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
          <g ref={svgGroupRef}>
            <g className="links" ref={linkGroupRef}></g>
            <g className="nodes" ref={nodeGroupRef}></g>
          </g>
        </svg>
      )}
      {renderTooltipPortal()}
    </div>
  );
};

// Provide a default tooltip renderer if none is provided
const defaultTooltipRenderer = (props: any) => {
  return (
    <div className="bg-white dark:bg-[#2C2C2C] bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm rounded-md text-title-12-auto-regular w-fit z-50 flex flex-col p-2 gap-2 border border-green-primary dark:border-green-primary-dark">
      <div>{props.walletId}</div>
      {props.tokensHeld?.map((item: any) => (
        <div key={item.tokenId}>
          {item.tokenId} : {item.amount}
        </div>
      ))}
    </div>
  );
};

export default ForceDirectedGraph;
