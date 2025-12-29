// Security headers configuration for production deployment
// Add these headers to your hosting platform (Vercel, Netlify, etc.)

export const securityHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
    },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.supabase.co https://api.paystack.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ')
    }
];

// For Vercel: Add to vercel.json
export const vercelConfig = {
    headers: [
        {
            source: '/(.*)',
            headers: securityHeaders
        }
    ]
};

// For Netlify: Add to netlify.toml
export const netlifyConfig = `
[[headers]]
  for = "/*"
  ${securityHeaders.map(h => `[headers.values]\n    ${h.key} = "${h.value}"`).join('\n  ')}
`;
