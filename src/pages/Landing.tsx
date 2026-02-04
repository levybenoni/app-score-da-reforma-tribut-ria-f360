import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, AlertTriangle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm tracking-wide">RT MATURITY SCAN</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
          A Reforma Tributária não é sobre impostos.
          <br />
          <span className="text-rt-light-blue">É sobre caixa, margem, preço e competitividade.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Em menos de 3 minutos, descubra se sua empresa está preparada ou exposta para a transição da Reforma Tributária (2026–2033).
        </p>

        {/* Context Text */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-10 max-w-2xl mx-auto text-left">
          <p className="text-card-foreground leading-relaxed">
            Este diagnóstico avalia a maturidade da gestão da sua empresa — não o trabalho da contabilidade.
            <br /><br />
            <strong className="text-rt-purple">Você vai identificar riscos ocultos que podem consumir lucro sem perceber.</strong>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <TrendingUp className="w-6 h-6 text-rt-light-blue flex-shrink-0" />
            <span className="text-white text-sm text-left">Avalie riscos de margem</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <AlertTriangle className="w-6 h-6 text-rt-light-blue flex-shrink-0" />
            <span className="text-white text-sm text-left">Identifique gaps de gestão</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Shield className="w-6 h-6 text-rt-light-blue flex-shrink-0" />
            <span className="text-white text-sm text-left">Receba plano de ação</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate("/orientacoes")}
          size="lg"
          className="bg-white text-rt-purple hover:bg-white/90 font-semibold text-lg px-10 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          Iniciar diagnóstico agora
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-white/60 text-sm mt-6">
          Gratuito • Sem cadastro • Resultado imediato
        </p>
      </div>
    </div>
  );
};

export default Landing;
