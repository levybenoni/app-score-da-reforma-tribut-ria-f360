import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const Orientacoes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="glass-card rounded-2xl p-8 md:p-10">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-6 text-center">
            Como responder este diagnóstico
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-center mb-8 leading-relaxed">
            Este questionário avalia o nível de maturidade da gestão da sua empresa frente à Reforma Tributária — e não o trabalho da contabilidade.
          </p>

          {/* SIM block */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <h2 className="font-semibold text-green-800">Marque SIM apenas se você:</h2>
            </div>
            <ul className="space-y-2 text-green-700 ml-9">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Entende o assunto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Sabe onde a informação está</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Já usou isso para decidir preço, compra ou estratégia</span>
              </li>
            </ul>
          </div>

          {/* NÃO block */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <h2 className="font-semibold text-red-800">Marque NÃO se:</h2>
            </div>
            <ul className="space-y-2 text-red-700 ml-9">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Depende exclusivamente da contabilidade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Não tem clareza sobre o tema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Nunca usou essa informação para decidir</span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 mb-2">
                  Não existem respostas certas ou erradas.
                </p>
                <p className="text-amber-700 text-sm">
                  Respostas otimistas apenas mascaram riscos que a Reforma Tributária tende a expor.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button 
            onClick={() => navigate("/questionario/1")}
            className="w-full bg-rt-purple hover:bg-rt-purple/90 text-white font-semibold text-lg py-6 h-auto rounded-xl group"
          >
            Começar diagnóstico
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Orientacoes;
