import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { headers } from "next/headers";
import { auth } from './lib/auth';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
   
const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})
    const user = session?.user
    if(!user){
          return NextResponse.redirect(new URL('/signin', request.url))
    }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ['/create-events'],
}