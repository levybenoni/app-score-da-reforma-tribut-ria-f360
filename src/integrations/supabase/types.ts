export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      aiReports: {
        Row: {
          conteudoHtml: string | null
          conteudoMarkdown: string
          criadoEm: string
          id: string
          runId: string
          tipoRelatorio: string
        }
        Insert: {
          conteudoHtml?: string | null
          conteudoMarkdown: string
          criadoEm?: string
          id?: string
          runId: string
          tipoRelatorio: string
        }
        Update: {
          conteudoHtml?: string | null
          conteudoMarkdown?: string
          criadoEm?: string
          id?: string
          runId?: string
          tipoRelatorio?: string
        }
        Relationships: [
          {
            foreignKeyName: "aiReports_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aiReports_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "aiReports_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
      diagnosticAnswers: {
        Row: {
          id: string
          questionId: string
          respondidoEm: string
          respostaBool: boolean
          runId: string
        }
        Insert: {
          id?: string
          questionId: string
          respondidoEm?: string
          respostaBool: boolean
          runId: string
        }
        Update: {
          id?: string
          questionId?: string
          respondidoEm?: string
          respostaBool?: boolean
          runId?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticAnswers_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticAnswers_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticAnswers_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "diagnosticAnswers_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
      diagnosticRuns: {
        Row: {
          cargoUsuario: string | null
          concluidoEm: string | null
          criadoEm: string
          faturamentoAnual: string | null
          fonte: string | null
          id: string
          ipHash: string | null
          leadEmail: string | null
          leadNome: string | null
          leadWhatsapp: string | null
          nomeEmpresa: string | null
          publicToken: string
          questionnaireVersionId: string
          regimeTributario: string | null
          status: string
          userAgent: string | null
          usuarioId: string | null
        }
        Insert: {
          cargoUsuario?: string | null
          concluidoEm?: string | null
          criadoEm?: string
          faturamentoAnual?: string | null
          fonte?: string | null
          id?: string
          ipHash?: string | null
          leadEmail?: string | null
          leadNome?: string | null
          leadWhatsapp?: string | null
          nomeEmpresa?: string | null
          publicToken: string
          questionnaireVersionId: string
          regimeTributario?: string | null
          status?: string
          userAgent?: string | null
          usuarioId?: string | null
        }
        Update: {
          cargoUsuario?: string | null
          concluidoEm?: string | null
          criadoEm?: string
          faturamentoAnual?: string | null
          fonte?: string | null
          id?: string
          ipHash?: string | null
          leadEmail?: string | null
          leadNome?: string | null
          leadWhatsapp?: string | null
          nomeEmpresa?: string | null
          publicToken?: string
          questionnaireVersionId?: string
          regimeTributario?: string | null
          status?: string
          userAgent?: string | null
          usuarioId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticRuns_questionnaireVersionId_fkey"
            columns: ["questionnaireVersionId"]
            isOneToOne: false
            referencedRelation: "questionnaireVersions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosticScores: {
        Row: {
          blockId: string | null
          calculadoEm: string
          id: string
          nivelMaturidade: string
          percentual: number
          pontos: number
          pontosMaximos: number
          runId: string
          statusCor: string | null
        }
        Insert: {
          blockId?: string | null
          calculadoEm?: string
          id?: string
          nivelMaturidade: string
          percentual: number
          pontos: number
          pontosMaximos: number
          runId: string
          statusCor?: string | null
        }
        Update: {
          blockId?: string | null
          calculadoEm?: string
          id?: string
          nivelMaturidade?: string
          percentual?: number
          pontos?: number
          pontosMaximos?: number
          runId?: string
          statusCor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticScores_blockId_fkey"
            columns: ["blockId"]
            isOneToOne: false
            referencedRelation: "questionBlocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticScores_blockId_fkey"
            columns: ["blockId"]
            isOneToOne: false
            referencedRelation: "vwScorePorBloco"
            referencedColumns: ["blockId"]
          },
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
      entitlements: {
        Row: {
          agendadoEm: string | null
          agendamentoRealizado: boolean
          ativo: boolean
          codigoProduto: string
          dataAgendada: string | null
          fimEm: string | null
          id: string
          inicioEm: string
          runId: string | null
          usuarioId: string
        }
        Insert: {
          agendadoEm?: string | null
          agendamentoRealizado?: boolean
          ativo?: boolean
          codigoProduto: string
          dataAgendada?: string | null
          fimEm?: string | null
          id?: string
          inicioEm?: string
          runId?: string | null
          usuarioId: string
        }
        Update: {
          agendadoEm?: string | null
          agendamentoRealizado?: boolean
          ativo?: boolean
          codigoProduto?: string
          dataAgendada?: string | null
          fimEm?: string | null
          id?: string
          inicioEm?: string
          runId?: string | null
          usuarioId?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "entitlements_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
      payments: {
        Row: {
          checkoutSessionId: string
          criadoEm: string
          id: string
          moeda: string
          pagoEm: string | null
          paymentIntentId: string | null
          provider: string
          runId: string
          status: string
          usuarioId: string
          valorCentavos: number
        }
        Insert: {
          checkoutSessionId: string
          criadoEm?: string
          id?: string
          moeda?: string
          pagoEm?: string | null
          paymentIntentId?: string | null
          provider: string
          runId: string
          status: string
          usuarioId: string
          valorCentavos: number
        }
        Update: {
          checkoutSessionId?: string
          criadoEm?: string
          id?: string
          moeda?: string
          pagoEm?: string | null
          paymentIntentId?: string | null
          provider?: string
          runId?: string
          status?: string
          usuarioId?: string
          valorCentavos?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "payments_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
      questionBlocks: {
        Row: {
          codigo: string
          criadoEm: string
          id: string
          ordem: number
          questionnaireVersionId: string
          titulo: string
        }
        Insert: {
          codigo: string
          criadoEm?: string
          id?: string
          ordem: number
          questionnaireVersionId: string
          titulo: string
        }
        Update: {
          codigo?: string
          criadoEm?: string
          id?: string
          ordem?: number
          questionnaireVersionId?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionBlocks_questionnaireVersionId_fkey"
            columns: ["questionnaireVersionId"]
            isOneToOne: false
            referencedRelation: "questionnaireVersions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaireVersions: {
        Row: {
          ativo: boolean
          criadoEm: string
          id: string
          nome: string
          versao: string
        }
        Insert: {
          ativo?: boolean
          criadoEm?: string
          id?: string
          nome: string
          versao: string
        }
        Update: {
          ativo?: boolean
          criadoEm?: string
          id?: string
          nome?: string
          versao?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          ativo: boolean
          blockId: string
          codigo: string
          criadoEm: string
          id: string
          ordem: number
          questionnaireVersionId: string
          texto: string
        }
        Insert: {
          ativo?: boolean
          blockId: string
          codigo: string
          criadoEm?: string
          id?: string
          ordem: number
          questionnaireVersionId: string
          texto: string
        }
        Update: {
          ativo?: boolean
          blockId?: string
          codigo?: string
          criadoEm?: string
          id?: string
          ordem?: number
          questionnaireVersionId?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_blockId_fkey"
            columns: ["blockId"]
            isOneToOne: false
            referencedRelation: "questionBlocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_blockId_fkey"
            columns: ["blockId"]
            isOneToOne: false
            referencedRelation: "vwScorePorBloco"
            referencedColumns: ["blockId"]
          },
          {
            foreignKeyName: "questions_questionnaireVersionId_fkey"
            columns: ["questionnaireVersionId"]
            isOneToOne: false
            referencedRelation: "questionnaireVersions"
            referencedColumns: ["id"]
          },
        ]
      }
      reportAssets: {
        Row: {
          criadoEm: string
          id: string
          runId: string
          storagePath: string
          tipo: string
        }
        Insert: {
          criadoEm?: string
          id?: string
          runId: string
          storagePath: string
          tipo: string
        }
        Update: {
          criadoEm?: string
          id?: string
          runId?: string
          storagePath?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "reportAssets_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reportAssets_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "reportAssets_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
    }
    Views: {
      vwProgressoDiagnostico: {
        Row: {
          percentualConcluido: number | null
          respostasRespondidas: number | null
          runId: string | null
          totalPerguntas: number | null
        }
        Relationships: []
      }
      vwScoreCompleto: {
        Row: {
          blocoCaixaNivel: string | null
          blocoCaixaPercentual: number | null
          blocoComprasNivel: string | null
          blocoComprasPercentual: number | null
          blocoContratosNivel: string | null
          blocoContratosPercentual: number | null
          blocoFiscalCreditoNivel: string | null
          blocoFiscalCreditoPercentual: number | null
          concluidoEm: string | null
          criadoEm: string | null
          nivelMaturidadeGeral: string | null
          percentualGeral: number | null
          runId: string | null
          status: string | null
          statusCorGeral: string | null
        }
        Relationships: []
      }
      vwScoreGeral: {
        Row: {
          calculadoEm: string | null
          nivelMaturidadeGeral: string | null
          percentualGeral: number | null
          pontosTotais: number | null
          pontosTotaisMaximos: number | null
          runId: string | null
          statusCorGeral: string | null
        }
        Insert: {
          calculadoEm?: string | null
          nivelMaturidadeGeral?: string | null
          percentualGeral?: number | null
          pontosTotais?: number | null
          pontosTotaisMaximos?: number | null
          runId?: string | null
          statusCorGeral?: string | null
        }
        Update: {
          calculadoEm?: string | null
          nivelMaturidadeGeral?: string | null
          percentualGeral?: number | null
          pontosTotais?: number | null
          pontosTotaisMaximos?: number | null
          runId?: string | null
          statusCorGeral?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
      vwScorePorBloco: {
        Row: {
          blockId: string | null
          calculadoEm: string | null
          codigoBloco: string | null
          nivelMaturidade: string | null
          percentual: number | null
          pontos: number | null
          pontosMaximos: number | null
          runId: string | null
          statusCor: string | null
          tituloBloco: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "diagnosticRuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwProgressoDiagnostico"
            referencedColumns: ["runId"]
          },
          {
            foreignKeyName: "diagnosticScores_runId_fkey"
            columns: ["runId"]
            isOneToOne: false
            referencedRelation: "vwScoreCompleto"
            referencedColumns: ["runId"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
