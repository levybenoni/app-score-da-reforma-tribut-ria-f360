import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
}

const CalendlyModal = ({ open, onOpenChange, url }: CalendlyModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      return;
    }

    // Load Calendly widget script
    const loadScript = () => {
      return new Promise<void>((resolve) => {
        const existing = document.querySelector(
          'script[src="https://assets.calendly.com/assets/external/widget.js"]'
        );
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    loadScript().then(() => {
      // Wait a tick for Calendly to process the widget
      setTimeout(() => setIsLoading(false), 1000);
    });
  }, [open]);

  const calendlyDataUrl = `${url}?hide_event_type_details=1&hide_gdpr_banner=1&text_color=754c99&primary_color=754c99`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-rt-purple animate-spin" />
                <p className="text-sm text-muted-foreground">Carregando agenda...</p>
              </div>
            </div>
          )}
          {open && (
            <div
              ref={containerRef}
              className="calendly-inline-widget w-full h-full rounded-xl overflow-hidden"
              data-url={calendlyDataUrl}
              style={{ minWidth: "320px", height: "calc(85vh - 120px)" }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
