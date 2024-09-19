import { ChartOptions } from "billboard.js";

const defaultAxis: ChartOptions["axis"] = {
  x: {
    tick: {
      outer: false,
    },
  },
  y: {
    tick: {
      outer: false,
    },
  },
};

const defaultBar: ChartOptions["bar"] = {
  width: {
    ratio: 0.85,
  },
  radius: 8,
  padding: 0,
};

const defaultGrid: ChartOptions["grid"] = {
  x: {
    show: true,
  },
  y: {
    show: true,
  },
};

const defaultZoom: ChartOptions["zoom"] = {
  enabled: false,
};

const defaultLegend: ChartOptions["legend"] = {
  contents: {
    template:
      "<div style='display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 8px; white-space: nowrap;'><span style='background-color: {=COLOR}; width: 12px; height: 8px; border-radius: 2px;'></span><span>{=TITLE}</span></div>",
  },
};

const defaultFunnel: ChartOptions["funnel"] = {
  neck: {
    width: 200,
    height: 50,
  },
};

const defaultRadar: ChartOptions["radar"] = {
  axis: {
    max: 400,
  },
  level: {
    depth: 4,
  },
  direction: {
    clockwise: true,
  },
};

const defaultArc: ChartOptions["arc"] = {
  cornerRadius: {
    ratio: 0.05,
  },
};

const defaultDonut: ChartOptions["donut"] = {
  label: {
    show: false,
  },
  width: 30,
  padAngle: 0.01,
};

const defaultConfig: ChartOptions = {
  axis: defaultAxis,
  bar: defaultBar,
  grid: defaultGrid,
  zoom: defaultZoom,
  legend: defaultLegend,
  funnel: defaultFunnel,
  radar: defaultRadar,
  arc: defaultArc,
  donut: defaultDonut,
  padding: {
    bottom: 0,
  },
};

export {
  defaultConfig,
  defaultAxis,
  defaultBar,
  defaultGrid,
  defaultZoom,
  defaultLegend,
  defaultFunnel,
  defaultRadar,
  defaultArc,
  defaultDonut,
};
