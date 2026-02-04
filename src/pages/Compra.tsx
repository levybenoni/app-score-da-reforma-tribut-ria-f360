import { Button } from "@/components/ui/button";
import { Check, Shield, FileText, Users, Video, ArrowRight, Lock } from "lucide-react";

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
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full mx-auto animate-fade-in-up">
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-rt-purple text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">
              Diagnóstico Completo + Reunião Estratégica
            </h1>
            <p className="text-white/80 text-sm">
              Tudo que você precisa para se preparar para a Reforma Tributária
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <h2 className="font-semibold text-card-foreground mb-4">
                O que está incluso:
              </h2>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-rt-purple">{benefit.icon}</span>
                    <span className="text-card-foreground">{benefit.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-xl p-6 mb-6 text-center">
              <p className="text-sm text-muted-foreground line-through mb-1">
                De R$ 1.500,00
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Por apenas</span>
                <span className="text-4xl font-bold text-rt-purple">R$ 247</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Valor único • Sem mensalidade
              </p>
            </div>

            {/* Anchor Text */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm text-center">
                💡 Esse tipo de diagnóstico costuma custar entre <strong>R$ 1.500 e R$ 3.000</strong> em projetos tradicionais de consultoria.
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={handlePayment}
              className="w-full bg-rt-purple hover:bg-rt-purple/90 text-white font-semibold text-lg py-6 h-auto rounded-xl group"
            >
              Quero meu diagnóstico completo por R$ 247
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
  );
};

export default Compra;
