import type { Snippet } from "svelte"

type FieldDefinition =
  | string
  | {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: string | Record<string, any>;
    description?: string;
    required?: boolean;
    asArray?: boolean;
  };

interface PropsToTranslate {
  extends?: string;
  fields: Record<string, FieldDefinition>;
}

type DocTypes = {
  title?: string
  subtitle?: string
  propsToTranslate?: PropsToTranslate
  children?: Snippet
  propsDescription?: Snippet
  footer?: Snippet
}

export type { DocTypes, PropsToTranslate, FieldDefinition }