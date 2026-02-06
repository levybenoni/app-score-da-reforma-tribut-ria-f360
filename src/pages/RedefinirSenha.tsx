import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Eye, EyeOff, Sparkles, Shield, Loader2, KeyRound, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RedefinirSenha = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Listen for the PASSWORD_RECOVERY event
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User has arrived via the reset link - they can now set a new password
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success("Senha redefinida com sucesso!");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = password && confirmPassword && password === confirmPassword && password.length >= 6;

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
            <span>Redefinição de senha</span>
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
                  {isSuccess ? (
                    <CheckCircle className="w-9 h-9 text-green-600" />
                  ) : (
                    <KeyRound className="w-9 h-9 text-rt-purple" />
                  )}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-card-foreground mb-3">
                {isSuccess ? "Senha redefinida" : "Criar nova senha"}
              </h1>
              <p className="text-muted-foreground">
                {isSuccess
                  ? "Sua senha foi atualizada com sucesso. Você já pode acessar sua conta."
                  : "Digite sua nova senha abaixo para concluir a redefinição."}
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center">
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Acessar minha conta
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground font-medium text-sm">
                    Nova senha
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                      <Lock className="w-4 h-4 text-rt-purple" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-card-foreground font-medium text-sm">
                    Confirmar nova senha
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                      <Lock className="w-4 h-4 text-rt-purple" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
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
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-destructive text-sm mt-1">As senhas não coincidem.</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Redefinindo...
                        </>
                      ) : (
                        <>
                          Redefinir senha
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </form>
            )}

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground text-sm">
              <Shield className="w-4 h-4" />
              <span>Seus dados estão protegidos</span>
            </div>
          </div>
        </div>

        {/* Back to login */}
        <div className="text-center mt-6 animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
          <Link
            to="/login"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenha;
