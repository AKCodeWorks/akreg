function extractAkuiVersion(content: string): string | null {
  const regex = /AKUI_VERSION:\s*([\w.]+)/i;
  const match = content.match(regex);
  return match ? match[1] : null;
}

export { extractAkuiVersion };