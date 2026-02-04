import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/hooks/useDiagnostic";
import { useToast } from "@/hooks/use-toast";

const loadingTexts = [
  "Analisando riscos ocultos de margem…",
  "Avaliando impacto no caixa…",
  "Cruzando preço, crédito e contratos…",
  "Mapeando vulnerabilidades estratégicas…",
];

const Loading = () => {
  const navigate = useNavigate();
  const { finalizeDiagnostic, callWebhook, publicToken } = useDiagnostic();
  const { toast } = useToast();
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  // Text rotation
  useEffect(() => {
    const textInterval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
        setIsExiting(false);
      }, 300);
    }, 2000);

    return () => clearInterval(textInterval);
  }, []);

  // Main process: finalize + webhook
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const processDiagnostic = async () => {
      try {
        // Check if we have a valid run
        if (!publicToken) {
          throw new Error('Nenhum diagnóstico em andamento');
        }

        // Step 1: Finalize diagnostic (calculate scores)
        console.log('Finalizing diagnostic...');
        const finalizeResult = await finalizeDiagnostic();
        console.log('Finalize result:', finalizeResult);

        // Step 2: Call external webhook to generate AI report
        console.log('Calling webhook...');
        try {
          await callWebhook();
          console.log('Webhook completed');
        } catch (webhookError) {
          // Webhook may fail, but we can still show results
          console.warn('Webhook error (non-critical):', webhookError);
        }

        // Step 3: Navigate to results
        navigate("/resultado");

      } catch (err) {
        console.error('Error processing diagnostic:', err);
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        
        toast({
          title: "Erro no processamento",
          description: message,
          variant: "destructive",
        });

        // Navigate to results anyway after delay (may show partial data)
        setTimeout(() => {
          navigate("/resultado");
        }, 3000);
      }
    };

    processDiagnostic();
  }, [finalizeDiagnostic, callWebhook, navigate, publicToken, toast]);

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Rotating gradient rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-15">
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-rotate-slow" />
          <div className="absolute inset-12 rounded-full border border-white/20 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
          <div className="absolute inset-24 rounded-full border border-white/10 animate-rotate-slow" style={{ animationDuration: '15s' }} />
        </div>
        
        {/* Floating orbs */}
        <div className="floating-orb floating-orb-1 animate-pulse-soft" />
        <div className="floating-orb floating-orb-2 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-md w-full mx-auto text-center relative z-10">
        {/* BWA Global Logo */}
        <div className="mb-12 animate-fade-in-up">
          <img 
            src="https://ik.imagekit.io/y082km6do/logobranca.png?updatedAt=1761932188284" 
            alt="BWA Global" 
            className="h-12 mx-auto opacity-90"
          />
        </div>

        {/* Elegant circular loader */}
        <div className="mb-12 animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          <div className="relative w-28 h-28 mx-auto">
            {/* Outer static ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            
            {/* Animated spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/80 border-r-white/40 animate-spin" style={{ animationDuration: '1.5s' }} />
            
            {/* Inner glow */}
            <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-sm" />
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/60 animate-pulse-soft" />
            </div>
          </div>
        </div>

        {/* Single status text with fade transition */}
        <div className="h-20 flex items-center justify-center mb-8">
          {error ? (
            <p className="text-xl md:text-2xl font-medium text-red-300">
              {error}
            </p>
          ) : (
            <p 
              className={`text-xl md:text-2xl font-medium text-white transition-all duration-300 ${
                isExiting ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
              }`}
            >
              {loadingTexts[currentTextIndex]}
            </p>
          )}
        </div>

        {/* Subtle subtitle */}
        <p className="text-white/50 text-sm animate-pulse-soft">
          {error ? "Redirecionando..." : "Isso leva apenas alguns segundos."}
        </p>
      </div>
    </div>
  );
};

export default Loading;
