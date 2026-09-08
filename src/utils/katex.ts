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
  //
  // `\$` is an escaped dollar sign and never a delimiter — the same thing it
  // means inside math, so "\$12" reads as twelve dollars whether it sits in
  // prose or in a formula. Scanned by hand rather than by regex because a
  // pattern like /\$([^$]+)\$/ cannot tell a delimiter from an escaped dollar,
  // and would pair the two dollars in "\$5 to \$9" into a math span.
  const parts: string[] = [];
  let prose = '';
  let i = 0;

  const flushProse = () => {
    if (prose) {
      parts.push(renderInlineMarkdown(prose));
      prose = '';
    }
  };

  while (i < text.length) {
    if (text[i] === '\\' && text[i + 1] === '$') {
      prose += '$';
      i += 2;
      continue;
    }

    if (text[i] === '$') {
      // Look for the closing delimiter, stepping over any escaped dollars.
      let j = i + 1;
      let body = '';
      let closed = false;
      while (j < text.length) {
        if (text[j] === '\\' && text[j + 1] === '$') {
          body += '\\$'; // KaTeX renders this as a literal $
          j += 2;
          continue;
        }
        if (text[j] === '$') {
          closed = true;
          break;
        }
        body += text[j];
        j += 1;
      }
      if (closed && body.length > 0) {
        flushProse();
        try {
          parts.push(katex.renderToString(body, { throwOnError: false, output: 'html' }));
        } catch {
          parts.push(escapeHtml(`$${body}$`));
        }
        i = j + 1;
        continue;
      }
      // Unpaired: a lone dollar is just a dollar.
      prose += '$';
      i += 1;
      continue;
    }

    prose += text[i];
    i += 1;
  }

  flushProse();
  return parts.join('');
}
