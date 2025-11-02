import type { ComponentProps } from "svelte"
import type { Highlight } from "svelte-highlight"

type CodeComponentProps = {
  href?: string
  code?: string
  theme?: Highlight['theme']
  darkTheme?: Highlight['theme']
  containerProps?: HTMLDivElement['attributes']
  language?: Highlight['language']

} & Omit<ComponentProps<Highlight>, "theme" | "code" | "language">

export type { CodeComponentProps };