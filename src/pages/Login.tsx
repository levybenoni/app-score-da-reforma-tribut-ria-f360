import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Loader2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        redirectToLatestDiagnostic(session.user.id);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        redirectToLatestDiagnostic(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const redirectToLatestDiagnostic = async (userId: string) => {
    try {
      // Find the most recent diagnostic run for this user
      const { data: runs, error } = await supabase
        .from('diagnosticRuns')
        .select('id, publicToken')
        .eq('usuarioId', userId)
        .order('criadoEm', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (runs && runs.length > 0) {
        // Store the run ID and navigate to result
        localStorage.setItem('diagnosticRunId', runs[0].id);
        localStorage.setItem('rt-public-token', runs[0].publicToken);
        navigate('/resultado');
      } else {
        // No diagnostic found, go to start
        toast.info("Nenhum diagnóstico encontrado. Inicie um novo!");
        navigate('/orientacoes');
      }
    } catch (err) {
      console.error("Error fetching diagnostic:", err);
      navigate('/orientacoes');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("E-mail ou senha incorretos");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success("Login realizado com sucesso!");
        // The onAuthStateChange will handle the redirect
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.senha;

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
            <span>Acesse seu diagnóstico</span>
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
                  <LogIn className="w-9 h-9 text-rt-purple" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-card-foreground mb-3 animate-text-reveal delay-200" style={{ animationFillMode: 'backwards' }}>
                Entrar na sua conta
              </h1>
              <p className="text-muted-foreground animate-text-reveal delay-300" style={{ animationFillMode: 'backwards' }}>
                Acesse seu diagnóstico e resultado completo.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 animate-fade-in-up delay-300" style={{ animationFillMode: 'backwards' }}>
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
                    disabled={isLoading}
                    className="pl-14 h-14 input-premium rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-400" style={{ animationFillMode: 'backwards' }}>
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

              <div className="pt-4 animate-fade-in-up delay-500" style={{ animationFillMode: 'backwards' }}>
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        Acessar diagnóstico
                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>

            {/* Create account link */}
            <div className="mt-6 text-center animate-fade-in-up delay-600" style={{ animationFillMode: 'backwards' }}>
              <p className="text-muted-foreground text-sm">
                Ainda não tem conta?{" "}
                <Link 
                  to="/criar-conta" 
                  className="text-rt-purple hover:text-rt-dark-blue font-medium transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground text-sm animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
              <Shield className="w-4 h-4" />
              <span>Seus dados estão protegidos</span>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6 animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
          <Link 
            to="/" 
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
