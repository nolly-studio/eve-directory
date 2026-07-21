import type { SVGProps } from "react";

export const EveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={15}
    viewBox="0 0 169 53"
    width={47.83018867924528}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M169 8.47h-51.39L81.73 53H70.36L113 0h56zm0 36.04v8.47h-45.87V44.5zM45.87 52.98H0V44.5h45.87zm-7.21-22.43H0v-8.47h38.66z"
      fill="currentColor"
    />
    <path
      d="M169 30.55h-38.66v-8.47H169zM75.52 8.47H0V0h75.52z"
      fill="currentColor"
    />
  </svg>
);

/**
 * The Eve wordmark with a trailing slash — filesystem notation for a
 * directory ("eve/"). The slash is not a generic glyph: it reuses the exact
 * diagonal (42.64 run over 53 rise) and stroke thickness (11.37) of the "v"
 * in the wordmark, and renders at reduced opacity so it reads as a quiet
 * suffix in the gray-ladder hierarchy.
 */
export const EveDirectoryLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={15}
    viewBox="0 0 237 53"
    width={67.08}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M169 8.47h-51.39L81.73 53H70.36L113 0h56zm0 36.04v8.47h-45.87V44.5zM45.87 52.98H0V44.5h45.87zm-7.21-22.43H0v-8.47h38.66z"
      fill="currentColor"
    />
    <path
      d="M169 30.55h-38.66v-8.47H169zM75.52 8.47H0V0h75.52z"
      fill="currentColor"
    />
    <path
      d="M225.63 0H237l-42.64 53h-11.37z"
      fill="currentColor"
      opacity={0.48}
    />
  </svg>
);
