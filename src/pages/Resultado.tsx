import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, TrendingDown, FileWarning, Scale } from "lucide-react";

const Resultado = () => {
  const navigate = useNavigate();

  // Mock result - in production this would come from calculation
  const maturityLevel = "intermediaria"; // baixa | intermediaria | alta

  const maturityConfig = {
    baixa: {
      label: "Baixa",
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
    },
    intermediaria: {
      label: "Intermediária",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200",
    },
    alta: {
      label: "Alta",
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
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
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="glass-card rounded-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-3">
              Seu Diagnóstico de Maturidade está pronto
            </h1>
            <p className="text-muted-foreground">
              Este é um resumo executivo do nível de preparo da sua empresa para a Reforma Tributária.
            </p>
          </div>

          {/* Score Display */}
          <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6 mb-8 text-center`}>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              NÍVEL DE MATURIDADE
            </p>
            <h2 className={`text-4xl font-bold ${config.color}`}>
              {config.label}
            </h2>
          </div>

          {/* Main Message */}
          <div className="bg-muted/50 rounded-xl p-6 mb-8">
            <p className="text-card-foreground leading-relaxed">
              Sua empresa apresenta <strong>riscos relevantes de perda de margem e pressão no caixa</strong> durante a transição da Reforma Tributária.
              <br /><br />
              Esses riscos não aparecem hoje nos relatórios, mas tendem a <strong>se materializar a partir de 2026</strong>.
            </p>
          </div>

          {/* Alerts */}
          <div className="mb-8">
            <h3 className="font-semibold text-card-foreground mb-4">
              Principais alertas identificados:
            </h3>
            <div className="grid gap-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-red-50 border border-red-100 rounded-xl"
                >
                  <div className="text-red-600 flex-shrink-0 mt-0.5">
                    {alert.icon}
                  </div>
                  <div>
                    <p className="font-medium text-red-800">{alert.title}</p>
                    <p className="text-sm text-red-600">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate("/criar-conta")}
            className="w-full bg-rt-purple hover:bg-rt-purple/90 text-white font-semibold text-lg py-6 h-auto rounded-xl group"
          >
            Ver diagnóstico completo e plano de ação
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-muted-foreground text-sm mt-4">
            Diagnóstico detalhado + reunião estratégica inclusa
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resultado;
