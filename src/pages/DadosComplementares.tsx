import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, User, Building2, Briefcase, Phone, Mail, DollarSign, FileText, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DadosComplementares = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    cargo: "",
    whatsapp: "",
    email: "",
    faturamento: "",
    regime: "",
  });

  // Pre-fill with any available user data (no auth required)
  useEffect(() => {
    const publicToken = localStorage.getItem('diagnosticPublicToken');
    if (!publicToken) {
      toast.error("Diagnóstico não encontrado. Por favor, reinicie o questionário.");
      navigate('/');
      return;
    }

    // Load any saved data from localStorage
    const savedData = localStorage.getItem('rt-complementary-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({ ...prev, ...parsed }));
    }

    // Try to pre-fill from user data if available
    const userData = localStorage.getItem('rt-user-data');
    if (userData) {
      const parsed = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        nome: prev.nome || parsed.nome || "",
        email: prev.email || parsed.email || "",
      }));
    }

    // Also check if there's an active session for pre-fill
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          nome: prev.nome || session.user.user_metadata?.nome || "",
          email: prev.email || session.user.email || "",
        }));
      }
    });
  }, [navigate]);

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      return digits.length > 0 ? `(${digits}` : '';
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'whatsapp') {
      setFormData((prev) => ({ ...prev, [name]: formatWhatsApp(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const publicToken = localStorage.getItem('diagnosticPublicToken');
      
      if (!publicToken) {
        toast.error("Diagnóstico não encontrado. Por favor, reinicie o questionário.");
        navigate('/');
        return;
      }

      console.log("Calling updateComplementaryData with publicToken:", publicToken);

      const origem = localStorage.getItem('diagnosticOrigem');

      // Call edge function - works with or without auth
      const { data: result, error: updateError } = await supabase.functions.invoke('updateComplementaryData', {
        body: { 
          publicToken,
          nome: formData.nome,
          email: formData.email,
          whatsapp: formData.whatsapp || null,
          empresa: formData.empresa,
          cargo: formData.cargo,
          faturamento: formData.faturamento,
          regime: formData.regime,
          fonte: 'F360',
          origem: origem || null,
        }
      });

      if (updateError) {
        console.error("Error from updateComplementaryData:", updateError);
        toast.error("Erro ao salvar dados. Tente novamente.");
        return;
      }

      if (!result?.success) {
        console.error("Update failed:", result?.error);
        toast.error(result?.error || "Erro ao salvar dados. Tente novamente.");
        return;
      }

      console.log("Successfully updated diagnosticRun:", result);
      
      // Update localStorage with the correct runId
      if (result.runId) {
        localStorage.setItem('diagnosticRunId', result.runId);
      }
      
      // Clean up origem from localStorage after successful save
      localStorage.removeItem('diagnosticOrigem');
      
      // Save complementary data to localStorage as backup
      localStorage.setItem('rt-complementary-data', JSON.stringify(formData));
      
      toast.success("Dados salvos com sucesso!");
      
      // Redirect to loading (which triggers finalize + webhook)
      navigate("/loading");
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappDigits = formData.whatsapp.replace(/\D/g, '');
  const isWhatsAppValid = whatsappDigits.length === 0 || whatsappDigits.length === 11;
  const isWhatsAppFormatValid = whatsappDigits.length === 0 || /^[1-9][1-9]9\d{8}$/.test(whatsappDigits);

  const isFormValid = 
    formData.nome &&
    formData.empresa && 
    formData.cargo && 
    formData.email &&
    formData.faturamento &&
    formData.regime &&
    isWhatsAppFormatValid;

  return (
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      <div className="w-full max-w-2xl lg:max-w-4xl mx-auto relative z-10">
        {/* Header badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Personalização do Score</span>
          </div>
        </div>

        <div className="glass-card-floating rounded-3xl overflow-hidden animate-fade-in-up delay-100" style={{ animationFillMode: 'backwards' }}>
          <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue" />

          <div className="p-6 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-5 relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rt-purple/20 to-rt-dark-blue/20 animate-pulse-glow" />
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 flex items-center justify-center border border-rt-purple/20">
                  <Building2 className="w-8 h-8 text-rt-purple" />
                </div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-2">
                Falta só um passo para liberar o Score da sua empresa
              </h1>
              <p className="text-muted-foreground">
                Estamos quase concluindo sua análise. Preencha os dados abaixo para personalizar o seu score e gerar recomendações mais precisas para sua empresa.
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                Leva menos de 30 segundos. Seu relatório será gerado com base nas informações da sua empresa.
              </p>
            </div>

            {/* Form - Desktop grid layout */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Nome Completo (100%) */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-card-foreground font-medium text-sm">
                  Nome Completo
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                    <User className="w-4 h-4 text-rt-purple" />
                  </div>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-14 h-14 input-premium rounded-xl text-base"
                  />
                </div>
              </div>

              {/* Row 2: Empresa (50%) + Cargo (50%) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="empresa" className="text-card-foreground font-medium text-sm">
                    Nome da Empresa
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                      <Building2 className="w-4 h-4 text-rt-purple" />
                    </div>
                    <Input
                      id="empresa"
                      name="empresa"
                      type="text"
                      placeholder="Razão social"
                      value={formData.empresa}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-14 h-14 input-premium rounded-xl text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground font-medium text-sm">
                    Seu Cargo
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                      <Briefcase className="w-4 h-4 text-rt-purple" />
                    </div>
                    <Select
                      value={formData.cargo}
                      onValueChange={(value) => handleSelectChange("cargo", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="pl-14 h-14 input-premium rounded-xl text-base">
                        <SelectValue placeholder="Selecione seu cargo" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Diretor/Sócio/CEO" className="rounded-lg">Diretor/Sócio/CEO</SelectItem>
                        <SelectItem value="Gerente/Coordenador/Supervisor" className="rounded-lg">Gerente/Coordenador/Supervisor</SelectItem>
                        <SelectItem value="Analista/Consultor/Especialista" className="rounded-lg">Analista/Consultor/Especialista</SelectItem>
                        <SelectItem value="Assistente/Auxiliar" className="rounded-lg">Assistente/Auxiliar</SelectItem>
                        <SelectItem value="Estudante" className="rounded-lg">Estudante</SelectItem>
                        <SelectItem value="Outros" className="rounded-lg">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Row 3: WhatsApp (50%) + Email (50%) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-card-foreground font-medium text-sm">
                    WhatsApp
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                      <Phone className="w-4 h-4 text-rt-purple" />
                    </div>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-14 h-14 input-premium rounded-xl text-base"
                    />
                  </div>
                  {formData.whatsapp && !isWhatsAppFormatValid && (
                    <p className="text-destructive text-xs mt-1">
                      Formato inválido. Use: (DDD) 9XXXX-XXXX
                    </p>
                  )}
                </div>

                <div className="space-y-2">
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
              </div>

              {/* Row 4: Faturamento (50%) + Regime (50%) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-card-foreground font-medium text-sm">
                    Faturamento anual
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                      <DollarSign className="w-4 h-4 text-rt-purple" />
                    </div>
                    <Select
                      value={formData.faturamento}
                      onValueChange={(value) => handleSelectChange("faturamento", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="pl-14 h-14 input-premium rounded-xl text-base">
                        <SelectValue placeholder="Selecione a faixa" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0 a 360 mil" className="rounded-lg">0 a 360 mil</SelectItem>
                        <SelectItem value="361 mil a 4.800.000" className="rounded-lg">361 mil a 4.800.000</SelectItem>
                        <SelectItem value="4.800.001 a 10 milhões" className="rounded-lg">4.800.001 a 10 milhões</SelectItem>
                        <SelectItem value="10 a 40 milhões" className="rounded-lg">10 a 40 milhões</SelectItem>
                        <SelectItem value="Acima de 40 milhões" className="rounded-lg">Acima de 40 milhões</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground font-medium text-sm">
                    Regime tributário
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-rt-purple/10 flex items-center justify-center z-10">
                      <FileText className="w-4 h-4 text-rt-purple" />
                    </div>
                    <Select
                      value={formData.regime}
                      onValueChange={(value) => handleSelectChange("regime", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="pl-14 h-14 input-premium rounded-xl text-base">
                        <SelectValue placeholder="Selecione o regime" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Simples Nacional" className="rounded-lg">Simples Nacional</SelectItem>
                        <SelectItem value="Lucro Presumido" className="rounded-lg">Lucro Presumido</SelectItem>
                        <SelectItem value="Lucro Real" className="rounded-lg">Lucro Real</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full btn-premium text-white font-semibold text-lg py-6 h-auto rounded-2xl group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Descobrir meu Score da Reforma Tributária
                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
                <div className="flex items-center justify-center gap-2 text-muted-foreground/60 text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Seus dados estão protegidos. Não enviamos spam.</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosComplementares;
