import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Inject a strict Content-Security-Policy meta tag at build time only.
 * Dev mode is skipped because Vite HMR needs a WebSocket to the dev server
 * and `connect-src 'none'` would break it.
 *
 * The policy locks the page to its own origin for scripts, styles and fonts,
 * blocks every outbound network call (`connect-src 'none'`), and forbids
 * framing, base-URI hijacking, and object embeds. Combined with the
 * no-referrer meta tag, a deployed build cannot exfiltrate the uploaded
 * submission even if a transitive dependency tried to.
 */
function injectProdCsp(): Plugin {
  // Note: `frame-ancestors` is intentionally omitted here — browsers ignore
  // it in a <meta> tag and only honour it as an HTTP response header. The
  // Vercel response headers in `vercel.json` provide it at the edge.
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'none'",
    "form-action 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ');

  return {
    name: 'inject-prod-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        /<head>/,
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), injectProdCsp()],
  build: {
    // Keep every asset (fonts especially) as a separate hashed file instead
    // of inlining small ones as `data:` URIs. This lets the CSP stay strict
    // with `font-src 'self'` — no need to permit `data:` sources.
    assetsInlineLimit: 0,
  },
});
