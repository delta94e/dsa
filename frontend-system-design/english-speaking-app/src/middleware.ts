import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================
// SOURCE MAP PROTECTION CONFIGURATION
// ============================================

// Enable strict mode for testing (blocks all requests except secret)
// Set STRICT_SOURCE_MAP_PROTECTION=true to test protection in development
const STRICT_MODE = process.env.STRICT_SOURCE_MAP_PROTECTION === 'true';

// List of allowed IPs for internal access (add your office/VPN IPs)
const ALLOWED_IPS = [
    '127.0.0.1',
    '::1',
    // Add internal IPs here
    // '10.0.0.0/8',
    // '192.168.0.0/16',
];

// Secret token for source map access (set in env)
const SOURCE_MAP_SECRET = process.env.SOURCE_MAP_SECRET;

// Internal domain patterns
const INTERNAL_DOMAINS = [
    'localhost',
    // Add internal domains here
    // 'internal.yourdomain.com',
];

function isInternalRequest(request: NextRequest): boolean {
    console.log("request", request.headers)
    // Method 1: Check for secret header/query param (always allowed)
    const secretHeader = request.headers.get('x-source-map-secret');
    const secretQuery = request.nextUrl.searchParams.get('secret');

    // Debug log
    // console.log(`[DEBUG] Secret header: "${secretHeader}", Expected: "${SOURCE_MAP_SECRET}"`);

    if (SOURCE_MAP_SECRET && (secretHeader === SOURCE_MAP_SECRET || secretQuery === SOURCE_MAP_SECRET)) {
        return true;
    }

    // In STRICT_MODE: Only allow access with correct secret (already checked above)
    // or auth cookie from logged-in users
    if (STRICT_MODE) {
        const authCookie = request.cookies.get('token') || request.cookies.get('session');
        return !!authCookie;
    }

    // Normal mode: Check multiple methods

    // Method 2: Check host header (allows localhost access)
    const host = request.headers.get('host') || '';
    console.log('[DEBUG] Host header:', host);

    // TEMPORARY: Allow all localhost requests for testing
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        return true;
    }

    // Method 3: Check IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || '';

    if (ALLOWED_IPS.some(ip => clientIp.startsWith(ip.replace('/8', '').replace('/16', '')))) {
        return true;
    }

    // Method 4: Check referer/origin for internal domain
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    if (INTERNAL_DOMAINS.some(domain => origin.includes(domain))) {
        return true;
    }

    // Method 4: Check for auth cookie (if using session auth)
    const authCookie = request.cookies.get('token') || request.cookies.get('session');
    if (authCookie) {
        return true;
    }

    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect source map files (.map)
    if (pathname.endsWith('.map')) {
        // Bypass check for internal fetch (prevent infinite loop)
        if (request.headers.get('x-bypass-protection') === 'internal-fetch') {
            return NextResponse.next();
        }

        // Check if request is from internal source
        if (!isInternalRequest(request)) {
            console.log(`[SourceMap Access] BLOCKED: ${pathname}`);

            // Fetch the real source map to get file structure
            try {
                const realMapResponse = await fetch(request.url, {
                    headers: { 'x-bypass-protection': 'internal-fetch' }
                });

                if (realMapResponse.ok) {
                    const realMap = await realMapResponse.json();

                    // Keep file structure but replace content
                    const protectedMap = {
                        version: realMap.version || 3,
                        file: realMap.file,
                        sources: realMap.sources || ['[Protected]'],
                        names: [], // Remove function/variable names
                        mappings: '', // Remove mappings
                        // Replace all source content with access denied message
                        sourcesContent: (realMap.sources || []).map((source: string) =>
                            `// ===============================================\n// Source: ${source}\n// ===============================================\n// \n// ⛔ ACCESS DENIED\n// \n// This source code is protected.\n// Source maps are only available for authorized users.\n// \n// If you need access, please contact the development team.\n// ===============================================\n`
                        )
                    };

                    return new NextResponse(
                        JSON.stringify(protectedMap),
                        {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                }
            } catch (e) {
                // Fallback to simple protected response
            }

            // Fallback: minimal source map
            const emptySourceMap = {
                version: 3,
                sources: ['[Protected Source]'],
                names: [],
                mappings: '',
                sourcesContent: ['// Source maps are protected. Access denied.']
            };

            return new NextResponse(
                JSON.stringify(emptySourceMap),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Internal access allowed - continue to source map
        console.log(`[SourceMap Access] Allowed: ${pathname}`);
        return NextResponse.next();
    }

    // For all other requests, continue normally
    return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        // Match all source map files
        '/(.*)\\.map',
        '/_next/static/:path*.map',
    ],
};
