import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, FileSearch, ClipboardCheck, TrendingUp, Target, FileDown, Users, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Compra = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to criar conta with return intent
        localStorage.setItem('rt-checkout-intent', 'true');
        navigate('/criar-conta');
        return;
      }

      // Check if complementary data exists
      const complementaryData = localStorage.getItem('rt-complementary-data');
      if (!complementaryData) {
        localStorage.setItem('rt-checkout-intent', 'true');
        navigate('/dados-complementares');
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !isCheckingAuth) {
        navigate('/criar-conta');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const benefits = [
    {
      icon: <FileSearch className="w-5 h-5" />,
      text: "Análise detalhada de cada área de risco",
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      text: "Plano de ação personalizado",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Simulação de impacto financeiro",
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "Recomendações estratégicas específicas",
    },
    {
      icon: <FileDown className="w-5 h-5" />,
      text: "Relatório exportado em PDF",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Reunião estratégica de 30 min com especialista",
    },
  ];

  const handlePayment = async () => {
    const runId = localStorage.getItem('diagnosticRunId');
    
    if (!runId) {
      toast.error("Diagnóstico não encontrado. Por favor, complete o questionário primeiro.");
      navigate('/');
      return;
    }

    setIsLoading(true);

    try {
      // Get current authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("Você precisa estar logado para continuar.");
        navigate('/criar-conta');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          runId,
          customerEmail: session.user.email,
          customerName: session.user.user_metadata?.nome || session.user.email?.split('@')[0],
          userId: session.user.id, // Pass the Supabase user ID
        },
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error('Erro ao iniciar o pagamento. Tente novamente.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Erro ao processar o pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-rt-gradient flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="w-full max-w-4xl mx-auto relative z-10">
        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up" style={{ animationFillMode: 'backwards' }}>
          <div className="p-8 lg:p-10">
            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Left Column - Content */}
              <div className="lg:col-span-3">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rt-purple/10 text-rt-purple text-sm font-medium mb-6">
                  <Lock className="w-4 h-4" />
                  <span>Acesso Completo</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4 leading-tight">
                  Diagnóstico<br />
                  Estratégico Completo
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Aprofunde a análise e prepare sua empresa para a Reforma Tributária com clareza e segurança. Não deixe margem para riscos ocultos.
                </p>

                {/* Benefits list */}
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rt-dark-blue/10 flex items-center justify-center flex-shrink-0 text-rt-dark-blue">
                        {benefit.icon}
                      </div>
                      <span className="text-card-foreground font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Price Card */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  {/* Exclusive offer badge */}
                  <div className="flex justify-center mb-4">
                    <span className="px-4 py-1.5 rounded-full bg-rt-dark-blue text-white text-xs font-bold uppercase tracking-wider">
                      Oferta Exclusiva
                    </span>
                  </div>

                  {/* Price label */}
                  <p className="text-center text-muted-foreground text-sm mb-2">
                    Investimento único
                  </p>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <span className="text-muted-foreground text-lg">R$</span>
                    <span className="text-5xl font-bold text-card-foreground">247</span>
                    <span className="text-muted-foreground text-lg">,00</span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-rt-dark-blue hover:bg-rt-dark-blue/90 text-white font-semibold text-base py-6 h-auto rounded-xl group"
                  >
                    <span className="flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          Desbloquear Agora
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>

                  {/* Security text */}
                  <p className="text-center text-muted-foreground text-xs mt-4 leading-relaxed">
                    Ambiente seguro via Stripe.<br />
                    Acesso imediato ao relatório.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compra;
