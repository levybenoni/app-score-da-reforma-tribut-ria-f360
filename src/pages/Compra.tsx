import { Button } from "@/components/ui/button";
import { Check, Shield, FileText, Users, Video, ArrowRight, Lock, Sparkles } from "lucide-react";

const Compra = () => {
  const benefits = [
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Diagnóstico detalhado por área",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Principais riscos explicados em linguagem de negócio",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Plano de ação priorizado",
    },
    {
      icon: <Video className="w-5 h-5" />,
      text: "Reunião online com especialista",
    },
  ];

  const handlePayment = () => {
    // In production, this would redirect to a payment gateway
    alert("Redirecionando para gateway de pagamento...");
  };

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="w-full max-w-xl mx-auto relative z-10">
        {/* Header badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Oferta exclusiva</span>
          </div>
        </div>

        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          {/* Premium Header with gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rt-purple via-rt-purple/90 to-rt-dark-blue" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(91,192,205,0.2)_0%,_transparent_50%)]" />
            <div className="relative p-8 text-center text-white">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Diagnóstico Completo
              </h1>
              <p className="text-white/80 text-sm">
                + Reunião Estratégica com Especialista
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            {/* Benefits */}
            <div className="space-y-3 mb-8">
              <h2 className="font-semibold text-card-foreground mb-4 text-base">
                O que está incluso:
              </h2>
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/80 to-white/60 border border-rt-purple/10 transition-all duration-300 hover:border-rt-purple/20"
                  style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-rt-purple/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-rt-purple" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-rt-purple">{benefit.icon}</span>
                    <span className="text-card-foreground font-medium text-sm">{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing - Premium styled */}
            <div className="relative mb-8">
              <div className="score-display rounded-2xl p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                  Valor único
                </p>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-medium text-muted-foreground">R$</span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-rt-purple to-rt-dark-blue bg-clip-text text-transparent">
                    247
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Pagamento único • Sem mensalidade
                </p>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Button
                onClick={handlePayment}
                className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Prosseguir para pagamento
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-5 text-muted-foreground text-sm">
                <Lock className="w-4 h-4" />
                <span>Pagamento 100% seguro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust elements below card */}
        <div className="mt-6 text-center animate-fade-in-up delay-300" style={{ animationFillMode: 'backwards' }}>
          <img 
            src="https://ik.imagekit.io/y082km6do/logobrancaW.png?updatedAt=1761932134888" 
            alt="BWA Global" 
            className="h-8 mx-auto opacity-70"
          />
        </div>
      </div>
    </div>
  );
};

export default Compra;
