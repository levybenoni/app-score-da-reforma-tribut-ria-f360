import { Calendar, MessageCircle, Lock, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SchedulingData {
  agendamentoRealizado: boolean;
  agendadoEm: string | null;
  dataAgendada: string | null;
}

interface ContactSectionsProps {
  isPremium: boolean;
  schedulingData: SchedulingData;
  onScheduleClick: () => void;
}

const ContactSections = ({ isPremium, schedulingData, onScheduleClick }: ContactSectionsProps) => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/551132314580', '_blank');
  };

  const isAlreadyScheduled = schedulingData.agendamentoRealizado;

  const formatScheduledDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const endDate = new Date(date.getTime() + 30 * 60 * 1000); // +30min
    const formattedDate = format(date, "dd/MM/yyyy", { locale: ptBR });
    const startTime = format(date, "HH:mm", { locale: ptBR });
    const endTime = format(endDate, "HH:mm", { locale: ptBR });
    return `${formattedDate} — ${startTime} às ${endTime}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Agendar Reunião Card */}
      <div className="relative overflow-hidden rounded-2xl border border-rt-purple/10 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-rt-purple/10">
        {/* Free plan overlay */}
        {!isPremium && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rt-purple/20 to-rt-dark-blue/20 flex items-center justify-center mb-4 shadow-lg">
              <Lock className="w-6 h-6 text-rt-purple" />
            </div>
            <p className="text-card-foreground font-semibold text-center mb-2">
              Disponível apenas no Plano Premium
            </p>
            <p className="text-muted-foreground text-sm text-center px-4">
              Desbloqueie para agendar uma reunião estratégica.
            </p>
          </div>
        )}

        <div className={!isPremium ? 'opacity-50' : ''}>
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border ${
            isAlreadyScheduled 
              ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20' 
              : 'bg-gradient-to-br from-rt-purple/10 to-rt-dark-blue/10 border-rt-purple/20'
          }`}>
            {isAlreadyScheduled ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            ) : (
              <Calendar className="w-7 h-7 text-rt-purple" />
            )}
          </div>

          {/* Content - switches based on scheduling state */}
          {isAlreadyScheduled ? (
            <>
              <h3 className="text-xl font-bold text-card-foreground mb-2">
                ✅ Agendamento já realizado
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Sua reunião estratégica já foi agendada. Em breve você receberá os detalhes por e-mail.
              </p>

              {/* Scheduled date/time display */}
              {schedulingData.dataAgendada && (
                <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-200/50 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-card-foreground">
                      {formatScheduledDate(schedulingData.dataAgendada)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Horário de Brasília
                    </span>
                  </div>
                </div>
              )}

              <Button
                disabled
                className="w-full bg-rt-purple/50 text-white font-medium py-6 h-auto rounded-xl cursor-not-allowed opacity-60"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendamento concluído
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-card-foreground mb-2">
                Agendar Reunião
              </h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Agende uma reunião estratégica com nossos especialistas para discutir seu plano de ação personalizado.
              </p>
              <Button
                onClick={onScheduleClick}
                disabled={!isPremium}
                className="w-full bg-rt-purple hover:bg-rt-purple/90 text-white font-medium py-6 h-auto rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rt-purple/30 disabled:opacity-50"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Agora
              </Button>
            </>
          )}
        </div>
      </div>

      {/* WhatsApp Consultor Card */}
      <div className="relative overflow-hidden rounded-2xl border border-rt-purple/10 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-rt-purple/10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center mb-5 border border-green-500/20">
          <MessageCircle className="w-7 h-7 text-green-600" />
        </div>

        <h3 className="text-xl font-bold text-card-foreground mb-2">
          Converse com um consultor BWA
        </h3>

        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Tire suas dúvidas diretamente com nossa equipe de consultores especializados via WhatsApp.
        </p>

        <Button
          onClick={handleWhatsAppClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 h-auto rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Falar pelo WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default ContactSections;
