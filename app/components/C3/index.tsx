import useChartColors from "@/hooks/useChartColors";
import { defaultConfig } from "./utils";
import BaseChart from "./BaseChart";
import { IChartOptions } from "@billboard.js/react";
import { useEffect, useMemo } from "react";
import { Chart, Data, DataItem } from "billboard.js";

export interface MultiSeriesProps {
  data: IChartOptions["data"];
  config?: IChartOptions;
  legend?: {
    position: "right" | "left" | "top" | "bottom";
    dir: "row" | "column";
    align: "start" | "center" | "end";
  };
  id?: string;
}
const MultiSeries: React.FC<MultiSeriesProps> = ({
  data,
  config,
  legend,
  id,
}) => {
  const { colors } = useChartColors();

  const dataColors = useMemo(() => {
    if (!colors || !data?.columns) return {};

    const colorMapping: { [key: string]: string } = {};

    data.columns.forEach((col, index) => {
      const dataKey = col[0];

      if (dataKey === data.x) return;

      colorMapping[dataKey as string] = colors[index % colors.length];
    });

    return colorMapping;
  }, [data, colors]);

  const c: IChartOptions = useMemo(
    () => ({
      ...defaultConfig,
      data: {
        ...data,
        colors: dataColors,
      },
      ...config,
    }),
    [dataColors, config, data]
  );

  return <BaseChart config={c} legend={legend} id={id} />;
};

export default MultiSeries;
