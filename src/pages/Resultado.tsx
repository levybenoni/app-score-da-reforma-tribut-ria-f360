import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Link2, Scale, Sparkles, Loader2, AlertTriangle, Lock } from "lucide-react";
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
  const { result, htmlReport, isPremium, isLoading, error } = useDiagnosticResult();

  const overallScore = result?.percentualGeral ?? 0;
  const maturityLevel = result?.nivelMaturidadeGeral?.toLowerCase() ?? "intermediaria";

  const maturityConfig = {
    baixa: { label: "Baixa", color: "text-red-500", bgColor: "bg-red-500" },
    intermediaria: { label: "Intermediária", color: "text-amber-500", bgColor: "bg-amber-500" },
    alta: { label: "Alta", color: "text-emerald-500", bgColor: "bg-emerald-500" },
  };

  const config = maturityConfig[maturityLevel as keyof typeof maturityConfig] || maturityConfig.intermediaria;

  const blockScores = (result?.blockScores || []).map(block => ({
    key: block.codigoBloco || '',
    name: blockNameMap[block.codigoBloco || ''] || block.tituloBloco || 'Bloco',
    score: block.percentual ?? 0,
    icon: blockIconMap[block.codigoBloco || ''] || <FileText className="w-5 h-5" />,
  }));

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
    <div className="min-h-screen bg-rt-gradient flex flex-col px-4 py-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col flex-1">
        {/* Header badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Diagnóstico concluído</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100 flex flex-col flex-1" style={{ animationFillMode: 'backwards' }}>
          <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue" />

          <div className="p-6 lg:p-10 flex flex-col flex-1">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-2">
                Seu Diagnóstico de Maturidade está pronto
              </h1>
              <p className="text-muted-foreground">
                Resumo executivo do nível de preparo da sua empresa para a Reforma Tributária.
              </p>
            </div>

            {/* Score + Blocks side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: Overall Score */}
              <div className="score-display rounded-3xl p-6 lg:p-8 text-center">
                <div className="relative">
                  <div className="w-36 h-36 mx-auto mb-5 relative">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(117, 76, 153, 0.1)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
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
                  <h2 className={`text-3xl font-bold ${config.color}`}>{config.label}</h2>
                </div>
              </div>

              {/* Right: Block Scores */}
              <div className="space-y-3">
                <h3 className="font-semibold text-card-foreground mb-4 text-lg">Maturidade por área</h3>
                {blockScores.map((block, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-rt-purple/10">
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

            {/* Diagnóstico Detalhado Section - Raw HTML from webhook */}
            {htmlReport && (
              <div className="flex-1 flex flex-col mt-4 border-t border-border/30 pt-8">
                <h3 className="font-semibold text-card-foreground mb-6 text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rt-purple" />
                  Diagnóstico Detalhado
                </h3>
                
                {/* Container wrapper - controls FREE vs PREMIUM access */}
                <div className={`diagnostico-wrapper relative ${!isPremium ? 'free' : ''}`}>
                  {/* HTML content container */}
                  <div 
                    className={`diagnostico-html bg-white/50 rounded-2xl p-6 ${
                      !isPremium 
                        ? 'max-h-[1600px] overflow-hidden' 
                        : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: htmlReport }}
                  />
                  
                  {/* Premium overlay for Free users - blocks access to content below */}
                  {!isPremium && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 rounded-b-2xl flex flex-col items-center justify-end"
                      style={{
                        height: '350px',
                        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0) 100%)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <div className="text-center px-6 pb-8">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rt-purple/20 to-rt-dark-blue/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Lock className="w-7 h-7 text-rt-purple" />
                        </div>
                        <h4 className="text-xl font-bold text-card-foreground mb-3">
                          Desbloqueie o diagnóstico completo
                        </h4>
                        <p className="text-muted-foreground text-sm mb-5 max-w-sm leading-relaxed">
                          Acesse a análise estratégica completa, plano de ação personalizado e reunião com especialista.
                        </p>
                        <Button 
                          onClick={() => navigate("/compra")}
                          size="lg"
                          className="bg-gradient-to-r from-rt-purple to-rt-dark-blue hover:opacity-90 shadow-lg px-8"
                        >
                          Desbloquear agora
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultado;
