import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, TrendingUp } from "lucide-react";
import logoF360 from "@/assets/logo-f360.png";

const ORIGEM_KEY = 'diagnosticOrigem';

const Landing = () => {
  const navigate = useNavigate();

  // Capture ?origem= from URL and persist in localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const origem = params.get('origem');
    if (origem) {
      localStorage.setItem(ORIGEM_KEY, origem);
    }
  }, []);

  return (
    <div className="min-h-screen bg-rt-gradient flex flex-col">
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6">
        <div className="flex items-center gap-4">
          <img 
            src="https://ik.imagekit.io/y082km6do/logobranca.png?updatedAt=1761932188284" 
            alt="BWA Global" 
            className="h-8 md:h-10"
          />
          <div className="w-px h-8 bg-white/40" />
          <img 
            src={logoF360}
            alt="F360" 
            className="h-6 md:h-8"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 italic">
            Score da Reforma Tributária
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Descubra em poucos minutos como as mudanças tributárias impactam sua{" "}
            <span className="font-semibold">margem</span>,{" "}
            <span className="font-semibold">caixa</span> e{" "}
            <span className="font-semibold">competitividade</span>.
          </p>

          {/* CTA Buttons - Vertical Stack */}
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={() => navigate("/orientacoes")}
              size="lg"
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-medium text-base md:text-lg px-8 py-6 h-auto rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Iniciar análise agora
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Secondary Login Button */}
            <button
              onClick={() => navigate("/login")}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Já possuo cadastro
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="w-full max-w-5xl mx-auto mt-16 md:mt-24 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Análise Completa</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Avaliação em 4 dimensões estratégicas da sua maturidade tributária.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                <Shield className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Relatório Personalizado</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Resultado customizado com ações prioritárias para sua empresa.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Visão Executiva</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Relatório focado em impacto no negócio, não em complexidade técnica.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 flex flex-col items-center gap-4">
        <img 
          src={logoF360}
          alt="F360" 
          className="h-6 md:h-8 opacity-80"
        />
        <p className="text-white/60 text-sm flex items-center gap-2">
          Powered by
          <img 
            src="https://ik.imagekit.io/y082km6do/logobrancaW.png?updatedAt=1761932134888" 
            alt="BWA Global" 
            className="h-5 inline-block"
          />
        </p>
      </footer>
    </div>
  );
};

export default Landing;
