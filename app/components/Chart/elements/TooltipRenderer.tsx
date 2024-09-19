import { CalendarHeatmapData, HeatmapData } from "../types";
import { Text } from "@/components/ui/Typography";

interface TooltipBase<T> {
  data: T;
}

interface CalendarTooltipProps extends TooltipBase<CalendarHeatmapData> {
  color: string;
  label?: string;
}

interface HeatmapTooltipProps extends TooltipBase<HeatmapData> {
  color: string;
}

interface ChordTooltipProps
  extends TooltipBase<{
    source: { index: number; value: number };
    target: { index: number; value: number };
  }> {
  color: string;
  labelSource: string;
  labelTarget: string;
}

interface SankeyTooltipProps
  extends TooltipBase<{
    source: { id: string; value: number };
    target: { id: string; value: number };
    value: number;
  }> {
  color: string;
  labelSource: string;
  labelTarget: string;
}

const CalendarTooltipRenderer: React.FC<CalendarTooltipProps> = ({
  data,
  color,
  label = "",
}) => {
  // format date to look like 18 Jan 2022
  const formatDate = (date: number) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="bg-white shadow-small-elements rounded-sm p-3">
      <div className={`flex flex-col gap-2 items-center justify-center`}>
        <div className="flex flex-row gap-1 items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white dark:bg-black">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />
          </div>
          <div className="text-[11px] font-bold text-neutral-800">
            {formatDate(data.date)}
          </div>
        </div>
        <div className="text-[11px] font-bold text-neutral-800">
          {"Change: "}
          {data.change.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
        <p className="text-[11px] font-bold text-neutral-800">
          {"Insert Count: "}
          {data.counts.insert.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="text-[11px] font-bold text-neutral-800">
          {"Remove Count: "}
          {data.counts.remove.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
      </div>
    </div>
  );
};

const HeatmapTooltipRenderer: React.FC<HeatmapTooltipProps> = ({
  data,
  color,
}) => (
  <div className="bg-white  shadow-small-elements rounded-sm p-3">
    <div className="flex flex-row gap-4 items-center justify-center">
      <div className="flex flex-row gap-1 items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white dark:bg-black">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />
        </div>
        <Text className=" text-[11px] font-bold text-neutral-800 ">
          {data.x}
        </Text>
      </div>
      <Text className=" text-[11px] font-bold text-neutral-800 ">
        {data.value}
      </Text>
    </div>
  </div>
);

const ChordTooltipRenderer: React.FC<ChordTooltipProps> = ({
  data,
  color,
  labelSource,
  labelTarget,
}) => {
  return (
    <div className="bg-white shadow-small-elements rounded-sm p-3">
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-row gap-1 items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white dark:bg-black">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />
          </div>
          <div className="text-[11px] font-bold text-neutral-800">
            {labelSource} → {labelTarget}
          </div>
        </div>
        <div className="text-[11px] font-bold text-neutral-800">
          {"Source Value: "}
          {data.source.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
        <div className="text-[11px] font-bold text-neutral-800">
          {"Target Value: "}
          {data.target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </div>
    </div>
  );
};

const SankeyTooltipRenderer: React.FC<SankeyTooltipProps> = ({
  data,
  color,
  labelSource,
  labelTarget,
}) => {
  return (
    <div className="bg-white shadow-small-elements rounded-sm p-3">
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-row gap-1 items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white dark:bg-black">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />
          </div>
          <div className="text-[11px] font-bold text-neutral-800">
            {labelSource} → {labelTarget}
          </div>
        </div>
        <div className="text-[11px] font-bold text-neutral-800">
          {"Flow: "}
          {data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </div>
    </div>
  );
};

export {
  CalendarTooltipRenderer,
  HeatmapTooltipRenderer,
  ChordTooltipRenderer,
  SankeyTooltipRenderer,
};
