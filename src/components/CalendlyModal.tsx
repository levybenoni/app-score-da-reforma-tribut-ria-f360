import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Calendar, Loader2 } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  onEventScheduled?: (scheduledDate: string | null) => void;
}

const CalendlyModal = ({ open, onOpenChange, url, onEventScheduled }: CalendlyModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback((e: MessageEvent) => {
    if (e.origin !== "https://calendly.com") return;

    if (e.data?.event === "calendly.event_scheduled") {
      // Extract scheduled date from the event payload if available
      const startTime = e.data?.payload?.event?.start_time ?? null;
      onEventScheduled?.(startTime);
      // Close modal after a short delay so user sees confirmation
      setTimeout(() => onOpenChange(false), 1500);
    }
  }, [onEventScheduled, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      return;
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, handleMessage]);

  useEffect(() => {
    if (!open) return;

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

  const calendlyDataUrl = `${url}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=754c99`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-xl w-[92vw] h-[80vh] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white [&>button]:text-rt-purple [&>button]:hover:text-rt-dark-blue [&>button]:z-20">
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
        <div className="flex-1 min-h-0 relative overflow-hidden">
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
              className="calendly-inline-widget"
              data-url={calendlyDataUrl}
              style={{ minWidth: "320px", width: "100%", height: "100%" }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
