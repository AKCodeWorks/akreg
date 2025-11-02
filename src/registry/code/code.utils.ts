
async function getComponentCode(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Failed to fetch component:', res.statusText);
    return;
  }
  const text = await res.text();
  return text;
}


export { getComponentCode };