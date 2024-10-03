import * as React from "react";
import { memo } from "react";

const SvgCustomize = (props) => (
  <svg
    width="12"
    height="17"
    viewBox="0 0 12 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.25 1V9.25M9.25 9.25C8.00732 9.25 7 10.2573 7 11.5C7 12.7427 8.00732 13.75 9.25 13.75M9.25 9.25C10.4927 9.25 11.5 10.2573 11.5 11.5C11.5 12.7427 10.4927 13.75 9.25 13.75M9.25 13.75V16M3.25 16V7.75M3.25 7.75C2.00736 7.75 1 6.74264 1 5.5C1 4.25736 2.00736 3.25 3.25 3.25M3.25 7.75C4.49264 7.75 5.5 6.74264 5.5 5.5C5.5 4.25736 4.49264 3.25 3.25 3.25M3.25 3.25V1"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Memo = memo(SvgCustomize);
export default Memo;
