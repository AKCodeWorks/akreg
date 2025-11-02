function parseDepString(dep: string): { name: string; version?: string } {
  if (!dep.includes("@") || (dep.startsWith("@") && dep.indexOf("@", 1) === -1)) {
    return { name: dep };
  }
  const atIndex = dep.lastIndexOf("@");
  const name = dep.slice(0, atIndex);
  const version = dep.slice(atIndex + 1);
  return { name, version };
}

export { parseDepString };