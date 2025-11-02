import type { PropsToTranslate } from "./doc.types.js";

function generateTypeTemplate(name: string, schema?: PropsToTranslate): string {
  if (!schema) return `interface ${name} {}`;
  const lines: string[] = [];

  lines.push(`interface ${name}${schema.extends ? ` extends ${schema.extends}` : ''} {`);

  for (const [field, def] of Object.entries(schema.fields)) {
    if (typeof def === 'string') {
      lines.push(`  ${field}: ${def};`);
      continue;
    }

    const desc = def.description ? `  /** ${def.description} */` : '';

    let typeStr: string;
    if (typeof def.type === 'string') {
      typeStr = def.type;
    } else {
      // object type
      const inner = Object.entries(def.type)
        .map(([k, v]) => `    ${k}: ${v};`)
        .join('\n');
      typeStr = `{\n${inner}\n  }`;
    }

    if (def.asArray) typeStr = `Array<${typeStr}>`;
    const optional = def.required === false ? '?' : '';
    lines.push(`${desc}\n  ${field}${optional}: ${typeStr};`);
  }

  lines.push('}');
  return lines.join('\n');
}

export { generateTypeTemplate };