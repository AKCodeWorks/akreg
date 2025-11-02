function versionSatisfies(installed: string, required?: string): boolean {
  if (!required) return true;
  const clean = (v: string) => v.replace(/[^0-9.]/g, "");
  const [a, b] = [clean(installed), clean(required)];
  if (!a || !b) return false;
  return a.localeCompare(b, undefined, { numeric: true }) >= 0;
}

export { versionSatisfies };