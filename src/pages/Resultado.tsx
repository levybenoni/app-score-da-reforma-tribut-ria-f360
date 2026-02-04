import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, TrendingDown, FileWarning, Scale, Sparkles, Lock, MessageCircle, Calendar, FileText, DollarSign, Link2, Loader2 } from "lucide-react";
import { useDiagnosticResult } from "@/hooks/useDiagnosticResult";

const blockIconMap: Record<string, React.ReactNode> = {
  "FISCAL_CREDITO": <FileText className="w-5 h-5" />,
  "CAIXA": <DollarSign className="w-5 h-5" />,
  "CADASTROS_COMPRAS": <Link2 className="w-5 h-5" />,
  "JURIDICO_CONTRATOS": <Scale className="w-5 h-5" />,
};

const blockNameMap: Record<string, string> = {
  "FISCAL_CREDITO": "Faturamento e NFs",
  "CAIXA": "Controle Financeiro",
  "CADASTROS_COMPRAS": "Cadastros e Compras",
  "JURIDICO_CONTRATOS": "Jurídico e Contratos",
};

const Resultado = () => {
  const navigate = useNavigate();
  const { result, report, isPremium, isLoading, error } = useDiagnosticResult();

  // Determine maturity level from result or default
  const overallScore = result?.percentualGeral ?? 0;
  const maturityLevel = result?.nivelMaturidadeGeral?.toLowerCase() ?? "intermediaria";

  const maturityConfig = {
    baixa: {
      label: "Baixa",
      color: "text-red-500",
      bgColor: "bg-red-500",
    },
    intermediaria: {
      label: "Intermediária",
      color: "text-amber-500",
      bgColor: "bg-amber-500",
    },
    alta: {
      label: "Alta",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500",
    },
  };

  const config = maturityConfig[maturityLevel as keyof typeof maturityConfig] || maturityConfig.intermediaria;

  // Build block scores from result.blockScores (from vwScorePorBloco)
  const blockScores = (result?.blockScores || []).map(block => ({
    key: block.codigoBloco || '',
    name: blockNameMap[block.codigoBloco || ''] || block.tituloBloco || 'Bloco',
    score: block.percentual ?? 0,
    icon: blockIconMap[block.codigoBloco || ''] || <FileText className="w-5 h-5" />,
  }));

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
  ];

  const premiumAlerts = [
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

  const handleWhatsApp = () => {
    window.open("https://wa.me/551132314580", "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rt-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="min-h-screen bg-rt-gradient flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">{error}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Iniciar novo diagnóstico
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Header badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Diagnóstico concluído</span>
          </div>
        </div>

        {/* Main Content - Desktop horizontal layout */}
        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue" />

          <div className="p-6 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-2">
                Seu Diagnóstico de Maturidade está pronto
              </h1>
              <p className="text-muted-foreground">
                Resumo executivo do nível de preparo da sua empresa para a Reforma Tributária.
              </p>
            </div>

            {/* Desktop: Score + Blocks side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Overall Score */}
              <div className="score-display rounded-3xl p-6 lg:p-8 text-center">
                <div className="relative">
                  <div className="w-36 h-36 mx-auto mb-5 relative">
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
                        strokeDasharray={`${overallScore * 2.64} 264`}
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
                      <span className="text-4xl font-bold text-card-foreground">{Math.round(overallScore)}%</span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    Nível de maturidade
                  </p>
                  <h2 className={`text-3xl font-bold ${config.color}`}>
                    {config.label}
                  </h2>
                </div>
              </div>

              {/* Right: Block Scores */}
              <div className="space-y-3">
                <h3 className="font-semibold text-card-foreground mb-4 text-lg">
                  Maturidade por área
                </h3>
                {blockScores.map((block, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-rt-purple/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rt-purple/10 flex items-center justify-center text-rt-purple flex-shrink-0">
                      {block.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-card-foreground text-sm truncate">{block.name}</span>
                        <span className="font-bold text-rt-purple ml-2">{Math.round(block.score)}%</span>
                      </div>
                      <div className="h-2 bg-rt-purple/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rt-purple to-rt-dark-blue rounded-full transition-all duration-1000"
                          style={{ width: `${block.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Message */}
            <div className="relative mb-8">
              <div className="glass-card rounded-2xl p-6 border border-rt-purple/10">
                <p className="text-card-foreground leading-relaxed">
                  Sua empresa apresenta <strong className="text-rt-purple">riscos relevantes de perda de margem e pressão no caixa</strong> durante a transição da Reforma Tributária.
                  Esses riscos não aparecem hoje nos relatórios, mas tendem a <strong className="text-rt-purple">se materializar a partir de 2026</strong>.
                </p>
              </div>
            </div>

            {/* AI Report Content (if available) */}
            {report?.conteudoMarkdown && (
              <div className="relative mb-8">
                <h3 className="font-semibold text-card-foreground mb-4 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rt-purple" />
                  Análise detalhada
                </h3>
                <div className={`glass-card rounded-2xl p-6 border border-rt-purple/10 ${!isPremium ? 'max-h-64 overflow-hidden relative' : ''}`}>
                  <div className="prose prose-sm max-w-none text-card-foreground">
                    {report.conteudoMarkdown.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                  {!isPremium && (
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            )}

            {/* Alerts - Desktop grid */}
            <div className="mb-8">
              <h3 className="font-semibold text-card-foreground mb-4 text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Principais alertas identificados:
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Free alerts */}
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="alert-card flex items-start gap-4 p-5 rounded-2xl"
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

                {/* Premium alerts (blurred for free users) */}
                {premiumAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-4 p-5 rounded-2xl ${
                      isPremium 
                        ? 'alert-card' 
                        : 'bg-gray-100/80 border border-gray-200'
                    }`}
                  >
                    {!isPremium && (
                      <div className="absolute inset-0 backdrop-blur-sm bg-white/60 rounded-2xl flex items-center justify-center z-10">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isPremium ? 'bg-red-500/10 text-red-600' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {alert.icon}
                    </div>
                    <div className={isPremium ? '' : 'opacity-30'}>
                      <p className={`font-semibold ${isPremium ? 'text-red-800' : 'text-gray-600'}`}>{alert.title}</p>
                      <p className={`text-sm ${isPremium ? 'text-red-600/80' : 'text-gray-500'}`}>{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium CTA */}
            {!isPremium && (
              <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-br from-rt-purple/5 to-rt-dark-blue/5 border border-rt-purple/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-card-foreground text-lg mb-1">
                      Desbloqueie o diagnóstico completo
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Análise detalhada, plano de ação e reunião estratégica inclusos.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/criar-conta")}
                    className="btn-premium text-white font-semibold px-8 py-6 h-auto rounded-xl group whitespace-nowrap"
                  >
                    <span className="relative z-10 flex items-center">
                      Ver diagnóstico completo
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-6 border-t border-border/50">
              {/* Schedule with specialist - Premium only */}
              <div className={`relative p-5 rounded-2xl ${
                isPremium 
                  ? 'bg-gradient-to-r from-rt-purple/5 to-rt-dark-blue/5 border border-rt-purple/20 cursor-pointer hover:border-rt-purple/40 transition-all'
                  : 'bg-gray-100/60 border border-gray-200'
              }`}>
                {!isPremium && (
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 rounded-2xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Disponível no plano Premium</span>
                    </div>
                  </div>
                )}
                <div className={`flex items-center gap-4 ${isPremium ? '' : 'opacity-40'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isPremium ? 'bg-rt-purple/10 text-rt-purple' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Agendar com especialista</p>
                    <p className="text-sm text-muted-foreground">Reunião estratégica online</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp - Available for all */}
              <button
                onClick={handleWhatsApp}
                className="p-5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:border-green-300 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-600 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Fale com a BWA Global</p>
                    <p className="text-sm text-muted-foreground">Tire suas dúvidas pelo WhatsApp</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultado;
