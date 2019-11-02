import React from "react";

const SvgAirport = props => (
  <svg height={512} viewBox="0 0 64 64" width={512} {...props}>
    <path
      d="M55 26a23 23 0 00-46 0c0 18 23 35 23 35s23-17 23-35z"
      fill="#dd3e46"
    />
    <circle cx={32} cy={26} fill="#f4f4e6" r={19} />
    <path
      d="M44 18h-4l-4 5h-5.842L36 14h-4l-7.16 9H23c-1.894 0-5 1.343-5 3s3.106 3 5 3h1.84L32 38h4l-5.842-9H36l4 5h4l-5-8z"
      fill="#87cee9"
    />
    <path
      d="M32 57a1 1 0 01-.707-.293l-7-7 1.414-1.414L32 54.586l6.293-6.293 1.414 1.414-7 7A1 1 0 0132 57z"
      fill="#eb8cb3"
    />
  </svg>
);

export default SvgAirport;
