import * as React from "react";
import Svg, { G, Mask, Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      width={54}
      height={56}
      viewBox="0 0 54 56"
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
        y={0}
        width={54}
        height={56}
      >
        <Path d="M0 0h53.333v55.276H0V0z" fill="#fff" />
      </Mask>
      <G mask="url(#a)">
        <Mask
          id="b"
          style={{
            maskType: "luminance",
          }}
          maskUnits="userSpaceOnUse"
          x={-9}
          y={-10}
          width={102}
          height={120}
        >
          <Path
            d="M59.375 109.673L-8.578 85.861l33.4-95.318 67.949 23.813-33.396 95.317z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#b)">
          <Mask
            id="c"
            style={{
              maskType: "luminance",
            }}
            maskUnits="userSpaceOnUse"
            x={-9}
            y={-10}
            width={102}
            height={120}
          >
            <Path
              d="M24.792-9.695L92.74 14.112 59.344 109.43-8.604 85.622 24.792-9.695z"
              fill="#fff"
            />
          </Mask>
          <G mask="url(#c)">
            <Mask
              id="d"
              style={{
                maskType: "luminance",
              }}
              maskUnits="userSpaceOnUse"
              x={-9}
              y={-10}
              width={102}
              height={120}
            >
              <Path
                d="M24.792-9.695l67.99 23.823-33.407 95.328-67.984-23.823 33.4-95.328z"
                fill="#fff"
              />
            </Mask>
            <G mask="url(#d)">
              <Mask
                id="e"
                style={{
                  maskType: "luminance",
                }}
                maskUnits="userSpaceOnUse"
                x={-9}
                y={-10}
                width={102}
                height={120}
              >
                <Path
                  d="M24.792-9.695L92.74 14.112l-33.396 95.312-67.948-23.807L24.792-9.695z"
                  fill="#fff"
                />
              </Mask>
              <G mask="url(#e)">
                <Path
                  d="M70.339 77.757C65.693 88.07 59.068 95.663 48.089 98.57c-12.828 3.401-29.323-.974-38.693-10.75C3.042 81.19-.729 71.71.531 62.497c4.24-31.026 34.13-38.688 45.865-52.521 2.688-3.167 4.49-6.281 5.349-8.443l.01-.031C52.287.236 54 .08 54.87 1.137c.193.235.339.469.484.683A105.65 105.65 0 0171.448 37.86c2.39 10.162 4.146 20.88 1.766 31.037-.542 2.302-1.87 6.63-2.875 8.859z"
                  fill="#17345B"
                />
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgComponent;
