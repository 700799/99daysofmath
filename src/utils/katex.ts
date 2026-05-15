import katex from 'katex';

export function renderMathText(text: string): string {
  // Split on $...$ inline math segments; KaTeX-render math, leave text as-is.
  const parts: string[] = [];
  let lastIndex = 0;
  const regex = /\$([^$]+)\$/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(escapeHtml(text.slice(lastIndex, match.index)));
    }
    try {
      parts.push(
        katex.renderToString(match[1], { throwOnError: false, output: 'html' }),
      );
    } catch {
      parts.push(escapeHtml(match[0]));
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(escapeHtml(text.slice(lastIndex)));
  }
  return parts.join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
