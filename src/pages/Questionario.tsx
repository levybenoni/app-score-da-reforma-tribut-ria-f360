import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, FileText, DollarSign, Link2, Scale } from "lucide-react";

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
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full mx-auto animate-fade-in-up">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-white text-sm mb-2">
            <span>Bloco {currentBlock} de 4</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          {/* Block Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-rt-purple/10 p-3 rounded-xl text-rt-purple">
              {blockData.icon}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-card-foreground">
                {blockData.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-8 pb-6 border-b border-border">
            {blockData.description}
          </p>

          {/* Questions */}
          <div className="space-y-6">
            {blockData.questions.map((question, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-xl">
                <p className="text-card-foreground font-medium mb-4 leading-relaxed">
                  {(parseInt(currentBlock) - 1) * 5 + index + 1}. {question}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant={answers[index] === true ? "default" : "outline"}
                    onClick={() => handleAnswer(index, true)}
                    className={`flex-1 h-12 font-semibold transition-all ${
                      answers[index] === true 
                        ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                        : "hover:border-green-400 hover:text-green-600"
                    }`}
                  >
                    Sim
                  </Button>
                  <Button
                    variant={answers[index] === false ? "default" : "outline"}
                    onClick={() => handleAnswer(index, false)}
                    className={`flex-1 h-12 font-semibold transition-all ${
                      answers[index] === false 
                        ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                        : "hover:border-red-400 hover:text-red-600"
                    }`}
                  >
                    Não
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={!allAnswered}
              className="flex-1 h-12 bg-rt-purple hover:bg-rt-purple/90 text-white font-semibold group disabled:opacity-50"
            >
              {parseInt(currentBlock) < 4 ? "Próximo bloco" : "Ver resultado"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionario;
