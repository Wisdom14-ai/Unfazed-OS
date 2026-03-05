import { NextResponse } from "next/server";

// Billplz API Configuration (Placeholder — replace with real keys)
const BILLPLZ_API_KEY = process.env.BILLPLZ_API_KEY || "your-billplz-api-key";
const BILLPLZ_COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID || "your-collection-id";
const BILLPLZ_API_URL = process.env.BILLPLZ_SANDBOX === "true"
    ? "https://www.billplz-sandbox.com/api/v3"
    : "https://www.billplz.com/api/v3";

const PLAN_PRICES: Record<string, number> = {
    monthly: 3000,   // RM 30.00 in cents
    yearly: 30000,   // RM 300.00 in cents
    lifetime: 50000, // RM 500.00 in cents
};

const PLAN_DESCRIPTIONS: Record<string, string> = {
    monthly: "Unfazed OS — Monthly Subscription (RM 30/mo)",
    yearly: "Unfazed OS — Yearly Subscription (RM 300/yr)",
    lifetime: "Unfazed OS — Lifetime Access (RM 500 one-time)",
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { plan, email, name, userId } = body;

        if (!plan || !email || !name) {
            return NextResponse.json(
                { error: "Missing required fields: plan, email, name" },
                { status: 400 }
            );
        }

        if (!PLAN_PRICES[plan]) {
            return NextResponse.json(
                { error: "Invalid plan. Choose: monthly, yearly, or lifetime" },
                { status: 400 }
            );
        }

        const origin = request.headers.get("origin") || "https://unfazed-os.vercel.app";

        // Create a Billplz bill
        const billResponse = await fetch(`${BILLPLZ_API_URL}/bills`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(BILLPLZ_API_KEY + ":").toString("base64")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collection_id: BILLPLZ_COLLECTION_ID,
                email,
                name,
                amount: PLAN_PRICES[plan],
                description: PLAN_DESCRIPTIONS[plan],
                callback_url: `${origin}/api/payments/callback`,
                redirect_url: `${origin}/api/payments/redirect`,
                reference_1_label: "User ID",
                reference_1: userId || "",
                reference_2_label: "Plan",
                reference_2: plan,
            }),
        });

        if (!billResponse.ok) {
            const errorText = await billResponse.text();
            console.error("Billplz API error:", errorText);
            return NextResponse.json(
                { error: "Failed to create payment bill" },
                { status: 500 }
            );
        }

        const bill = await billResponse.json();

        return NextResponse.json({
            url: bill.url,
            billId: bill.id,
        });
    } catch (error) {
        console.error("Create bill error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
