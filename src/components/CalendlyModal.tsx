import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, Loader2 } from "lucide-react";
import { useState } from "react";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
}

const CalendlyModal = ({ open, onOpenChange, url }: CalendlyModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const iframeSrc = `${url}?hide_gdpr_banner=1&background_color=ffffff&text_color=1a1a2e&primary_color=754c99`;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setIsLoading(true); }}>
      <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 overflow-hidden rounded-2xl border border-border/40 bg-background shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 flex items-center justify-center border border-rt-purple/20">
              <Calendar className="w-5 h-5 text-rt-purple" />
            </div>
            Agendar Reunião Estratégica
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Escolha o melhor dia e horário para sua reunião com nossos especialistas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-6 pb-6 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80 rounded-xl mx-6 mb-6">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-rt-purple animate-spin" />
                <p className="text-sm text-muted-foreground">Carregando agenda...</p>
              </div>
            </div>
          )}
          <iframe
            src={open ? iframeSrc : ""}
            title="Agendar Reunião"
            className="w-full h-full rounded-xl border border-border/20"
            style={{ minHeight: "500px", height: "calc(85vh - 120px)" }}
            frameBorder="0"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
