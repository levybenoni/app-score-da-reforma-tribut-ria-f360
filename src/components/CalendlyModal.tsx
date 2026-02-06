import {
  Dialog,
  DialogContent,
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
      setTimeout(() => setIsLoading(false), 1500);
    });
  }, [open]);

  const calendlyDataUrl = `${url}?hide_event_type_details=1&hide_gdpr_banner=1`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[96vw] h-[90vh] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white [&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:z-20">
        {/* Thin top accent bar */}
        <div className="h-1 bg-gradient-to-r from-rt-purple via-rt-dark-blue to-rt-light-blue flex-shrink-0" />

        {/* Compact header */}
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border/30 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 flex items-center justify-center border border-rt-purple/20 flex-shrink-0">
            <Calendar className="w-4 h-4 text-rt-purple" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-card-foreground leading-tight">
              Agendar Reunião Estratégica
            </h2>
            <p className="text-xs text-muted-foreground leading-tight">
              Escolha o melhor dia e horário para sua reunião.
            </p>
          </div>
        </div>

        {/* Calendly widget area - takes all remaining space */}
        <div className="flex-1 min-h-0 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-rt-purple animate-spin" />
                <p className="text-sm text-muted-foreground">Carregando agenda...</p>
              </div>
            </div>
          )}
          {open && (
            <div
              ref={containerRef}
              className="calendly-inline-widget w-full h-full"
              data-url={calendlyDataUrl}
              style={{ minWidth: "320px", height: "100%" }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
