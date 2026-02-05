import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const runId = searchParams.get("run_id");

      if (!sessionId || !runId) {
        setStatus("error");
        setError("Parâmetros inválidos");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId, runId },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data?.success) {
          setStatus("success");
          // Redirect to resultado after 2 seconds
          setTimeout(() => {
            navigate("/resultado");
          }, 2000);
        } else {
          throw new Error("Falha na verificação do pagamento");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="glass-card-floating rounded-3xl p-8 max-w-md w-full text-center relative z-10">
        {status === "verifying" && (
          <>
            <Loader2 className="w-16 h-16 text-rt-purple animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Processando pagamento...
            </h1>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos seu pagamento.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Pagamento confirmado!
            </h1>
            <p className="text-muted-foreground mb-4">
              Seu diagnóstico completo está sendo liberado.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecionando para seu resultado...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Erro no processamento
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "Ocorreu um erro ao verificar seu pagamento."}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/resultado")}
                className="w-full bg-rt-purple hover:bg-rt-purple/90"
              >
                Ver resultado mesmo assim
              </Button>
              <Button
                onClick={() => navigate("/compra")}
                variant="outline"
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
