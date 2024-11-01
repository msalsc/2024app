import * as React from "react";
import Svg, { G, Mask, Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      width={51}
      height={50}
      viewBox="0 0 51 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Mask
        id="a"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={3}
        width={41}
        height={41}
      >
        <Path d="M.542 3.334h40.124v40H.542v-40z" fill="#fff" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M39.61 22.938c-18.277.682-18.834 1.24-19.522 19.443-.687-18.203-1.245-18.76-19.52-19.443 18.275-.687 18.833-1.245 19.52-19.448.688 18.203 1.245 18.76 19.521 19.448z"
          fill="#17345B"
        />
      </G>
      <Mask
        id="b"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={28}
        y={27}
        width={23}
        height={23}
      >
        <Path d="M28.719 27.459H50.51V49.12H28.72V27.46z" fill="#fff" />
      </Mask>
      <G mask="url(#b)">
        <Path
          d="M50.51 38.292c-10.177.38-10.49.688-10.875 10.828-.38-10.14-.692-10.447-10.87-10.828 10.178-.385 10.49-.692 10.87-10.833.386 10.14.698 10.448 10.875 10.833z"
          fill="#17345B"
        />
      </G>
      <Mask
        id="c"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={28}
        y={0}
        width={17}
        height={17}
      >
        <Path d="M28.666.12h16v16.546h-16V.119z" fill="#fff" />
      </Mask>
      <G mask="url(#c)">
        <Path
          d="M44.12 7.765c-7.188.27-7.406.49-7.677 7.651-.271-7.161-.49-7.38-7.677-7.651 7.187-.266 7.406-.484 7.677-7.646.27 7.162.49 7.38 7.677 7.646z"
          fill="#17345B"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
