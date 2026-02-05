import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { sessionId, runId } = await req.json();
    
    if (!sessionId) {
      throw new Error("sessionId is required");
    }
    
    if (!runId) {
      throw new Error("runId is required");
    }

    logStep("Request data received", { sessionId, runId });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { status: session.payment_status, customerId: session.customer });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Check if entitlement already exists
    const { data: existingEntitlement } = await supabaseClient
      .from("entitlements")
      .select("id")
      .eq("runId", runId)
      .eq("codigoProduto", "RT_DIAG_PREMIUM")
      .maybeSingle();

    if (existingEntitlement) {
      logStep("Entitlement already exists", { entitlementId: existingEntitlement.id });
      return new Response(JSON.stringify({ success: true, alreadyProcessed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create entitlement for the run
    const { data: entitlement, error: entitlementError } = await supabaseClient
      .from("entitlements")
      .insert({
        runId,
        codigoProduto: "RT_DIAG_PREMIUM",
        usuarioId: session.customer as string,
        ativo: true,
      })
      .select()
      .single();

    if (entitlementError) {
      logStep("Error creating entitlement", { error: entitlementError });
      throw new Error(`Failed to create entitlement: ${entitlementError.message}`);
    }

    logStep("Entitlement created", { entitlementId: entitlement.id });

    // Record payment
    const { error: paymentError } = await supabaseClient
      .from("payments")
      .insert({
        runId,
        usuarioId: session.customer as string,
        checkoutSessionId: sessionId,
        paymentIntentId: session.payment_intent as string,
        valorCentavos: session.amount_total || 24700,
        moeda: "BRL",
        provider: "stripe",
        status: "paid",
        pagoEm: new Date().toISOString(),
      });

    if (paymentError) {
      logStep("Error recording payment", { error: paymentError });
      // Don't throw, entitlement was created successfully
    }

    logStep("Payment verified and recorded successfully");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
