import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, TrendingUp } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-rt-gradient flex flex-col">
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6">
        <img 
          src="https://ik.imagekit.io/y082km6do/logobranca.png?updatedAt=1761932188284" 
          alt="BWA Global" 
          className="h-8 md:h-10"
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          {/* Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="text-white font-medium text-sm md:text-base tracking-wide">
                Diagnóstico RT – Maturidade de Gestão para a Reforma Tributária
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 italic">
            Reforma Tributária
            <br />
            não é só imposto.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Descubra em poucos minutos como as mudanças tributárias impactam sua{" "}
            <span className="font-semibold">margem</span>,{" "}
            <span className="font-semibold">caixa</span> e{" "}
            <span className="font-semibold">competitividade</span>.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={() => navigate("/orientacoes")}
            size="lg"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-medium text-base md:text-lg px-8 py-6 h-auto rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Iniciar diagnóstico agora
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Secondary Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Já possuo cadastro
          </button>
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
              <h3 className="text-white font-semibold text-lg mb-2">Diagnóstico Personalizado</h3>
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
          src="https://ik.imagekit.io/y082km6do/logobrancaW.png?updatedAt=1761932134888" 
          alt="BWA Global" 
          className="h-10 md:h-12 opacity-80"
        />
        <p className="text-white/60 text-sm">
          © 2026 BWA Global. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
