import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { useEffect } from "react";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
}

const CalendlyModal = ({ open, onOpenChange, url }: CalendlyModalProps) => {
  useEffect(() => {
    if (open) {
      // Load Calendly widget script if not already loaded
      const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 overflow-hidden rounded-2xl border-rt-purple/20">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 flex items-center justify-center border border-rt-purple/20">
              <Calendar className="w-5 h-5 text-rt-purple" />
            </div>
            Agendar Reunião Estratégica
          </DialogTitle>
          <DialogDescription>
            Escolha o melhor dia e horário para sua reunião com nossos especialistas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-6 pb-6">
          <div
            className="calendly-inline-widget w-full h-full rounded-xl overflow-hidden"
            data-url={url}
            style={{ minHeight: "500px", height: "calc(85vh - 120px)" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
