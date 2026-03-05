import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Billplz X-Signature key for verifying callbacks
const BILLPLZ_X_SIGNATURE_KEY = process.env.BILLPLZ_X_SIGNATURE_KEY || "your-x-signature-key";

// Supabase service role client for server-side operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const billId = formData.get("id") as string;
        const paid = formData.get("paid") as string;
        const paidAt = formData.get("paid_at") as string;
        const userId = formData.get("reference_1") as string;
        const plan = formData.get("reference_2") as string;
        const xSignature = formData.get("x_signature") as string;

        console.log("Billplz callback received:", {
            billId,
            paid,
            paidAt,
            userId,
            plan,
            hasSignature: !!xSignature,
        });

        // TODO: Verify X-Signature in production
        // For now, log the signature key for reference
        console.log("X-Signature key configured:", !!BILLPLZ_X_SIGNATURE_KEY);

        if (paid === "true" && userId && plan) {
            // Calculate subscription end date
            let endsAt: string | null = null;
            const now = new Date();

            if (plan === "monthly") {
                const end = new Date(now);
                end.setMonth(end.getMonth() + 1);
                endsAt = end.toISOString();
            } else if (plan === "yearly") {
                const end = new Date(now);
                end.setFullYear(end.getFullYear() + 1);
                endsAt = end.toISOString();
            }
            // lifetime = null (never expires)

            // Upsert subscription
            const { error } = await supabaseAdmin
                .from("subscriptions")
                .upsert(
                    {
                        user_id: userId,
                        plan,
                        status: "active",
                        billplz_bill_id: billId,
                        starts_at: now.toISOString(),
                        ends_at: endsAt,
                    },
                    { onConflict: "user_id" }
                );

            if (error) {
                console.error("Subscription upsert error:", error);
            } else {
                console.log(`Subscription activated: ${plan} for user ${userId}`);
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Callback error:", error);
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}
