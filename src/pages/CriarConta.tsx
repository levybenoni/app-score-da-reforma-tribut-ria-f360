import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, User, Mail, Lock, Eye, EyeOff, Sparkles, Shield } from "lucide-react";

const CriarConta = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dados-complementares");
  };

  const isFormValid = 
    formData.nome && 
    formData.email && 
    formData.senha && 
    formData.confirmarSenha &&
    formData.senha === formData.confirmarSenha;

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Header badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Acesso ao diagnóstico completo</span>
          </div>
        </div>

        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          {/* Gradient header accent */}
          <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue" />

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rt-purple/20 to-rt-dark-blue/20 animate-pulse-glow" />
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 flex items-center justify-center border border-rt-purple/20">
                  <User className="w-9 h-9 text-rt-purple" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-card-foreground mb-3 animate-text-reveal delay-200" style={{ animationFillMode: 'backwards' }}>
                Criar sua conta
              </h1>
              <p className="text-muted-foreground animate-text-reveal delay-300" style={{ animationFillMode: 'backwards' }}>
                Crie sua conta para acessar o diagnóstico completo e agendar sua reunião estratégica.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 animate-fade-in-up delay-300" style={{ animationFillMode: 'backwards' }}>
                <Label htmlFor="nome" className="text-card-foreground font-medium text-sm">
                  Nome completo
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                    <User className="w-4 h-4 text-rt-purple" />
                  </div>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="pl-14 h-14 input-premium rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-400" style={{ animationFillMode: 'backwards' }}>
                <Label htmlFor="email" className="text-card-foreground font-medium text-sm">
                  E-mail
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                    <Mail className="w-4 h-4 text-rt-purple" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-14 h-14 input-premium rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-500" style={{ animationFillMode: 'backwards' }}>
                <Label htmlFor="senha" className="text-card-foreground font-medium text-sm">
                  Senha
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                    <Lock className="w-4 h-4 text-rt-purple" />
                  </div>
                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={handleChange}
                    className="pl-14 pr-12 h-14 input-premium rounded-xl text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-transparent hover:bg-rt-purple/5 flex items-center justify-center transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-600" style={{ animationFillMode: 'backwards' }}>
                <Label htmlFor="confirmarSenha" className="text-card-foreground font-medium text-sm">
                  Confirmar senha
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                    <Lock className="w-4 h-4 text-rt-purple" />
                  </div>
                  <Input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="pl-14 pr-12 h-14 input-premium rounded-xl text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-transparent hover:bg-rt-purple/5 flex items-center justify-center transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Criar conta e continuar
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </form>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground text-sm animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
              <Shield className="w-4 h-4" />
              <span>Seus dados estão protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarConta;
