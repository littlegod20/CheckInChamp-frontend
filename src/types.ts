declare module "react-heatmap-grid" {
  interface HeatMapProps {
    xLabels?: string[];
    yLabels?: string[];
    data: number[][];
    background?: string;
    height?: number;
    squares?: boolean;
    onClick?: (x: number, y: number) => void;
    cellStyle?: object;
    cellRender?: (value: number) => React.ReactNode;
    title?: string;
    xLabelWidth?: number;
    yLabelWidth?: number;
  }

  export default function HeatMap(props: HeatMapProps): JSX.Element;
}
