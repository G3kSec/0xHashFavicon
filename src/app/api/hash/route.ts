import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import murmurhash3 from 'murmurhash3js';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FaviconHasher/1.0)' },
      timeout: 5000,
    });
    const html = response.data;
    const $ = cheerio.load(html);
    let faviconUrl = $('link[rel="shortcut icon"]').attr('href') || $('link[rel="icon"]').attr('href') || '/favicon.ico';
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      const baseUrl = new URL(targetUrl);
      faviconUrl = new URL(faviconUrl, baseUrl.origin).toString();
    }
    const imageResponse = await axios.get(faviconUrl, {
      responseType: 'arraybuffer',
      timeout: 5000,
    });
    const base64 = Buffer.from(imageResponse.data).toString('base64');
    const withNewLines = base64.replace(/(.{76})/g, "$1\n") + "\n";
    const hash = murmurhash3.x86.hash32(withNewLines);
    return NextResponse.json({ 
      hash, 
      faviconUrl,
      shodanQuery: `http.favicon.hash:${hash}` 
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch favicon. Ensure the URL is reachable.' }, 
      { status: 500 }
    );
  }
}