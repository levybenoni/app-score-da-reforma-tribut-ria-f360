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
import { ArrowRight, Building2, Briefcase, Phone, DollarSign, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-rt-gradient flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto animate-fade-in-up">
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rt-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-rt-purple" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Dados da empresa
            </h1>
            <p className="text-muted-foreground text-sm">
              Complete seus dados para personalizar o diagnóstico.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="empresa" className="text-card-foreground">
                Nome da empresa
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="empresa"
                  name="empresa"
                  type="text"
                  placeholder="Razão social"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="pl-11 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-card-foreground">
                Seu cargo
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="cargo"
                  name="cargo"
                  type="text"
                  placeholder="Ex: Diretor Financeiro"
                  value={formData.cargo}
                  onChange={handleChange}
                  className="pl-11 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-card-foreground">
                WhatsApp <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="pl-11 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-card-foreground">
                Faturamento anual
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Select
                  value={formData.faturamento}
                  onValueChange={(value) => handleSelectChange("faturamento", value)}
                >
                  <SelectTrigger className="pl-11 h-12">
                    <SelectValue placeholder="Selecione a faixa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ate-360k">Até R$ 360 mil</SelectItem>
                    <SelectItem value="360k-4.8m">R$ 360 mil a R$ 4,8 milhões</SelectItem>
                    <SelectItem value="4.8m-78m">R$ 4,8 milhões a R$ 78 milhões</SelectItem>
                    <SelectItem value="acima-78m">Acima de R$ 78 milhões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-card-foreground">
                Regime tributário
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Select
                  value={formData.regime}
                  onValueChange={(value) => handleSelectChange("regime", value)}
                >
                  <SelectTrigger className="pl-11 h-12">
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples Nacional</SelectItem>
                    <SelectItem value="presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="real">Lucro Real</SelectItem>
                    <SelectItem value="nao-sei">Não sei informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-rt-purple hover:bg-rt-purple/90 text-white font-semibold py-6 h-auto rounded-xl group mt-6 disabled:opacity-50"
            >
              Continuar para pagamento
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DadosComplementares;
