import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileText, DollarSign, Link2, Scale, Check, X, Loader2 } from "lucide-react";
import { useQuestions } from "@/hooks/useQuestions";
import { useDiagnostic } from "@/hooks/useDiagnostic";
import { useToast } from "@/hooks/use-toast";

const blockIcons: Record<string, React.ReactNode> = {
  "FISCAL_CREDITO": <FileText className="w-6 h-6" />,
  "CAIXA": <DollarSign className="w-6 h-6" />,
  "CADASTROS_COMPRAS": <Link2 className="w-6 h-6" />,
  "JURIDICO_CONTRATOS": <Scale className="w-6 h-6" />,
};

const blockDescriptions: Record<string, string> = {
  "FISCAL_CREDITO": "Faturamento e emissão de NFs são a base da tomada de crédito e da formação de preço no novo modelo tributário.",
  "CAIXA": "Sem controle financeiro, a Reforma Tributária vira um problema de caixa, não de imposto.",
  "CADASTROS_COMPRAS": "Na Reforma Tributária, comprar bem é tão importante quanto vender bem.",
  "JURIDICO_CONTRATOS": "Contratos mal preparados podem impedir o repasse do imposto.",
};

const Questionario = () => {
  const navigate = useNavigate();
  const { bloco } = useParams<{ bloco: string }>();
  const currentBlockIndex = parseInt(bloco || "1") - 1;
  const { toast } = useToast();
  
  const { blocks, isLoading: questionsLoading, error: questionsError } = useQuestions();
  const { saveAnswer, publicToken } = useDiagnostic();
  
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const currentBlock = blocks[currentBlockIndex];
  const totalBlocks = blocks.length;

  // Check if we have a valid run
  useEffect(() => {
    if (!publicToken) {
      navigate("/orientacoes");
    }
  }, [publicToken, navigate]);

  // Animation on block change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentBlockIndex]);

  const progress = totalBlocks > 0 ? ((currentBlockIndex + 1) / totalBlocks) * 100 : 0;
  
  const currentBlockQuestions = currentBlock?.questions || [];
  const allAnswered = currentBlockQuestions.every((q) => answers[q.id] !== undefined && answers[q.id] !== null);

  const handleAnswer = useCallback(async (questionId: string, value: boolean) => {
    // Optimistic update
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    
    try {
      await saveAnswer(questionId, value);
    } catch (error) {
      console.error('Error saving answer:', error);
      // Revert on error
      setAnswers((prev) => ({ ...prev, [questionId]: null }));
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a resposta. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [saveAnswer, toast]);

  const handleNext = () => {
    if (currentBlockIndex < totalBlocks - 1) {
      navigate(`/questionario/${currentBlockIndex + 2}`);
    } else {
      navigate("/loading");
    }
  };

  const handleBack = () => {
    if (currentBlockIndex > 0) {
      navigate(`/questionario/${currentBlockIndex}`);
    } else {
      navigate("/orientacoes");
    }
  };

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-rt-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  if (questionsError || !currentBlock) {
    return (
      <div className="min-h-screen bg-rt-gradient flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-white text-lg mb-4">
            {questionsError || "Bloco não encontrado"}
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const blockCode = currentBlock.codigo;
  const icon = blockIcons[blockCode] || <FileText className="w-6 h-6" />;
  const description = blockDescriptions[blockCode] || "";

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
                Bloco {currentBlockIndex + 1} de {totalBlocks}
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
                {icon}
              </div>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-card-foreground mb-1">
                  {currentBlock.titulo}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Questions - Single column, fluid layout */}
            <div className="space-y-4">
              {currentBlockQuestions.map((question, index) => (
                <div 
                  key={question.id} 
                  className={`group relative bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-5 border border-rt-purple/5 transition-all duration-300 hover:border-rt-purple/15 hover:shadow-md ${isAnimating ? 'animate-fade-in-up' : ''}`}
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Question text */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rt-purple/10 text-rt-purple text-sm font-bold flex-shrink-0">
                        {question.ordem}
                      </span>
                      <p className="text-card-foreground font-medium text-sm sm:text-base leading-relaxed pt-0.5">
                        {question.texto}
                      </p>
                    </div>
                    
                    {/* Answer buttons */}
                    <div className="flex gap-2 sm:flex-shrink-0 ml-10 sm:ml-0">
                      <button
                        onClick={() => handleAnswer(question.id, true)}
                        className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 min-w-[90px] ${
                          answers[question.id] === true 
                            ? "bg-rt-light-blue border-rt-light-blue text-white shadow-lg shadow-rt-light-blue/25" 
                            : "bg-white/80 border-rt-light-blue/20 text-rt-dark-blue hover:border-rt-light-blue/50 hover:bg-rt-light-blue/5"
                        }`}
                      >
                        <Check className={`w-4 h-4 transition-transform ${answers[question.id] === true ? 'scale-110' : ''}`} />
                        Sim
                      </button>
                      <button
                        onClick={() => handleAnswer(question.id, false)}
                        className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 min-w-[90px] ${
                          answers[question.id] === false 
                            ? "bg-rt-purple border-rt-purple text-white shadow-lg shadow-rt-purple/25" 
                            : "bg-white/80 border-rt-purple/20 text-rt-purple hover:border-rt-purple/50 hover:bg-rt-purple/5"
                        }`}
                      >
                        <X className={`w-4 h-4 transition-transform ${answers[question.id] === false ? 'scale-110' : ''}`} />
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
                  {currentBlockIndex < totalBlocks - 1 ? "Próximo bloco" : "Ver resultado"}
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
