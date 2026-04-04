import { create } from "zustand"
import { API_BASE_URL, apiFetch } from "@/lib/constants"

interface OptionTradeAnalysis {
    trade_analysis_id?: string
    trigger_time: string
    analysis_input_template: string
    analysis_input: string
    analysis_output_text: string
    analysis_output_json?: Record<string, unknown> | null
    analysis_output_reasoning: string | null
    total_input_tokens?: number | null
    total_output_tokens?: number | null
    reasoning_token_budget: number
    model_used: string
    processing_time_taken_in_seconds?: number | null
    entry_decider_input?: string | null
    entry_decider_output?: Record<string, unknown> | null
    entry_decider_reasoning?: string | null
    review_recommendations?: string
}

interface AnalysisStore {
    analyses: OptionTradeAnalysis[]
    loading: boolean
    error: string | null
    fetchAnalyses: () => Promise<void>
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
    analyses: [],
    loading: false,
    error: null,
    fetchAnalyses: async () => {
        set({ loading: true, error: null })
        try {
            const res = await apiFetch(`${API_BASE_URL}/analysis`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            set({ analyses: data, loading: false })
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to fetch",
                loading: false,
            })
        }
    },
}))
