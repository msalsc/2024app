import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      fill="none"
      color="#17345b"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.25 8.75L9.75 12l3.5 3.25"
      />
    </Svg>
  );
}

export default SvgComponent;
