import type { SVGProps } from "react";

/** Shared path data for the Eve wordmark (viewBox 0 0 169 53). */
export const EVE_ICON_PATHS = [
  "M169 8.47h-51.39L81.73 53H70.36L113 0h56zm0 36.04v8.47h-45.87V44.5zM45.87 52.98H0V44.5h45.87zm-7.21-22.43H0v-8.47h38.66z",
  "M169 30.55h-38.66v-8.47H169zM75.52 8.47H0V0h75.52z",
] as const;

/**
 * Trailing slash for the directory wordmark — same diagonal (42.64 / 53) and
 * thickness (11.37) as the "v", drawn in the 237×53 Eve Directory viewBox.
 */
export const EVE_DIRECTORY_SLASH_PATH = "M225.63 0H237l-42.64 53h-11.37z";

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
    {EVE_ICON_PATHS.map((d) => (
      <path key={d} d={d} fill="currentColor" />
    ))}
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
    {EVE_ICON_PATHS.map((d) => (
      <path key={d} d={d} fill="currentColor" />
    ))}
    <path d={EVE_DIRECTORY_SLASH_PATH} fill="currentColor" opacity={0.48} />
  </svg>
);
