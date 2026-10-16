// Vector portraits for mathematicians working today, drawn in the app's own
// style so they sit beside the emoji icons of the historical figures without a
// photograph. Each is a self-contained SVG string on a 200 × 200 canvas.

/**
 * Dr. Adam Wolfe, drawn as a Sunday-cartoon character after his photo: big
 * round eyes under heavy lids, a long straight nose, dark brows, clean-shaven,
 * close-cropped salt-and-pepper hair with the temples just starting to recede,
 * in a scarlet Ohio State sweater, with the Man burning on the playa behind him.
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
<rect x="88" y="124" width="24" height="30" rx="8" fill="#d9a77f"/>
<ellipse cx="65" cy="92" rx="6.5" ry="9" fill="#e4b78f"/>
<ellipse cx="135" cy="92" rx="6.5" ry="9" fill="#e4b78f"/>
<path d="M66 72 C66 42 134 42 134 72 L134 108 C134 130 118 142 100 142 C82 142 66 130 66 108 Z" fill="#ecc39c"/>
<path d="M67 68 C68 46 84 36 100 36 C116 36 132 46 133 68 C128 58 118 54 100 54 C82 54 72 58 67 68 Z" fill="#3a3a3c"/>
<path d="M67 68 L66 98 C68 92 70 80 71 72 Z M133 68 L134 98 C132 92 130 80 129 72 Z" fill="#3a3a3c"/>
<path d="M73 56 C77 49 84 46 90 45 C84 50 80 56 78 63 Z M127 56 C123 49 116 46 110 45 C116 50 120 56 122 63 Z" fill="#ecc39c"/>
<g stroke="#b9b9bb" stroke-width="1.6" stroke-linecap="round" fill="none">
<path d="M80 50 L83 49 M92 44 L95 44 M104 43 L107 43 M114 47 L117 48 M86 46 L88 46 M110 45 L112 45 M74 60 L75 63 M125 60 L124 63 M68 80 L68 84 M132 80 L132 84"/>
</g>
<circle cx="88" cy="88" r="11" fill="#ffffff" stroke="#3a3a3c" stroke-width="1.4"/>
<circle cx="112" cy="88" r="11" fill="#ffffff" stroke="#3a3a3c" stroke-width="1.4"/>
<circle cx="90.5" cy="90" r="2.4" fill="#2a2420"/>
<circle cx="109.5" cy="90" r="2.4" fill="#2a2420"/>
<path d="M77.4 84 A11 11 0 0 1 98.6 84 Z" fill="#ecc39c"/>
<path d="M101.4 84 A11 11 0 0 1 122.6 84 Z" fill="#ecc39c"/>
<path d="M77.4 84 L98.6 84 M101.4 84 L122.6 84" stroke="#3a3a3c" stroke-width="1.6"/>
<path d="M77 73 C83 69 91 70 97 75" stroke="#2a2420" stroke-width="3.4" fill="none"/>
<path d="M103 75 C109 70 117 69 123 73" stroke="#2a2420" stroke-width="3.4" fill="none"/>
<path d="M100 82 C104 92 109 100 108 108 C107 112 101 113 98 110" stroke="#b9805c" stroke-width="2" fill="none"/>
<path d="M90 124 C95 122 105 122 110 124" stroke="#9c5f4e" stroke-width="2.2" fill="none"/>
</g>
</svg>`;
