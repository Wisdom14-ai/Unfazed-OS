import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const billplzId = url.searchParams.get("billplz[id]");
    const billplzPaid = url.searchParams.get("billplz[paid]");

    const origin = url.origin;

    if (billplzPaid === "true") {
        // Payment successful — redirect to dashboard with success message
        return NextResponse.redirect(
            `${origin}/dashboard?payment=success&bill=${billplzId}`
        );
    } else {
        // Payment failed or cancelled — redirect to pricing with error
        return NextResponse.redirect(
            `${origin}/#pricing?payment=failed`
        );
    }
}
