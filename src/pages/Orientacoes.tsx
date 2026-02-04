import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { useDiagnostic } from "@/hooks/useDiagnostic";
import { useToast } from "@/hooks/use-toast";

const Orientacoes = () => {
  const navigate = useNavigate();
  const { createRun, publicToken } = useDiagnostic();
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    
    try {
      // Check if we already have a run in progress
      if (publicToken) {
        // Already have a run, just navigate
        navigate("/questionario/1");
        return;
      }

      // Create new run
      await createRun();
      navigate("/questionario/1");
    } catch (error) {
      console.error('Error creating diagnostic run:', error);
      toast({
        title: "Erro ao iniciar",
        description: "Não foi possível iniciar o diagnóstico. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="max-w-2xl w-full mx-auto relative z-10">
        {/* Header badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Instruções importantes</span>
          </div>
        </div>

        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          {/* Gradient header accent */}
          <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue" />

          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4 text-center animate-text-reveal delay-200" style={{ animationFillMode: 'backwards' }}>
              Como responder este diagnóstico
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-center mb-10 leading-relaxed text-lg max-w-xl mx-auto animate-text-reveal delay-300" style={{ animationFillMode: 'backwards' }}>
              Este questionário avalia o nível de maturidade da gestão da sua empresa frente à Reforma Tributária — e não o trabalho da contabilidade.
            </p>

            {/* Cards grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* SIM block */}
              <div className="relative group animate-fade-in-up delay-400" style={{ animationFillMode: 'backwards' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-green-300/50 group-hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="font-semibold text-green-800 text-lg">Marque SIM apenas se você:</h2>
                  </div>
                  <ul className="space-y-3 text-green-700">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span>Entende o assunto</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span>Sabe onde a informação está</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span>Já usou isso para decidir preço, compra ou estratégia</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* NÃO block */}
              <div className="relative group animate-fade-in-up delay-500" style={{ animationFillMode: 'backwards' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/50 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-red-300/50 group-hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="font-semibold text-red-800 text-lg">Marque NÃO se:</h2>
                  </div>
                  <ul className="space-y-3 text-red-700">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span>Depende exclusivamente da contabilidade</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span>Não tem clareza sobre o tema</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span>Nunca usou essa informação para decidir</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="relative group animate-fade-in-up delay-600" style={{ animationFillMode: 'backwards' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300/50 rounded-2xl p-6 mb-10 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800 mb-2 text-lg">
                      Não existem respostas certas ou erradas.
                    </p>
                    <p className="text-amber-700">
                      Respostas otimistas apenas mascaram riscos que a Reforma Tributária tende a expor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
              <Button 
                onClick={handleStart}
                disabled={isStarting}
                className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isStarting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    <>
                      Começar diagnóstico
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orientacoes;
