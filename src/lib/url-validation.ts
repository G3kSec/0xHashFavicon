import { isIP } from 'net';

const PRIVATE_RANGES = [
  { prefix: '10.', mask: null },
  { prefix: '172.', mask: (ip: string) => { const b = parseInt(ip.split('.')[1]); return b >= 16 && b <= 31; } },
  { prefix: '192.168.', mask: null },
  { prefix: '127.', mask: null },
  { prefix: '0.', mask: null },
  { prefix: '169.254.', mask: null },
  { prefix: '100.64.', mask: (ip: string) => { const b = parseInt(ip.split('.')[1]); return b >= 64 && b <= 127; } },
];

function isPrivateIPv4(ip: string): boolean {
  for (const range of PRIVATE_RANGES) {
    if (ip.startsWith(range.prefix)) {
      return range.mask ? range.mask(ip) : true;
    }
  }
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
  if (lower.startsWith('fe80')) return true;
  if (lower.startsWith('::ffff:')) {
    const v4 = lower.slice(7);
    if (isIP(v4) === 4) return isPrivateIPv4(v4);
  }
  return false;
}

export function isPrivateUrl(parsed: URL): boolean {
  const hostname = parsed.hostname.replace(/^\[|\]$/g, '');

  if (hostname === 'localhost' || hostname.endsWith('.localhost')) return true;
  if (hostname.endsWith('.local') || hostname.endsWith('.internal')) return true;

  if (isIP(hostname) === 4) return isPrivateIPv4(hostname);
  if (isIP(hostname) === 6) return isPrivateIPv6(hostname);

  return false;
}
