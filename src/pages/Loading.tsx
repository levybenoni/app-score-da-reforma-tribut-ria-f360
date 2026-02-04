import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const loadingTexts = [
  "Analisando riscos ocultos de margem",
  "Avaliando impacto no caixa",
  "Cruzando preço, crédito e contratos",
  "Mapeando vulnerabilidades estratégicas",
];

const Loading = () => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);

    const navigateTimeout = setTimeout(() => {
      navigate("/resultado");
    }, 6000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(navigateTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center animate-fade-in-up">
        {/* Animated Loader */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
            <Loader2 className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Analisando sua empresa…
        </h1>

        {/* Rotating Text */}
        <div className="glass-card rounded-xl p-6 mb-6 min-h-[80px] flex items-center justify-center">
          <p className="text-card-foreground font-medium text-lg animate-pulse-soft">
            {loadingTexts[currentTextIndex]}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {loadingTexts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTextIndex
                  ? "bg-white w-6"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Fixed Text */}
        <p className="text-white/70 text-sm">
          Isso leva apenas alguns segundos.
        </p>
      </div>
    </div>
  );
};

export default Loading;
