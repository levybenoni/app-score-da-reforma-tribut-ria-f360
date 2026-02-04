import { Lock, ArrowRight, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BlockAnalysis {
  fragilidades: string[];
  pontos_positivos: string[];
  impacto: string;
}

interface Risk {
  tipo: string;
  descricao: string;
}

interface DiagnosisData {
  titulo?: string;
  secao_1_resumo_executivo?: string;
  secao_2_classificacao_maturidade?: string;
  secao_3_analise_blocos?: {
    faturamento_nf_credito?: BlockAnalysis;
    controle_financeiro_caixa?: BlockAnalysis;
    cadastros_compras_cadeia?: BlockAnalysis;
    juridico_contratos?: BlockAnalysis;
  };
  secao_4_principais_riscos?: Risk[];
  secao_5_recomendacoes?: string[];
  secao_6_conclusao?: string;
}

interface DiagnosisContentProps {
  content: string;
  isPremium: boolean;
}

const blockNameMap: Record<string, string> = {
  faturamento_nf_credito: "Faturamento e NFs",
  controle_financeiro_caixa: "Controle Financeiro",
  cadastros_compras_cadeia: "Cadastros e Compras",
  juridico_contratos: "Jurídico e Contratos",
};

const riskIconMap: Record<string, React.ReactNode> = {
  Margem: <TrendingDown className="w-4 h-4" />,
  Caixa: <AlertTriangle className="w-4 h-4" />,
  Competitividade: <TrendingDown className="w-4 h-4" />,
  Jurídico: <AlertTriangle className="w-4 h-4" />,
};

export function DiagnosisContent({ content, isPremium }: DiagnosisContentProps) {
  const navigate = useNavigate();
  
  let data: DiagnosisData;
  try {
    data = JSON.parse(content);
  } catch {
    // If not JSON, render as HTML/text
    return (
      <div className="relative">
        <div 
          className="prose prose-sm max-w-none text-card-foreground"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }

  const blockEntries = data.secao_3_analise_blocos 
    ? Object.entries(data.secao_3_analise_blocos) 
    : [];

  return (
    <div className="space-y-8">
      {/* Resumo Executivo - Always visible */}
      {data.secao_1_resumo_executivo && (
        <div className="glass-card rounded-2xl p-6 border border-rt-purple/10">
          <h4 className="font-semibold text-card-foreground mb-3 text-lg">Resumo Executivo</h4>
          <p className="text-muted-foreground leading-relaxed">{data.secao_1_resumo_executivo}</p>
        </div>
      )}

      {/* Classificação - Always visible */}
      {data.secao_2_classificacao_maturidade && (
        <div className="glass-card rounded-2xl p-6 border border-rt-purple/10">
          <h4 className="font-semibold text-card-foreground mb-3 text-lg">Classificação de Maturidade</h4>
          <p className="text-muted-foreground leading-relaxed">{data.secao_2_classificacao_maturidade}</p>
        </div>
      )}

      {/* Premium Content - Blurred for free users */}
      <div className="relative">
        <div className={`space-y-6 ${!isPremium ? 'max-h-[300px] overflow-hidden' : ''}`}>
          {/* Análise por Bloco */}
          {blockEntries.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-card-foreground text-lg">Análise Detalhada por Área</h4>
              {blockEntries.map(([key, block]) => (
                <div key={key} className="glass-card rounded-2xl p-6 border border-rt-purple/10">
                  <h5 className="font-semibold text-rt-purple mb-4">{blockNameMap[key] || key}</h5>
                  
                  {block.pontos_positivos?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Pontos Positivos
                      </p>
                      <ul className="space-y-1">
                        {block.pontos_positivos.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-emerald-500">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {block.fragilidades?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Fragilidades
                      </p>
                      <ul className="space-y-1">
                        {block.fragilidades.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-amber-500">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {block.impacto && (
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-sm text-card-foreground">
                        <strong className="text-rt-purple">Impacto:</strong> {block.impacto}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Principais Riscos */}
          {data.secao_4_principais_riscos && data.secao_4_principais_riscos.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-card-foreground text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Principais Riscos Identificados
              </h4>
              <div className="grid gap-3">
                {data.secao_4_principais_riscos.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                      {riskIconMap[risk.tipo] || <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-red-800 text-sm">{risk.tipo}</p>
                      <p className="text-sm text-red-600/80">{risk.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações */}
          {data.secao_5_recomendacoes && data.secao_5_recomendacoes.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-card-foreground text-lg">Recomendações</h4>
              <div className="glass-card rounded-2xl p-6 border border-rt-purple/10">
                <ul className="space-y-2">
                  {data.secao_5_recomendacoes.map((rec, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['→'] before:absolute before:left-1 before:text-rt-purple">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Conclusão */}
          {data.secao_6_conclusao && (
            <div className="glass-card rounded-2xl p-6 border border-rt-purple/10 bg-gradient-to-br from-rt-purple/5 to-rt-dark-blue/5">
              <h4 className="font-semibold text-card-foreground mb-3 text-lg">Conclusão</h4>
              <p className="text-muted-foreground leading-relaxed">{data.secao_6_conclusao}</p>
            </div>
          )}
        </div>

        {/* Free user blur overlay */}
        {!isPremium && (
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/98 to-transparent flex flex-col items-center justify-end pb-8">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Conteúdo exclusivo Premium</span>
            </div>
            <Button
              onClick={() => navigate("/criar-conta")}
              className="btn-premium text-white font-semibold px-8 py-6 h-auto rounded-xl group"
            >
              <span className="relative z-10 flex items-center">
                Desbloqueie o diagnóstico completo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <p className="text-sm text-muted-foreground mt-4 text-center max-w-md px-4">
              Análise estratégica completa, plano de ação detalhado e reunião com especialista inclusos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
