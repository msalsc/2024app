import * as React from "react";
import Svg, { G, Mask, Path } from "react-native-svg";

function SvgComponent(props) {
  return (
    <Svg
      width={55}
      height={58}
      viewBox="0 0 55 58"
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
        width={55}
        height={58}
      >
        <Path d="M0 .719h54.667v56.614H0V.72z" fill="#fff" />
      </Mask>
      <G mask="url(#a)">
        <Mask
          id="b"
          style={{
            maskType: "luminance",
          }}
          maskUnits="userSpaceOnUse"
          x={-39}
          y={-53}
          width={102}
          height={120}
        >
          <Path
            d="M29.36 66.74l-67.948-23.808 33.4-95.323 67.949 23.813L29.36 66.74z"
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
            x={-39}
            y={-53}
            width={102}
            height={120}
          >
            <Path
              d="M29.36 66.74l-67.948-23.808 33.4-95.323 67.949 23.813L29.36 66.74z"
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
              x={-39}
              y={-53}
              width={102}
              height={120}
            >
              <Path
                d="M29.36 66.74l-67.985-23.823 33.401-95.333 67.99 23.823L29.359 66.74z"
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
                x={-39}
                y={-53}
                width={102}
                height={120}
              >
                <Path
                  d="M29.36 66.74l-67.944-23.807 33.396-95.318L62.76-28.578 29.36 66.74z"
                  fill="#fff"
                />
              </Mask>
              <G mask="url(#e)">
                <Path
                  d="M-16.188-20.718c4.646-10.308 11.276-17.907 22.25-20.813 12.828-3.396 29.323.98 38.698 10.755 6.35 6.63 10.12 16.11 8.865 25.323-4.24 31.026-34.13 38.688-45.87 52.516-2.682 3.166-4.484 6.286-5.349 8.448l-.01.031c-.532 1.26-2.24 1.422-3.115.365-.187-.24-.333-.47-.48-.688-7.556-10.828-13.072-23.193-16.098-36.042-2.386-10.156-4.146-20.875-1.76-31.036.536-2.302 1.87-6.625 2.87-8.86z"
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
