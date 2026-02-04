import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, TrendingDown, FileWarning, Scale, Sparkles } from "lucide-react";

const Resultado = () => {
  const navigate = useNavigate();

  // Mock result - in production this would come from calculation
  const maturityLevel = "intermediaria"; // baixa | intermediaria | alta
  const score = 45; // 0-100

  const maturityConfig = {
    baixa: {
      label: "Baixa",
      color: "text-red-500",
      bgGradient: "from-red-500/20 to-red-600/10",
      borderColor: "border-red-500/30",
      glowColor: "shadow-red-500/20",
    },
    intermediaria: {
      label: "Intermediária",
      color: "text-amber-500",
      bgGradient: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
      glowColor: "shadow-amber-500/20",
    },
    alta: {
      label: "Alta",
      color: "text-emerald-500",
      bgGradient: "from-emerald-500/20 to-green-500/10",
      borderColor: "border-emerald-500/30",
      glowColor: "shadow-emerald-500/20",
    },
  };

  const config = maturityConfig[maturityLevel];

  const alerts = [
    {
      icon: <TrendingDown className="w-5 h-5" />,
      title: "Formação de preço vulnerável",
      description: "Risco de não conseguir repassar o novo IVA aos clientes",
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Risco de absorção de tributos",
      description: "Margem pode ser comprometida durante a transição",
    },
    {
      icon: <FileWarning className="w-5 h-5" />,
      title: "Fragilidade em contratos",
      description: "Contratos podem impedir revisão de preços",
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Gap de gestão identificado",
      description: "Decisões baseadas em informações incompletas",
    },
  ];

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
            <span>Diagnóstico concluído</span>
          </div>
        </div>

        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          {/* Gradient header accent */}
          <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue" />

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-3 animate-text-reveal delay-200" style={{ animationFillMode: 'backwards' }}>
                Seu Diagnóstico de Maturidade está pronto
              </h1>
              <p className="text-muted-foreground text-lg animate-text-reveal delay-300" style={{ animationFillMode: 'backwards' }}>
                Este é um resumo executivo do nível de preparo da sua empresa para a Reforma Tributária.
              </p>
            </div>

            {/* Score Display */}
            <div className={`score-display rounded-3xl p-8 mb-10 text-center animate-scale-bounce delay-400`} style={{ animationFillMode: 'backwards' }}>
              <div className="relative">
                {/* Score ring */}
                <div className="w-40 h-40 mx-auto mb-6 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(117, 76, 153, 0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${score * 2.64} 264`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#754c99" />
                        <stop offset="100%" stopColor="#5bc0cd" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-card-foreground">{score}%</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Nível de maturidade
                </p>
                <h2 className={`text-4xl font-bold ${config.color}`}>
                  {config.label}
                </h2>
              </div>
            </div>

            {/* Main Message */}
            <div className="relative mb-10 animate-fade-in-up delay-500" style={{ animationFillMode: 'backwards' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rt-purple/5 to-rt-dark-blue/5 rounded-2xl" />
              <div className="relative glass-card rounded-2xl p-6 md:p-8 border border-rt-purple/10">
                <p className="text-card-foreground leading-relaxed text-lg">
                  Sua empresa apresenta <strong className="text-rt-purple">riscos relevantes de perda de margem e pressão no caixa</strong> durante a transição da Reforma Tributária.
                  <br /><br />
                  Esses riscos não aparecem hoje nos relatórios, mas tendem a <strong className="text-rt-purple">se materializar a partir de 2026</strong>.
                </p>
              </div>
            </div>

            {/* Alerts */}
            <div className="mb-10 animate-fade-in-up delay-600" style={{ animationFillMode: 'backwards' }}>
              <h3 className="font-semibold text-card-foreground mb-5 text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Principais alertas identificados:
              </h3>
              <div className="grid gap-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="alert-card flex items-start gap-4 p-5 rounded-2xl"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-600">
                      {alert.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">{alert.title}</p>
                      <p className="text-sm text-red-600/80">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
              <Button
                onClick={() => navigate("/criar-conta")}
                className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Ver diagnóstico completo e plano de ação
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <p className="text-center text-muted-foreground text-sm mt-5">
                Diagnóstico detalhado + reunião estratégica inclusa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultado;
