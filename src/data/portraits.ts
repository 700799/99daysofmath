// Vector portraits for mathematicians working today, drawn in the app's own
// style so they sit beside the emoji icons of the historical figures without a
// photograph. Each is a self-contained SVG string on a 200 × 200 canvas.

/**
 * Dr. Adam Wolfe: close-cropped grey hair receding to a bald crown, light
 * stubble, a dark green zip jacket, standing by the water on a bright day
 * with mountains across the bay.
 */
export const WOLFE_PORTRAIT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Portrait of Dr. Adam Wolfe">
<defs>
<linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f0f5"/><stop offset="1" stop-color="#c3d2de"/></linearGradient>
<linearGradient id="wp-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa3b8"/><stop offset="1" stop-color="#5f7d96"/></linearGradient>
<linearGradient id="wp-coat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f4b38"/><stop offset="1" stop-color="#28311f"/></linearGradient>
<radialGradient id="wp-sun" cx="0.8" cy="0.1" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<clipPath id="wp-clip"><rect width="200" height="200"/></clipPath>
</defs>
<g clip-path="url(#wp-clip)">
<rect width="200" height="200" fill="url(#wp-sky)"/>
<rect width="200" height="200" fill="url(#wp-sun)"/>
<path d="M-5 84 L24 66 L52 78 L84 60 L118 76 L150 62 L182 74 L210 64 L210 92 L-5 92 Z" fill="#9aacba"/>
<path d="M-5 88 L30 80 L70 86 L110 82 L150 86 L210 80 L210 96 L-5 96 Z" fill="#7d93a6"/>
<rect x="-5" y="92" width="215" height="110" fill="url(#wp-sea)"/>
<g stroke="#f4f8fb" stroke-width="1.6" stroke-linecap="round" opacity="0.8">
<path d="M130 102 L138 102 M150 100 L162 100 M172 104 L180 104 M142 110 L150 110 M164 112 L176 112 M186 108 L196 108 M136 120 L146 120 M158 122 L170 122 M184 118 L194 118 M148 132 L158 132 M172 134 L184 134 M20 108 L28 108 M8 120 L16 120 M30 126 L40 126 M14 138 L24 138"/>
</g>
<path d="M22 200 C26 170 46 152 74 146 L126 146 C154 152 174 170 178 200 Z" fill="url(#wp-coat)"/>
<path d="M74 146 C66 150 60 160 60 170 L74 168 C76 158 84 150 100 148 C116 150 124 158 126 168 L140 170 C140 160 134 150 126 146 Z" fill="#4a5742"/>
<path d="M100 150 L100 200" stroke="#1c2316" stroke-width="2.4"/>
<path d="M96 150 L104 150 L104 160 L96 160 Z" fill="#8b9484"/>
<rect x="88" y="118" width="24" height="34" rx="8" fill="#d8ab8e"/>
<ellipse cx="65" cy="94" rx="6" ry="9" fill="#e3b797"/>
<ellipse cx="135" cy="94" rx="6" ry="9" fill="#e3b797"/>
<path d="M66 64 C66 36 134 36 134 64 L134 100 C134 126 118 138 100 138 C82 138 66 126 66 100 Z" fill="#ecc3a6"/>
<path d="M66 64 C66 44 76 38 84 38 C78 48 76 60 76 72 L68 80 C66 76 66 70 66 64 Z" fill="#a8a39c"/>
<path d="M134 64 C134 44 124 38 116 38 C122 48 124 60 124 72 L132 80 C134 76 134 70 134 64 Z" fill="#a8a39c"/>
<path d="M84 38 C90 36 110 36 116 38 C112 42 106 43 100 43 C94 43 88 42 84 38 Z" fill="#b4afa8" opacity="0.55"/>
<path d="M68 80 C66 92 68 104 72 112 C72 102 70 92 72 84 Z M132 80 C134 92 132 104 128 112 C128 102 130 92 128 84 Z" fill="#a8a39c"/>
<path d="M78 112 C84 126 94 132 100 132 C106 132 116 126 122 112 C116 124 108 128 100 128 C92 128 84 124 78 112 Z" fill="#8c7c70" opacity="0.35"/>
<path d="M77 82 C84 78 92 79 96 83" stroke="#4a4038" stroke-width="3.2" fill="none"/>
<path d="M104 83 C108 79 116 78 123 82" stroke="#4a4038" stroke-width="3.2" fill="none"/>
<path d="M80 92 C84 90 90 90 94 92 C90 95 84 95 80 92 Z" fill="#f6f1ec"/>
<path d="M106 92 C110 90 116 90 120 92 C116 95 110 95 106 92 Z" fill="#f6f1ec"/>
<circle cx="87" cy="92.4" r="2.2" fill="#3d3128"/>
<circle cx="113" cy="92.4" r="2.2" fill="#3d3128"/>
<path d="M79 91 C84 89 90 89 95 91 M105 91 C110 89 116 89 121 91" stroke="#4a4038" stroke-width="1.6" fill="none"/>
<path d="M100 94 C97 102 95 108 96 113 C98 115 102 115 104 113" stroke="#c48f6e" stroke-width="2" fill="none"/>
<path d="M90 121 C95 120 105 120 110 121" stroke="#9c5f4e" stroke-width="2.2" fill="none"/>
<path d="M92 104 C96 108 104 108 108 104" stroke="#d9a284" stroke-width="1.2" fill="none" opacity="0.6"/>
</g>
</svg>`;
