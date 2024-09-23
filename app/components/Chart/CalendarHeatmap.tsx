"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { scaleSequential } from "d3-scale";
import { extent } from "d3-array";
import { interpolateRgb } from "d3-interpolate";
import { rgb } from "d3-color";
import { groups } from "d3-array";
import { utcSunday as timeWeek, utcMonths, utcMonth } from "d3-time";
import { timeDay } from "d3-time";
import { range } from "d3-array";
import { useTheme } from "next-themes";
import { timeFormat } from "d3-time-format";
import useResizeObserver from "@/hooks/useResizeObserver";
import { CalendarTooltipRenderer } from "./elements/TooltipRenderer";
import { CalendarHeatmapData } from "./types";
import * as d3selection from "d3-selection";
import "d3-transition";
import { useTooltip } from "./utils";
import { debounce } from "lodash";

export interface CalendarHeatmapProps {
  data: CalendarHeatmapData[];
  tooltipRenderer?: (props: {
    data: CalendarHeatmapData;
    color: string;
    label?: string;
  }) => React.ReactNode;
  themeColors?: {
    dark: { color: string; textColor: string };
    light: { color: string; textColor: string };
  };
  valueLabel?: string;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  data,
  tooltipRenderer = CalendarTooltipRenderer,
  themeColors = {
    dark: {
      color: "#00B393",
      textColor: "#ffffff",
    },
    light: {
      color: "#00866E",
      textColor: "#000000",
    },
  },
  valueLabel = "",
}) => {
  const [yearData, setYearData] = useState<{
    [year: string]: CalendarHeatmapData[];
  }>({});
  const [selectedYear, setSelectedYear] = useState<string>();
  const [fullYearData, setFullYearData] = useState<CalendarHeatmapData[]>([]);
  const [originalData, setOriginalData] = useState<CalendarHeatmapData[]>([]);
  const [firstDate, setFirstDate] = useState<Date>();
  const [lastDate, setLastDate] = useState<Date>();
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    width: observedWidth,
    height: observedHeight,
    containerRef,
  } = useResizeObserver<HTMLDivElement>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
  const { theme } = useTheme();
  const color = useMemo(() => {
    return theme === "dark" ? themeColors.dark.color : themeColors.light.color;
  }, [theme, themeColors]);
  const textColor = useMemo(() => {
    return theme === "dark"
      ? themeColors.dark.textColor
      : themeColors.light.textColor;
  }, [theme, themeColors]);

  const colorScale = useMemo(() => {
    return scaleSequential()
      .domain(extent(data, (d) => d.change) as [number, number])
      .interpolator(
        interpolateRgb(rgb(color).copy({ opacity: 0 }), rgb(color))
      );
  }, [data, color]);

  const { onMouseOver, onMouseOut, renderTooltipPortal } = useTooltip<any, any>(
    {
      tooltipRenderer,
      getAdditionalProps: (d) => ({
        color: colorScale(d.change),
        data: d,
        label: valueLabel,
      }),
    }
  );

  useEffect(() => {
    setOriginalData(data);
  }, [data]);

  useEffect(() => {
    // Group data by year
    if (originalData.length > 0) {
      const groupedData = originalData.reduce((acc, item) => {
        const year = new Date(item.date).getUTCFullYear().toString();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(item);
        return acc;
      }, {} as { [year: string]: CalendarHeatmapData[] });

      setYearData(groupedData);
      const yearsKeys = Object.keys(groupedData);
      setSelectedYear(yearsKeys[yearsKeys.length - 1]);
    }
  }, [originalData]);

  useEffect(() => {
    if (selectedYear && yearData[selectedYear]) {
      const yearDataArray = yearData[selectedYear];
      const firstDate = new Date(Math.min(...yearDataArray.map((d) => d.date)));
      const lastDate = new Date(Math.max(...yearDataArray.map((d) => d.date)));

      const dates = timeDay
        .range(firstDate, lastDate)
        .map((d) => d.toISOString().split("T")[0]);

      const response = dates.map((date) => {
        const timestamp = new Date(date).getTime();
        return {
          date: timestamp,
          change:
            yearDataArray.find(
              (d) =>
                new Date(
                  new Date(d.date).toISOString().split("T")[0]
                ).getTime() === timestamp
            )?.change || 0,
          counts: yearDataArray.find(
            (d) =>
              new Date(
                new Date(d.date).toISOString().split("T")[0]
              ).getTime() === timestamp
          )?.counts || {
            insert: 0,
            remove: 0,
          },
        };
      });

      setFullYearData(response);
      setFirstDate(firstDate);
      setLastDate(lastDate);
    }
  }, [selectedYear, yearData]);

  useEffect(() => {
    if (svgRef.current && firstDate && lastDate) {
      const { width, height } = dimensions;
      console.log("Dimensions", dimensions);
      const yearGroups = groups(fullYearData, (d) =>
        new Date(d.date).getUTCFullYear()
      );

      const svg = d3selection.select(svgRef.current);

      const dayLabelWidth = 50;
      const marginRight = 50;
      const monthLabelOffset = 10;
      const textHeight = 14;
      const yearLabelMargin = 2 * monthLabelOffset + textHeight;
      const marginTop = 3 * monthLabelOffset + 2 * textHeight;
      const cw =
        (width - dayLabelWidth - marginRight) /
        (timeWeek.count(firstDate, lastDate) + 1);
      const ch = (height - marginTop) / 7;

      const cellWidth = Math.min(cw, ch);
      const cellHeight = Math.min(cw, ch);

      const gridWidth = (timeWeek.count(firstDate, lastDate) + 1) * cellWidth;
      const gridHeight = 7 * cellHeight;

      const translateX =
        (width - gridWidth - dayLabelWidth - marginRight) / 2 + dayLabelWidth;
      const translateY =
        height - gridHeight - (height - gridHeight - marginTop) / 2;
      const heatmap = svg
        .select(".heatmap")
        .data(yearGroups)
        .attr("transform", `translate(${translateX},${translateY})`);

      // Heatmap rectangles
      heatmap
        .selectAll("rect")
        .data(([, values]) => values)
        .join(
          (enter) => {
            const enterSelection = enter
              .append("rect")
              .attr("width", cellWidth - 3)
              .attr("height", cellHeight - 3)
              .attr(
                "x",
                (d) =>
                  timeWeek.count(firstDate, new Date(d.date)) * cellWidth + 0.5
              )
              .attr("y", (d) => new Date(d.date).getUTCDay() * cellHeight + 0.5)
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("fill", (d) => colorScale(d.change))
              .attr("opacity", 0)
              .attr("transform", (d) => {
                const cx =
                  timeWeek.count(firstDate, new Date(d.date)) * cellWidth +
                  cellWidth / 2;
                const cy =
                  new Date(d.date).getUTCDay() * cellHeight + cellHeight / 2;
                return `translate(${cx},${cy}) scale(0) translate(${-cx},${-cy})`;
              });

            // Apply transition
            enterSelection
              .transition()
              .duration(500)
              .attr("opacity", 1)
              .attr("transform", (d) => {
                const cx =
                  timeWeek.count(firstDate, new Date(d.date)) * cellWidth +
                  cellWidth / 2;
                const cy =
                  new Date(d.date).getUTCDay() * cellHeight + cellHeight / 2;
                return `translate(${cx},${cy}) scale(1) translate(${-cx},${-cy})`;
              });

            return enterSelection; // Return the D3 selection
          },
          (update) =>
            update
              .transition()
              .duration(500)
              .attr("fill", (d) => colorScale(d.change))
              .attr("width", cellWidth - 3)
              .attr("height", cellHeight - 3)
              .attr(
                "x",
                (d) =>
                  timeWeek.count(firstDate, new Date(d.date)) * cellWidth + 0.5
              )
              .attr(
                "y",
                (d) => new Date(d.date).getUTCDay() * cellHeight + 0.5
              ),
          (exit) => exit.remove()
        )
        .on("mouseover", (event, d) => onMouseOver(event, d))
        .on("mouseleave", onMouseOut);

      // Day labels
      svg
        .select(".day-labels")
        .attr("transform", `translate(${translateX},${translateY})`)
        .selectAll("text")
        .data(range(7))
        .join(
          (enter) => {
            const enterPath = enter
              .append("text")
              .attr("x", -dayLabelWidth / 2)
              .attr("y", (i) => i * cellHeight + cellHeight / 2)
              .attr("class", "week")
              .style("font-size", "12px")
              .attr("fill", textColor)
              .text((i) => "SMTWTFS"[i]);
            enterPath
              .attr("opacity", 0)
              .transition()
              .duration(500)
              .attr("opacity", 1);
            return enterPath;
          },
          (update) =>
            update
              .transition()
              .duration(500)
              .attr("fill", textColor)
              .attr("x", -dayLabelWidth / 2)
              .attr("y", (i) => i * cellHeight + cellHeight / 2)
              .text((i) => "SMTWTFS"[i])
        );

      // Month labels
      svg
        .select(".month-labels")
        .attr("transform", `translate(${translateX},${translateY})`)
        .selectAll("text")
        .data(utcMonths(utcMonth(firstDate), lastDate))
        .join(
          (enter) => {
            const enterPath = enter
              .append("text")
              .attr(
                "x",
                (d) =>
                  timeWeek.count(firstDate, timeWeek.ceil(d)) * cellWidth + 2
              )
              .attr("y", -10)
              .attr("class", "month")
              .style("font-size", "12px")
              .attr("fill", textColor)
              .text(timeFormat("%b"))
              .attr("visibility", (d) => {
                const xPos =
                  timeWeek.count(firstDate, timeWeek.ceil(d)) * cellWidth + 2;
                return xPos < 0 ? "hidden" : "visible";
              });

            enterPath
              .attr("opacity", 0)
              .transition()
              .duration(500)
              .attr("opacity", 1);

            return enterPath;
          },

          (update) =>
            update
              .transition()
              .duration(500)
              .attr("fill", textColor)
              .attr(
                "x",
                (d) =>
                  timeWeek.count(firstDate, timeWeek.ceil(d)) * cellWidth + 2
              )
              .attr("y", -10)
              .text(timeFormat("%b"))
              .attr("visibility", (d) => {
                const xPos =
                  timeWeek.count(firstDate, timeWeek.ceil(d)) * cellWidth + 2;
                return xPos < 0 ? "hidden" : "visible";
              })
        );

      // Year Navigation Controls
      const yearLabelGroup = svg
        .selectAll(".year-label")
        .data([selectedYear])
        .join("g")
        .attr("class", "year-label")
        .attr(
          "transform",
          `translate(${translateX},${translateY - yearLabelMargin})`
        );

      const yearKeys = Object.keys(yearData);
      const currentIndex = yearKeys.indexOf(selectedYear!);
      const showPrev = currentIndex > 0;
      const showNext = currentIndex < yearKeys.length - 1;

      const onPrevYearClick = () => {
        setSelectedYear(yearKeys[currentIndex - 1]);
      };

      const onNextYearClick = () => {
        setSelectedYear(yearKeys[currentIndex + 1]);
      };
      yearLabelGroup
        .selectAll(".prev-year")
        .data(showPrev ? [yearKeys[currentIndex - 1]] : [])
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("class", "prev-year")
              .attr("x", -dayLabelWidth / 2)
              .attr("y", 0)
              .attr("font-size", "12px")
              .attr("fill", textColor)
              .style("cursor", "pointer")
              .text("<")
              .on("click", onPrevYearClick),
          (update) =>
            update
              .on("click", onPrevYearClick)
              .transition()
              .duration(500)
              .attr("fill", textColor),

          (exit) => exit.remove()
        );

      yearLabelGroup
        .selectAll(".year-text")
        .data([selectedYear])
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("class", "year-text")
              .attr("x", -dayLabelWidth / 2 + 11)
              .attr("y", 0)
              .attr("font-size", "12px")
              .attr("fill", textColor)
              .attr("text-anchor", "left")
              .text(selectedYear || ""),
          (update) =>
            update
              .transition()
              .duration(500)
              .attr("class", "year-text")
              .attr("x", -dayLabelWidth / 2 + 11)
              .attr("y", 0)
              .attr("font-size", "12px")
              .attr("fill", textColor)
              .attr("text-anchor", "left")
              .text(selectedYear || "")
        );

      yearLabelGroup
        .selectAll(".next-year")
        .data(showNext ? [yearKeys[currentIndex + 1]] : [])
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("class", "next-year")
              .attr("x", -dayLabelWidth / 2 + 42)
              .attr("y", 0)
              .attr("font-size", "12px")
              .attr("fill", textColor)
              .style("cursor", "pointer")
              .text(">")
              .on("click", onNextYearClick),
          (update) =>
            update
              .on("click", onNextYearClick)
              .transition()
              .duration(500)
              .attr("fill", textColor),

          (exit) => exit.remove()
        );
    }
  }, [
    colorScale,
    firstDate,
    fullYearData,
    lastDate,
    onMouseOut,
    onMouseOver,
    selectedYear,
    textColor,
    yearData,
    dimensions,
  ]);
  return (
    <>
      <div className="w-full h-full" ref={containerRef}>
        {dimensions.width !== 0 && dimensions.height !== 0 && selectedYear && (
          <>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="prevent-select"
            >
              <g className="heatmap" />
              <g className="day-labels" />
              <g className="month-labels" />
              <g className="year-label" />
            </svg>
          </>
        )}
      </div>
      {renderTooltipPortal()}
    </>
  );
};

export default CalendarHeatmap;
