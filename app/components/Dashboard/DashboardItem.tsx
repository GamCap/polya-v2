import { ChartZoom, ChartZoomProps } from "../ChartZoom";
import { Button } from "../ui/Button";

export interface DashboardItemProps {
  children: React.ReactNode;
  title?: string;
  zoomProps?: ChartZoomProps;
  removeWidget?: () => void;
  editable?: boolean;
}
export const DashboardItem = ({
  children,
  title,
  zoomProps,
  removeWidget,
  editable,
}: DashboardItemProps) => {
  return (
    <div className=" w-full h-full flex flex-col gap-2 box-border">
      {editable && (
        <div className="absolute top-0.5 right-0.5  z-10">
          {removeWidget && (
            <Button
              variant="subtle"
              size="small"
              className="!text-accent-red dark:!text-accent-red !px-0 !py-0 rounded-md"
              onClick={removeWidget}
              title="Remove widget"
              iconName="Cross"
            ></Button>
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex flex-row gap-2 items-center justify-center">
          {zoomProps && <ChartZoom {...zoomProps} />}
        </div>
      </div>
      <div className="w-full h-full items-center justify-center flex overflow-hidden box-border relative">
        {children}
      </div>
    </div>
  );
};
