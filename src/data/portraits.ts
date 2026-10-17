// Vector portraits for mathematicians working today, drawn in the app's own
// style so they sit beside the emoji icons of the historical figures without a
// photograph. Each is a self-contained SVG string on a 200 × 200 canvas.

/**
 * Dr. Adam Wolfe, drawn as a Sunday-cartoon character after his photo: a
 * narrow face under a high, mostly bare crown with thin, wispy salt-and-pepper hair, big round eyes looking
 * straight ahead, a long nose and a wide smile, clean-shaven, in a scarlet Ohio
 * State sweater, with the Man burning on the playa behind him.
 */
export const WOLFE_PORTRAIT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Cartoon portrait of Dr. Adam Wolfe in an Ohio State sweater at Burning Man">
<defs>
<linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd48a"/><stop offset="0.6" stop-color="#f08a63"/><stop offset="1" stop-color="#b85f84"/></linearGradient>
<linearGradient id="wp-playa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ead8b1"/><stop offset="1" stop-color="#cdb388"/></linearGradient>
<radialGradient id="wp-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffb347" stop-opacity="0.75"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
<clipPath id="wp-clip"><rect width="200" height="200"/></clipPath>
</defs>
<g clip-path="url(#wp-clip)">
<rect width="200" height="200" fill="url(#wp-sky)"/>
<path d="M-5 112 L30 98 L62 108 L96 94 L128 106 L160 92 L196 104 L210 98 L210 122 L-5 122 Z" fill="#8c6a8f"/>
<rect x="-5" y="118" width="215" height="90" fill="url(#wp-playa)"/>
<path d="M-5 150 L210 146 L210 152 L-5 156 Z" fill="#c4aa80" opacity="0.6"/>
<path d="M22 122 L30 110 L38 122 Z M44 122 L50 113 L56 122 Z" fill="#d9a06b"/>
<circle cx="165" cy="96" r="42" fill="url(#wp-glow)"/>
<path d="M141 122 C146 104 150 100 152 86 C156 100 160 94 160 106 C164 92 170 98 170 84 C176 102 182 108 189 122 Z" fill="#ff7a1a"/>
<path d="M150 122 C152 110 155 106 157 98 C159 108 162 104 162 112 C164 104 168 108 169 100 C172 110 176 114 180 122 Z" fill="#ffd23f"/>
<path d="M139 124 L147 102 L183 102 L191 124 Z" fill="#6b4a2a"/>
<g stroke="#ff9a3c" stroke-width="2.6" fill="none">
<path d="M165 60 L165 82 M165 66 L152 48 M165 66 L178 48 M165 82 L158 102 M165 82 L172 102"/>
</g>
<circle cx="165" cy="54" r="5.5" fill="none" stroke="#ff9a3c" stroke-width="2.6"/>
<path d="M24 200 C28 168 50 150 76 146 L124 146 C150 150 172 168 176 200 Z" fill="#bb0000"/>
<path d="M76 146 C84 158 116 158 124 146 L119 151 C112 161 88 161 81 151 Z" fill="#c9c9c9"/>
<path d="M36 200 C38 182 44 170 52 160 L60 166 C52 176 48 188 46 200 Z M164 200 C162 182 156 170 148 160 L140 166 C148 176 152 188 154 200 Z" fill="#a30000" opacity="0.6"/>
<text x="100" y="188" font-family="ui-rounded, system-ui, -apple-system, sans-serif" font-weight="800" font-size="11.5" fill="#e8e8e8" text-anchor="middle" letter-spacing="0.5">OHIO STATE</text>
<rect x="89" y="126" width="22" height="28" rx="8" fill="#d9a77f"/>
<ellipse cx="70" cy="94" rx="5.5" ry="8.5" fill="#e4b78f"/>
<ellipse cx="130" cy="94" rx="5.5" ry="8.5" fill="#e4b78f"/>
<path d="M72 78 C71 30 129 30 128 78 L128 112 C128 134 115 146 100 146 C85 146 72 134 72 112 Z" fill="#ecc39c"/>
<path d="M74 112 C75 133 87 145 100 145 C113 145 125 133 126 112 C120 121 110 119 100 121 C90 119 80 121 74 112 Z" fill="#8f9096" opacity="0.14"/>
<ellipse cx="94" cy="50" rx="12" ry="5" fill="#ffffff" opacity="0.28"/>
<path d="M72 84 C71 64 76 50 86 44 C80 54 77 66 77 80 Z M128 84 C129 64 124 50 114 44 C120 54 123 66 123 80 Z" fill="#8a8a8e" opacity="0.55"/>
<path d="M78 58 C86 44 106 38 122 50 C108 44 90 46 78 58 Z" fill="#9a9a9e" opacity="0.3"/>
<g stroke-linecap="round" fill="none">
<path d="M80 54 C88 44 102 40 116 44 M86 48 C94 42 108 40 120 47 M76 64 C77 56 80 50 85 46" stroke="#55555a" stroke-width="0.9" opacity="0.8"/>
<path d="M83 51 C91 43 104 41 118 45 M92 45 C100 41 110 41 121 49 M124 64 C123 56 120 50 115 46" stroke="#d8d8db" stroke-width="0.9" opacity="0.9"/>
<path d="M73 70 L74 82 M127 70 L126 82 M75 66 L76 78 M125 66 L124 78" stroke="#bdbdc0" stroke-width="1"/>
</g>
<path d="M78 76 C83 70 91 70 97 74" stroke="#4a4a4d" stroke-width="3.2" stroke-linecap="round" fill="none"/>
<path d="M103 74 C109 70 117 70 122 76" stroke="#4a4a4d" stroke-width="3.2" stroke-linecap="round" fill="none"/>
<circle cx="88" cy="90" r="10.5" fill="#ffffff" stroke="#3a3a3c" stroke-width="1.4"/>
<circle cx="112" cy="90" r="10.5" fill="#ffffff" stroke="#3a3a3c" stroke-width="1.4"/>
<circle cx="88.5" cy="91" r="2.8" fill="#2a2420"/>
<circle cx="111.5" cy="91" r="2.8" fill="#2a2420"/>
<circle cx="89.4" cy="90" r="0.9" fill="#ffffff"/>
<circle cx="112.4" cy="90" r="0.9" fill="#ffffff"/>
<path d="M78.6 85 A10.5 10.5 0 0 1 97.4 85 Z M102.6 85 A10.5 10.5 0 0 1 121.4 85 Z" fill="#ecc39c"/>
<path d="M78.6 85 C84 83.6 92 83.6 97.4 85 M102.6 85 C108 83.6 116 83.6 121.4 85" stroke="#3a3a3c" stroke-width="1.5" fill="none"/>
<path d="M80 102 C84 104 90 104 94 102 M106 102 C110 104 116 104 120 102" stroke="#c99a76" stroke-width="1.3" fill="none"/>
<path d="M100 88 C104 98 109 106 108 113 C107 117 101 118 97 115" stroke="#b9805c" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M86 123 C93 135 107 135 114 123 C107 126 93 126 86 123 Z" fill="#7a3b33"/>
<path d="M88.5 124.2 C95 126 105 126 111.5 124.2 L110.5 126.6 C104 128 96 128 89.5 126.6 Z" fill="#ffffff"/>
<path d="M83 121 C84.5 122.5 85.5 124 86 125.5 M117 121 C115.5 122.5 114.5 124 114 125.5" stroke="#b9805c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<circle cx="80" cy="114" r="5" fill="#f0a08a" opacity="0.35"/>
<circle cx="120" cy="114" r="5" fill="#f0a08a" opacity="0.35"/>
</g>
</svg>`;
