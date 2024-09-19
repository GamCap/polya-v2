import { useRef, useEffect, useCallback, useMemo } from "react";
import { createRoot, Root } from "react-dom/client";
import { createPortal } from "react-dom";
import { Link, BaseNode } from "./Graph";
import { D3DragEvent } from "d3-drag";
import { Simulation } from "d3-force";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";

interface TooltipProps<D, P> {
  tooltipRenderer: (props: P) => React.ReactNode;
  getAdditionalProps: (d: D) => P;
}

function useTooltip<D, P>({
  tooltipRenderer,
  getAdditionalProps,
}: TooltipProps<D, P>) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipRoot = useRef<Root | null>(null);

  //TODO: Fix the issue where tooltip is on the right edge of the screen and width is initially 0
  const positionTooltip = useCallback((event: MouseEvent) => {
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let tooltipX = event.pageX + 10;
      let tooltipY = event.pageY + 10;

      if (tooltipRect.width <= 0) return;

      if (tooltipX + tooltipRect.width > window.innerWidth) {
        tooltipX = event.pageX - tooltipRect.width - 10;
      }
      if (tooltipY + tooltipRect.height > window.innerHeight) {
        tooltipY = event.pageY - tooltipRect.height - 10;
      }

      tooltipRef.current.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`;
    }
  }, []);

  const onMouseOver = useCallback(
    (event: MouseEvent, d: D) => {
      const additionalProps = getAdditionalProps(d);

      if (tooltipRef.current && tooltipRoot.current) {
        tooltipRoot.current.render(
          <div>{tooltipRenderer(additionalProps)}</div>
        );
        positionTooltip(event);
        tooltipRef.current.style.opacity = "1";
        document.addEventListener("mousemove", positionTooltip);
      }
    },
    [tooltipRenderer, positionTooltip, getAdditionalProps]
  );

  const onMouseOut = useCallback(() => {
    if (tooltipRef.current && tooltipRoot.current) {
      tooltipRef.current.style.opacity = "0";
      tooltipRoot.current.render(null);
      document.removeEventListener("mousemove", positionTooltip);
    }
  }, [positionTooltip]);

  // Handling root creation and cleanup using timeout to avoid race conditions
  useEffect(() => {
    const renderTimeout = setTimeout(() => {
      if (tooltipRef.current) {
        tooltipRoot.current =
          tooltipRoot.current ?? createRoot(tooltipRef.current);
      }
    });

    return () => {
      clearTimeout(renderTimeout);
      const root = tooltipRoot.current;
      tooltipRoot.current = null;

      setTimeout(() => {
        root?.unmount();
      });
    };
  }, [tooltipRoot]);

  const renderTooltipPortal = () => {
    return createPortal(
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0,
          transition: "opacity 0.2s ease-out",
        }}
      />,
      document.body
    );
  };

  return { onMouseOver, onMouseOut, renderTooltipPortal };
}

interface useGraphMethodsProps<T extends BaseNode> {
  simulationRef: React.MutableRefObject<Simulation<T, Link<T>> | null>;
  links: Link[];
  nodes: T[];
  colorOption: "individual" | "connected" | "uniform";
  defaultColor?: string;
}

const useGraphMethods = <T extends BaseNode>({
  simulationRef,
  links,
  nodes,
  colorOption,
  defaultColor,
}: useGraphMethodsProps<T>) => {
  const getConnectedNodeColor = useCallback(
    (node: T): string => {
      if (node.fixed || node.draggable) {
        return node.color || defaultColor || "blue";
      }

      const connectedColors = links
        .filter(
          (link) =>
            link.source === node.id ||
            (typeof link.source !== "string" && link.source.id === node.id) ||
            link.target === node.id ||
            (typeof link.target !== "string" && link.target.id === node.id)
        )
        .map((link) => {
          const connectedNodeId =
            link.source === node.id ||
            (typeof link.source !== "string" && link.source.id === node.id)
              ? typeof link.target === "string"
                ? link.target
                : link.target.id
              : typeof link.source === "string"
                ? link.source
                : link.source.id;
          const connectedNode = nodes.find((n) => n.id === connectedNodeId);
          return connectedNode?.color;
        })
        .filter((color): color is string => !!color);

      if (connectedColors.length === 0) {
        return defaultColor || "blue";
      }

      return blendColors(connectedColors);
    },
    [links, nodes, defaultColor]
  );

  const blendColors = (colors: string[]): string => {
    const rgbColors = colors.map((color) => {
      let c = color.trim().toLowerCase();
      if (c.startsWith("#")) {
        c = c.slice(1);
      }
      if (c.length === 3) {
        c = c
          .split("")
          .map((char) => char + char)
          .join("");
      }
      const bigint = parseInt(c, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    });

    const total = rgbColors.length;
    const avg = rgbColors.reduce(
      (acc, color) => ({
        r: acc.r + color.r / total,
        g: acc.g + color.g / total,
        b: acc.b + color.b / total,
      }),
      { r: 0, g: 0, b: 0 }
    );

    return `rgb(${Math.round(avg.r)}, ${Math.round(avg.g)}, ${Math.round(avg.b)})`;
  };

  // const sizeScale = scaleLinear()
  // .domain([Math.min(...nodes.map((n) => n.value)), Math.max(...nodes.map((n) => n.value))])
  // .range([5, 20]);
  const sizeScale = useMemo(() => {
    const values = nodes
      .map((n) => n.value)
      .filter((v) => v !== undefined) as number[];
    const min = Math.min(...values);
    const max = Math.max(...values);
    return scaleLinear().domain([min, max]).range([5, 20]);
  }, [nodes]);

  const getNodeRadius = useCallback(
    (node: T) => {
      const size = node.value === undefined ? 30 : sizeScale(node.value);

      return size;
    },
    [sizeScale]
  );

  const getNodeColor = useCallback(
    (node: T): string => {
      switch (colorOption) {
        case "individual":
          return node.color || defaultColor || "blue";
        case "connected":
          return getConnectedNodeColor(node);
        case "uniform":
        default:
          return defaultColor || "blue";
      }
    },
    [colorOption, defaultColor, getConnectedNodeColor]
  );

  const getConnectedNodeBorderColors = useCallback(
    (node: T): string[] => {
      return links
        .filter(
          (link) =>
            link.source === node.id ||
            (typeof link.source !== "string" && link.source.id === node.id) ||
            link.target === node.id ||
            (typeof link.target !== "string" && link.target.id === node.id)
        )
        .map((link) => {
          const connectedNodeId =
            link.source === node.id ||
            (typeof link.source !== "string" && link.source.id === node.id)
              ? typeof link.target === "string"
                ? link.target
                : link.target.id
              : typeof link.source === "string"
                ? link.source
                : link.source.id;
          const connectedNode = nodes.find((n) => n.id === connectedNodeId);
          return connectedNode?.borderColor;
        })
        .filter((color): color is string => !!color); // Only keep valid colors
    },
    [links, nodes]
  );

  const getNodeBorderColor = useCallback(
    (node: T): string => {
      switch (colorOption) {
        case "individual":
          return node.borderColor || getNodeColor(node);
        case "connected": {
          if (node.fixed || node.draggable) {
            return node.borderColor || getNodeColor(node);
          }
          const connectedBorderColors = getConnectedNodeBorderColors(node);
          if (connectedBorderColors.length === 0) {
            return getNodeColor(node); // Fallback to the node's own color if no connections
          }

          return blendColors(connectedBorderColors);
        }
        case "uniform":
        default:
          return defaultColor || "blue";
      }
    },
    [colorOption, defaultColor, getConnectedNodeBorderColors, getNodeColor]
  );

  const getNodeBorderWidth = useCallback(
    (node: T): number => node.borderWidth || 2, // Default to 2px if not provided
    []
  );

  const dragstarted = useCallback(
    function (event: D3DragEvent<SVGGElement, T, unknown>, d: T) {
      if (!event.active) simulationRef.current?.alphaTarget(0.1).restart();
      d.fx = d.x;
      d.fy = d.y;
      // Change cursor to 'grabbing'
      select(event.sourceEvent.target as SVGGElement).style(
        "cursor",
        "grabbing"
      );
    },
    [simulationRef]
  );

  const dragged = (event: D3DragEvent<SVGGElement, T, unknown>, d: T) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const dragended = useCallback(
    (event: D3DragEvent<SVGGElement, T, unknown>, d: T) => {
      if (!event.active) simulationRef.current?.alphaTarget(0);
      if (!d.fixed) {
        d.fx = null;
        d.fy = null;
      }
      // Change cursor back to 'grab'
      select(event.sourceEvent.target as SVGGElement).style("cursor", "grab");
    },
    [simulationRef]
  );

  return {
    getNodeRadius,
    getNodeColor,
    getNodeBorderColor,
    getNodeBorderWidth,
    dragstarted,
    dragged,
    dragended,
  };
};

export { useTooltip, useGraphMethods };
