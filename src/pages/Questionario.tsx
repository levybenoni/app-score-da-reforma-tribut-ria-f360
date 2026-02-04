import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText, DollarSign, Link2, Scale, Check, X } from "lucide-react";

interface BlockData {
  title: string;
  icon: React.ReactNode;
  description: string;
  questions: string[];
}

const blocksData: Record<string, BlockData> = {
  "1": {
    title: "Faturamento, NFs e Crédito",
    icon: <FileText className="w-6 h-6" />,
    description: "Faturamento e emissão de NFs são a base da tomada de crédito e da formação de preço no novo modelo tributário.",
    questions: [
      "A empresa possui 100% das NFs de entrada corretamente registradas?",
      "A empresa emite 100% das NFs de saída para todas as operações?",
      "Existe padrão e conferência das informações fiscais das NFs?",
      "A empresa controla os créditos tributários gerados?",
      "A empresa sabe quais operações geram ou não crédito no novo IVA?",
    ],
  },
  "2": {
    title: "Controle Financeiro e Caixa",
    icon: <DollarSign className="w-6 h-6" />,
    description: "Sem controle financeiro, a Reforma Tributária vira um problema de caixa, não de imposto.",
    questions: [
      "A empresa possui ERP implantado e integrado?",
      "Realiza conciliação diária de bancos, cartões, Pix e recebíveis?",
      "Possui controle de capital de giro e fluxo de caixa projetado?",
      "Realiza gestão orçamentária (orçado x realizado)?",
      "Conhece sua margem real por produto ou serviço?",
    ],
  },
  "3": {
    title: "Cadastros, Compras e Cadeia",
    icon: <Link2 className="w-6 h-6" />,
    description: "Na Reforma Tributária, comprar bem é tão importante quanto vender bem.",
    questions: [
      "Cadastro de fornecedores completo e atualizado?",
      "Sabe quais fornecedores geram crédito e quais não geram?",
      "Cadastro de clientes completo e atualizado?",
      "Considera impacto tributário na decisão de compra?",
      "Consegue projetar preço de venda considerando a nova tributação?",
    ],
  },
  "4": {
    title: "Jurídico e Contratos",
    icon: <Scale className="w-6 h-6" />,
    description: "Contratos mal preparados podem impedir o repasse do imposto.",
    questions: [
      "Possui contratos com 100% dos clientes?",
      "Contratos permitem revisão de preço por mudança tributária?",
      "Possui contratos com os principais fornecedores?",
      "Contratos permitem repasse de novos tributos?",
      "Já analisou contratos à luz da Reforma Tributária?",
    ],
  },
};

const Questionario = () => {
  const navigate = useNavigate();
  const { bloco } = useParams<{ bloco: string }>();
  const currentBlock = bloco || "1";
  const blockData = blocksData[currentBlock];
  
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    setAnswers({ 0: null, 1: null, 2: null, 3: null, 4: null });
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentBlock]);

  const progress = (parseInt(currentBlock) / 4) * 100;
  const allAnswered = Object.values(answers).every((a) => a !== null);

  const handleAnswer = (questionIndex: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleNext = () => {
    if (parseInt(currentBlock) < 4) {
      navigate(`/questionario/${parseInt(currentBlock) + 1}`);
    } else {
      navigate("/loading");
    }
  };

  const handleBack = () => {
    if (parseInt(currentBlock) > 1) {
      navigate(`/questionario/${parseInt(currentBlock) - 1}`);
    } else {
      navigate("/orientacoes");
    }
  };

  if (!blockData) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="w-full max-w-2xl mx-auto relative z-10">
        {/* Progress Header */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between text-white text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 font-medium">
                Bloco {currentBlock} de 4
              </span>
            </div>
            <span className="text-white/80">{Math.round(progress)}% concluído</span>
          </div>
          
          {/* Premium progress bar */}
          <div className="progress-premium h-2">
            <div 
              className="progress-premium-bar h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`glass-card-floating rounded-3xl overflow-hidden ${isAnimating ? 'animate-fade-in-scale' : ''}`}>
          {/* Gradient header accent */}
          <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue" />

          <div className="p-6 md:p-8">
            {/* Block Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 flex items-center justify-center text-rt-purple border border-rt-purple/10 flex-shrink-0">
                {blockData.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-card-foreground mb-1">
                  {blockData.title}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {blockData.description}
                </p>
              </div>
            </div>

            {/* Questions - Single column, fluid layout */}
            <div className="space-y-4">
              {blockData.questions.map((question, index) => (
                <div 
                  key={index} 
                  className={`group relative bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-5 border border-rt-purple/5 transition-all duration-300 hover:border-rt-purple/15 hover:shadow-md ${isAnimating ? 'animate-fade-in-up' : ''}`}
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Question text */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rt-purple/10 text-rt-purple text-sm font-bold flex-shrink-0">
                        {(parseInt(currentBlock) - 1) * 5 + index + 1}
                      </span>
                      <p className="text-card-foreground font-medium text-sm sm:text-base leading-relaxed pt-0.5">
                        {question}
                      </p>
                    </div>
                    
                    {/* Answer buttons */}
                    <div className="flex gap-2 sm:flex-shrink-0 ml-10 sm:ml-0">
                      <button
                        onClick={() => handleAnswer(index, true)}
                        className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 min-w-[90px] ${
                          answers[index] === true 
                            ? "bg-rt-light-blue border-rt-light-blue text-white shadow-lg shadow-rt-light-blue/25" 
                            : "bg-white/80 border-rt-light-blue/20 text-rt-dark-blue hover:border-rt-light-blue/50 hover:bg-rt-light-blue/5"
                        }`}
                      >
                        <Check className={`w-4 h-4 transition-transform ${answers[index] === true ? 'scale-110' : ''}`} />
                        Sim
                      </button>
                      <button
                        onClick={() => handleAnswer(index, false)}
                        className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 min-w-[90px] ${
                          answers[index] === false 
                            ? "bg-rt-purple border-rt-purple text-white shadow-lg shadow-rt-purple/25" 
                            : "bg-white/80 border-rt-purple/20 text-rt-purple hover:border-rt-purple/50 hover:bg-rt-purple/5"
                        }`}
                      >
                        <X className={`w-4 h-4 transition-transform ${answers[index] === false ? 'scale-110' : ''}`} />
                        Não
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-border/30">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6 h-12 rounded-xl bg-white border-2 border-rt-purple/20 text-rt-purple hover:bg-rt-purple/5 hover:border-rt-purple/40 transition-all duration-300 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!allAnswered}
                className="flex-1 h-12 btn-premium text-white font-semibold rounded-xl group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {parseInt(currentBlock) < 4 ? "Próximo bloco" : "Ver resultado"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionario;
