import { Button } from "@/components/ui/button";
import { Check, Shield, FileText, Users, Video, ArrowRight, Lock, Sparkles, Star } from "lucide-react";

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
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="max-w-lg w-full mx-auto relative z-10">
        {/* Header badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm">
            <Star className="w-4 h-4" />
            <span>Oferta especial</span>
          </div>
        </div>

        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          {/* Premium Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rt-purple to-rt-dark-blue" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
            <div className="relative p-8 text-center text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Premium</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                Diagnóstico Completo + Reunião Estratégica
              </h1>
              <p className="text-white/80">
                Tudo que você precisa para se preparar para a Reforma Tributária
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            {/* Benefits */}
            <div className="space-y-4 mb-10">
              <h2 className="font-semibold text-card-foreground mb-5 text-lg flex items-center gap-2">
                <Check className="w-5 h-5 text-rt-purple" />
                O que está incluso:
              </h2>
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up"
                  style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-rt-purple">{benefit.icon}</span>
                    <span className="text-card-foreground font-medium">{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="relative mb-8 animate-fade-in-up delay-600" style={{ animationFillMode: 'backwards' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rt-purple/5 to-rt-dark-blue/5 rounded-3xl" />
              <div className="relative score-display rounded-3xl p-8 text-center">
                <p className="text-sm text-muted-foreground line-through mb-2">
                  De R$ 1.500,00
                </p>
                <div className="flex items-baseline justify-center gap-3 mb-3">
                  <span className="text-sm text-muted-foreground">Por apenas</span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-rt-purple to-rt-dark-blue bg-clip-text text-transparent">
                    R$ 247
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Valor único • Sem mensalidade
                </p>
              </div>
            </div>

            {/* Anchor Text */}
            <div className="relative mb-8 animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5">
                <p className="text-amber-800 text-center">
                  💡 Esse tipo de diagnóstico costuma custar entre <strong>R$ 1.500 e R$ 3.000</strong> em projetos tradicionais de consultoria.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
              <Button
                onClick={handlePayment}
                className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Quero meu diagnóstico completo por R$ 247
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm">
                <Lock className="w-4 h-4" />
                <span>Pagamento 100% seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compra;
