import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; 

const EXTERNAL_API_URL = "https://nezuko0hr.alwaysdata.net/api";

async function handleRequest(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const rawPath = resolvedParams?.path;
    const pathArray = Array.isArray(rawPath) ? rawPath : (rawPath ? [rawPath] : []);
    const path = pathArray.join("/");
    
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    const searchParams = req.nextUrl.searchParams.toString();
    const url = `${EXTERNAL_API_URL}/${cleanPath}${searchParams ? `?${searchParams}` : ""}`;
    
    const cookieStore = await cookies();
    const jobsToken = cookieStore.get("jobs_token")?.value;
    const locale = req.headers.get("accept-language") || "en";

    if (cleanPath === "check-auth") {
      return NextResponse.json({ isAuthenticated: !!jobsToken }, { status: 200 });
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept-Language": locale,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };

    if (jobsToken) {
      headers["Authorization"] = `Bearer ${jobsToken}`;
    }

    const options: RequestInit = {
      method: req.method,
      headers,
      cache: "no-store", 
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      try {
        const rawBody = await req.text();
        if (rawBody) {
          options.body = rawBody;
        }
      } catch (e) {}
    }

    const response = await fetch(url, options);
    
    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
       data = await response.json().catch(() => null);
    } else {
       data = { text: await response.text().catch(() => "") };
    }

    const actualToken = data?.token || data?.data?.token;
    
    if (cleanPath === "auth/login" && response.ok && actualToken) {
      const res = NextResponse.json(data, { status: 200 });
      res.cookies.set({
        name: "jobs_token",
        value: actualToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ 
      message: "Proxy Connection Error", 
      errorDetails: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;