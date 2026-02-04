import { useState } from "react";
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
import { ArrowRight, Building2, Briefcase, Phone, DollarSign, FileText, Sparkles } from "lucide-react";

const DadosComplementares = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empresa: "",
    cargo: "",
    whatsapp: "",
    faturamento: "",
    regime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/compra");
  };

  const isFormValid = 
    formData.empresa && 
    formData.cargo && 
    formData.faturamento &&
    formData.regime;

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
            <span>Personalização do diagnóstico</span>
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
                  <Building2 className="w-9 h-9 text-rt-purple" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-card-foreground mb-3 animate-text-reveal delay-200" style={{ animationFillMode: 'backwards' }}>
                Dados da empresa
              </h1>
              <p className="text-muted-foreground animate-text-reveal delay-300" style={{ animationFillMode: 'backwards' }}>
                Complete seus dados para personalizar o diagnóstico.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 animate-fade-in-up delay-300" style={{ animationFillMode: 'backwards' }}>
                <Label htmlFor="empresa" className="text-card-foreground font-medium">
                  Nome da empresa
                </Label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-rt-purple" />
                  <Input
                    id="empresa"
                    name="empresa"
                    type="text"
                    placeholder="Razão social"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="pl-12 h-14 input-premium rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-400" style={{ animationFillMode: 'backwards' }}>
                <Label htmlFor="cargo" className="text-card-foreground font-medium">
                  Seu cargo
                </Label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-rt-purple" />
                  <Input
                    id="cargo"
                    name="cargo"
                    type="text"
                    placeholder="Ex: Diretor Financeiro"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="pl-12 h-14 input-premium rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-500" style={{ animationFillMode: 'backwards' }}>
                <Label htmlFor="whatsapp" className="text-card-foreground font-medium">
                  WhatsApp <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-rt-purple" />
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="pl-12 h-14 input-premium rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-600" style={{ animationFillMode: 'backwards' }}>
                <Label className="text-card-foreground font-medium">
                  Faturamento anual
                </Label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 transition-colors group-focus-within:text-rt-purple" />
                  <Select
                    value={formData.faturamento}
                    onValueChange={(value) => handleSelectChange("faturamento", value)}
                  >
                    <SelectTrigger className="pl-12 h-14 input-premium rounded-xl text-base">
                      <SelectValue placeholder="Selecione a faixa" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="ate-360k" className="rounded-lg">Até R$ 360 mil</SelectItem>
                      <SelectItem value="360k-4.8m" className="rounded-lg">R$ 360 mil a R$ 4,8 milhões</SelectItem>
                      <SelectItem value="4.8m-78m" className="rounded-lg">R$ 4,8 milhões a R$ 78 milhões</SelectItem>
                      <SelectItem value="acima-78m" className="rounded-lg">Acima de R$ 78 milhões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
                <Label className="text-card-foreground font-medium">
                  Regime tributário
                </Label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 transition-colors group-focus-within:text-rt-purple" />
                  <Select
                    value={formData.regime}
                    onValueChange={(value) => handleSelectChange("regime", value)}
                  >
                    <SelectTrigger className="pl-12 h-14 input-premium rounded-xl text-base">
                      <SelectValue placeholder="Selecione o regime" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="simples" className="rounded-lg">Simples Nacional</SelectItem>
                      <SelectItem value="presumido" className="rounded-lg">Lucro Presumido</SelectItem>
                      <SelectItem value="real" className="rounded-lg">Lucro Real</SelectItem>
                      <SelectItem value="nao-sei" className="rounded-lg">Não sei informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 animate-fade-in-up delay-700" style={{ animationFillMode: 'backwards' }}>
                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full btn-premium text-white font-semibold text-lg py-7 h-auto rounded-2xl group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Continuar para pagamento
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosComplementares;
