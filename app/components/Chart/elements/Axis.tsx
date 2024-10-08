import { NumberValue, ScaleBand, ScaleLinear } from "d3-scale";
import { Axis as D3Axis, axisBottom, axisLeft } from "d3-axis";
import { useEffect, useRef } from "react";
import { select } from "d3-selection";

interface AxisProps {
  scale: ScaleBand<string> | ScaleLinear<number, number>;
  size: number;
  length: number;
  position: "bottom" | "left";
  vertical: boolean;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  gridConfig?: {
    show: boolean;
    dashed: boolean;
  };
  axisFormat?: (value: number | string) => string; // Formatting function for axis labels
  axisTicks?: number; // Divider to calculate number of ticks
}

export const Axis: React.FC<AxisProps> = ({
  scale,
  size,
  length,
  position,
  vertical,
  margin,
  gridConfig,
  axisFormat,
  axisTicks = 50,
}) => {
  const axisRef = useRef<SVGGElement | null>(null);
  const gridLinesRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!axisRef.current) return;

    let ax: D3Axis<NumberValue> | D3Axis<string>;

    // Determine the appropriate axis based on position and scale type
    if (position === "bottom") {
      ax = vertical
        ? axisBottom(scale as ScaleLinear<number, number>)
        : axisBottom(scale as ScaleBand<string>);
    } else {
      ax = vertical
        ? axisLeft(scale as ScaleBand<string>)
        : axisLeft(scale as ScaleLinear<number, number>);
    }

    // Calculate the number of ticks based on axisTicks as a divider
    let tickCount = 2; // Default minimum tick count
    if (axisTicks !== undefined) {
      tickCount = Math.max(Math.floor(length / axisTicks), 2);
    }

    // Determine tickValues based on the type of scale
    let tickValues: string[] | number[] | undefined = undefined;
    if ("ticks" in scale) {
      // For continuous scales like scaleLinear
      tickValues = (scale as ScaleLinear<number, number>).ticks(tickCount);
    } else if ("domain" in scale) {
      // For ordinal scales like scaleBand
      const domain = scale.domain();
      const step = Math.ceil(domain.length / tickCount);
      tickValues = domain.filter((_, i) => i % step === 0);
    }

    // Apply custom tick format if provided
    if (axisFormat) {
      ax.tickFormat((d: any) => axisFormat(d));
    }

    // Apply tickValues and other settings to the axis
    const axis = select(axisRef.current)
      .attr("opacity", 0)
      .call(ax.tickValues(tickValues as any))
      .transition()
      .duration(500)
      .attr("opacity", 1);

    if (gridConfig?.show && gridLinesRef.current) {
      const gridLinesSelection = select(gridLinesRef.current);
      gridLinesSelection.selectAll("*").remove();

      const bandScale = scale as ScaleBand<string>;
      const linearScale = scale as ScaleLinear<number, number>;

      const ax =
        position === "bottom"
          ? vertical
            ? axisBottom(linearScale)
            : axisBottom(bandScale)
          : vertical
            ? axisLeft(bandScale)
            : axisLeft(linearScale);

      gridLinesSelection
        .attr(
          "transform",
          position === "bottom"
            ? `translate(0, ${margin.top})`
            : `translate(${size - margin.right}, 0)`
        )
        .transition()
        .duration(500)
        .call(
          ax
            .tickValues(tickValues as any)
            .tickSize(
              size -
                (position === "bottom"
                  ? margin.bottom + margin.top
                  : margin.left + margin.right)
            )
        );
      gridLinesSelection.selectAll("text").remove();
      gridLinesSelection.selectAll("path").remove();
      gridLinesSelection
        .selectAll("line")
        .style("stroke-dasharray", gridConfig?.dashed ? "4" : "0");
    }
  }, [
    length,
    scale,
    position,
    vertical,
    size,
    margin,
    gridConfig,
    axisFormat,
    axisTicks,
  ]);

  return (
    <>
      <g
        className={`${position === "bottom" ? "x-axis" : "y-axis"} chart-axis`}
        transform={`${
          position === "bottom"
            ? vertical
              ? `translate(0, ${margin.top})`
              : `translate(0, ${size - margin.bottom})`
            : `translate(${margin.left}, 0)`
        }`}
        ref={axisRef}
      />
      {gridConfig?.show && (
        <g
          className="grid-lines"
          ref={gridLinesRef}
          transform={`${
            position === "bottom"
              ? vertical
                ? `translate(0, ${margin.top})`
                : `translate(0, ${size - margin.bottom})`
              : `translate(${margin.left}, 0)`
          }`}
        />
      )}
    </>
  );
};
