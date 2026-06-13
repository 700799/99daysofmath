import katex from 'katex';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInlineMarkdown(text: string): string {
  // Convert simple markdown to HTML on already-escaped text.
  // Bold: **text** → <strong>text</strong>
  // Italic: *text* → <em>text</em>  (skip — too ambiguous with multiplication)
  let out = escapeHtml(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

export function renderMathText(text: string): string {
  // Split on $...$ inline math segments; KaTeX-render math, markdown the rest.
  const parts: string[] = [];
  let lastIndex = 0;
  const regex = /\$([^$]+)\$/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderInlineMarkdown(text.slice(lastIndex, match.index)));
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
    parts.push(renderInlineMarkdown(text.slice(lastIndex)));
  }
  return parts.join('');
}
