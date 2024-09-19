"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import "billboard.js/dist/billboard.css";
import { bb, Data } from "billboard.js";
import cx from "classnames";
import BillboardJS, { IChart, IChartOptions } from "@billboard.js/react";
import useResizeObserver from "@/hooks/useResizeObserver";
import { debounce } from "lodash";
type BaseChartProps = {
  config: IChartOptions;
  legend?: {
    position: "right" | "left" | "top" | "bottom";
    dir: "row" | "column";
    align: "start" | "center" | "end";
  };
  id?: string;
};

const BaseChart: React.FC<BaseChartProps> = ({ config, legend, id }) => {
  const chartRef = useRef<IChart | null>(null);
  const { width, height, containerRef } = useResizeObserver<HTMLDivElement>();
  const [localSize, setLocalSize] = useState({ width: 0, height: 0 });

  const options: IChartOptions = useMemo(() => {
    return {
      ...config,
      legend: {
        ...config?.legend,
        contents: {
          ...config?.legend?.contents,
          bindto: `#legend${id ? `-${id}` : ""}`,
        },
      },
      resize: {
        auto: false,
        timer: 100,
      },
    };
  }, [config, id]);

  const debouncedSetDimensions = useMemo(
    () =>
      debounce((width, height) => {
        setLocalSize({ width, height });
      }, 100),
    []
  );

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.instance?.resize();
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.instance?.data.colors(
        config.data?.colors as { [key: string]: string }
      );
    }
  }, [config.data?.colors]);

  useEffect(() => {
    if (width && height) {
      debouncedSetDimensions(width, height);
    }
  }, [width, height, debouncedSetDimensions]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.instance?.resize(localSize);
    }
  }, [localSize]);

  return (
    <div
      className={cx(
        "flex",
        legend?.position === "left"
          ? "flex-row"
          : legend?.position === "right"
            ? "flex-row-reverse"
            : legend?.position === "bottom"
              ? "flex-col-reverse"
              : "flex-col",
        "items-center justify-center w-full h-full overflow-hidden"
      )}
    >
      <div
        id={`legend${id ? `-${id}` : ""}`}
        className={cx(
          "flex gap-4",
          legend?.position === "left" || legend?.position === "right"
            ? "h-full w-fit"
            : "w-full h-fit",
          legend?.dir === "column" ? "flex-col" : "flex-row",
          legend?.align === "start"
            ? "justify-start"
            : legend?.align === "center"
              ? "justify-center"
              : "justify-end"
        )}
      />
      <div
        ref={containerRef}
        className={cx(
          "grow",
          legend?.position === "left" || legend?.position === "right"
            ? "h-full min-w-0"
            : "w-full min-h-0"
        )}
      >
        <BillboardJS options={options} bb={bb} className="bb" ref={chartRef} />
      </div>
    </div>
  );
};

export default BaseChart;
