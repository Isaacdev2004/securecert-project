/**
 * Remove per-page Stitch dashboard chrome so a shared portal shell can own it.
 */
export function stripDashboardChrome(html: string): string {
  let out = html;

  // Remove sidebar
  out = out.replace(/<aside\b[\s\S]*?<\/aside>/i, "");

  // Remove top header (fixed portal bar)
  out = out.replace(/<header\b[\s\S]*?<\/header>/i, "");

  // Unwrap pl-72 / pl-[18rem] chrome wrappers that only existed for the aside
  out = out.replace(
    /<div class="pl-72">\s*([\s\S]*?)\s*<\/div>\s*$/i,
    "$1",
  );
  out = out.replace(
    /<div class="pl-72([^"]*)">\s*([\s\S]*?)\s*<\/div>\s*$/i,
    "$2",
  );

  // If a lone wrapper div still wraps only <main>, keep main
  const mainOnly = out.match(/^\s*<main\b[\s\S]*<\/main>\s*$/i);
  if (mainOnly) return out.trim();

  // Prefer returning the first <main>…</main> block when present
  const mainMatch = out.match(/<main\b[\s\S]*?<\/main>/i);
  if (mainMatch) return mainMatch[0];

  return out.trim();
}

export function stripPassportChrome(html: string): string {
  let out = html;
  out = out.replace(/<header\b[\s\S]*?<\/header>/i, "");
  // Bottom tab bar
  out = out.replace(
    /<nav\b[^>]*fixed bottom[\s\S]*?<\/nav>/i,
    "",
  );
  const mainMatch = out.match(/<main\b[\s\S]*?<\/main>/i);
  if (mainMatch) return mainMatch[0];
  return out.trim();
}
