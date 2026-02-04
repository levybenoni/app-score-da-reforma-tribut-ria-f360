import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, TrendingDown, FileSearch, Shield } from "lucide-react";

const loadingSteps = [
  {
    icon: <TrendingDown className="w-6 h-6" />,
    text: "Analisando riscos ocultos de margem",
  },
  {
    icon: <Activity className="w-6 h-6" />,
    text: "Avaliando impacto no caixa",
  },
  {
    icon: <FileSearch className="w-6 h-6" />,
    text: "Cruzando preço, crédito e contratos",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    text: "Mapeando vulnerabilidades estratégicas",
  },
];

const Loading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.5;
      });
    }, 90);

    const navigateTimeout = setTimeout(() => {
      navigate("/resultado");
    }, 6000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(navigateTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Rotating gradient ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20">
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-rotate-slow" />
          <div className="absolute inset-8 rounded-full border border-white/15 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
          <div className="absolute inset-16 rounded-full border border-white/10 animate-rotate-slow" style={{ animationDuration: '15s' }} />
        </div>
        
        {/* Floating particles */}
        <div className="floating-orb floating-orb-1 animate-pulse-soft" />
        <div className="floating-orb floating-orb-2 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-lg w-full mx-auto text-center relative z-10">
        {/* Main loader */}
        <div className="mb-12 animate-fade-in-up">
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            
            {/* Animated progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.89} 289`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8fd0d7" />
                  <stop offset="50%" stopColor="#5bc0cd" />
                  <stop offset="100%" stopColor="#8fd0d7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card-dark rounded-full w-20 h-20 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          Analisando sua empresa…
        </h1>

        {/* Steps list */}
        <div className="space-y-4 mb-10">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`glass-card-dark rounded-2xl p-5 transition-all duration-500 ${
                index === currentStep
                  ? "scale-105 border-white/30 shadow-lg shadow-white/10"
                  : index < currentStep
                  ? "opacity-50 scale-95"
                  : "opacity-30 scale-95"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  index === currentStep
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/50"
                }`}>
                  {step.icon}
                </div>
                <p className={`text-lg font-medium transition-all duration-500 ${
                  index === currentStep
                    ? "text-white"
                    : "text-white/50"
                }`}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-6">
          {loadingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentStep
                  ? "bg-white w-8"
                  : index < currentStep
                  ? "bg-white/60 w-2"
                  : "bg-white/20 w-2"
              }`}
            />
          ))}
        </div>

        {/* Fixed Text */}
        <p className="text-white/60 text-sm animate-pulse-soft">
          Isso leva apenas alguns segundos.
        </p>
      </div>
    </div>
  );
};

export default Loading;
