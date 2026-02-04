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

      <div className="max-w-3xl w-full mx-auto relative z-10">
        {/* Progress Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between text-white text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 font-medium">
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

          <div className="p-6 md:p-10">
            {/* Block Header */}
            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 flex items-center justify-center text-rt-purple border border-rt-purple/10">
                {blockData.icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-card-foreground">
                  {blockData.title}
                </h1>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-10 pb-8 border-b border-border/50 text-lg leading-relaxed">
              {blockData.description}
            </p>

            {/* Questions */}
            <div className="space-y-5">
              {blockData.questions.map((question, index) => (
                <div 
                  key={index} 
                  className={`question-card p-5 md:p-6 ${isAnimating ? 'animate-fade-in-up' : ''}`}
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <p className="text-card-foreground font-medium mb-5 leading-relaxed text-base md:text-lg">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rt-purple/10 text-rt-purple text-sm font-bold mr-3">
                      {(parseInt(currentBlock) - 1) * 5 + index + 1}
                    </span>
                    {question}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer(index, true)}
                      className={`flex-1 h-14 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 btn-answer ${
                        answers[index] === true 
                          ? "btn-answer-yes selected" 
                          : "text-green-700 hover:text-green-800"
                      }`}
                    >
                      <Check className={`w-5 h-5 transition-transform ${answers[index] === true ? 'scale-110' : ''}`} />
                      Sim
                    </button>
                    <button
                      onClick={() => handleAnswer(index, false)}
                      className={`flex-1 h-14 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 btn-answer ${
                        answers[index] === false 
                          ? "btn-answer-no selected" 
                          : "text-red-700 hover:text-red-800"
                      }`}
                    >
                      <X className={`w-5 h-5 transition-transform ${answers[index] === false ? 'scale-110' : ''}`} />
                      Não
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-10 pt-8 border-t border-border/50">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-14 rounded-xl border-2 border-rt-purple/20 hover:border-rt-purple/40 hover:bg-rt-purple/5 transition-all duration-300 font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!allAnswered}
                className="flex-1 h-14 btn-premium text-white font-semibold rounded-xl group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {parseInt(currentBlock) < 4 ? "Próximo bloco" : "Ver resultado"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
