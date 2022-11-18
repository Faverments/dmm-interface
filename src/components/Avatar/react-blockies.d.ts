declare module "@vukhaihoan/react-blockies" {
  import * as React from "react"

  interface BlockiesProps {
    seed: string;
    size?: number;
    scale?: number;
    color?: string;
    bgColor?: string;
    spotColor?: string;
    className?: string;
    style: React.CSSProperties;
  }

  export = React.Component<BlockiesProps>
}