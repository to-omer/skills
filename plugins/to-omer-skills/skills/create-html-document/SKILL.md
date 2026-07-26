---
name: create-html-document
description: Convert supplied text, Markdown, notes, documents, or structured content into a readable, self-contained single-file HTML document. Use when the user asks to HTML-ize content, create a standalone HTML guide, report, or page, or replace Markdown with a richer previewable document.
---

# Create HTML Document

- Create one complete `.html` document that preserves the source meaning and language while improving structure, readability, and navigation.
- Use semantic HTML, responsive CSS, and only as much JavaScript as the content benefits from.
- Keep all required CSS, JavaScript, and assets inside the HTML. Do not require external stylesheets, scripts, packages, or build steps.
- Choose the layout, typography, components, and interactions from the content and audience rather than forcing a fixed template.
- Use generated images or diagrams only when requested or when they materially improve comprehension, and include useful alternative text.
- Adapt delivery to the host environment: create and attach an `.html` file when file output is available; otherwise return one complete fenced `html` block. Use a native preview when available, but do not depend on a particular product.
- Before finishing, verify that the document is complete, readable on common screen sizes, and works when opened by itself.
