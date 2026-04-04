import { create } from "zustand"
import { API_BASE_URL, apiFetch } from "@/lib/constants"

export interface OHLCCandle {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface OptionTradeAnalysisTradeLeg {
  trade_leg_id?: string
  trade_id: string
  trade_leg_type: string
  trade_leg_direction: string
  trade_leg_strike: number
  trade_leg_premium: number
  lots_to_trade: number
}

export interface OptionTradeAnalysisTrade {
  trade_id?: string
  trade_analysis_id: string
  trade_strategy: string
  trade_entry_timestamp: string
  trade_exit_timestamp?: string
  trade_net_entry_premium: number
  trade_net_exit_premium?: number
  trade_net_sl: number
  trade_net_target: number
  trade_net_trail_trigger?: number
  trade_exit_reason?: string
  analysis_trigger_time?: string
  model_used?: string
  lots_to_trade?: number
  funds_needed?: number | null
  max_profit_at_exit?: number | null
  max_profit_at_expiry?: number | null
  max_loss_at_exit?: number | null
  max_loss_at_expiry?: number | null
  legs?: OptionTradeAnalysisTradeLeg[]
}

export interface LegSnapshotData {
  trade_leg_id: string
  live_premium?: number | null
  delta?: number | null
  theta?: number | null
  gamma?: number | null
  vega?: number | null
  implied_volatility?: number | null
}

export interface TradeSnapshot {
  snapshot_id?: string
  trade_id: string
  captured_at?: string
  net_premium: number
  legs_data: LegSnapshotData[]
}

export interface TradeStats {
  todayPnl: number
  totalPnl: number
  maxDrawdown: number
  winRate: number
  closedCount: number
  openCount: number
}

const LOT_SIZE = 65

function calcTradePnl(trade: OptionTradeAnalysisTrade): number | null {
  if (trade.trade_net_exit_premium == null) return null
  const entry = trade.trade_net_entry_premium
  const exit = trade.trade_net_exit_premium
  const lots = trade.lots_to_trade ?? 1
  // Credit (entry > 0): profit = entry - exit (buy back cheaper)
  // Debit (entry < 0): profit = exit - |entry| = exit + entry
  const pnl_per_unit = entry >= 0 ? entry - exit : exit + entry
  return pnl_per_unit * lots * LOT_SIZE
}

function getDatePart(dateStr: string): string {
  // DB stores "yyyy-MM-dd HH:mm:ss" in IST — extract date portion directly
  return dateStr.replace('T', ' ').split(' ')[0]
}

function computeStats(trades: OptionTradeAnalysisTrade[]): TradeStats {
  const today_ist = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) // 'yyyy-MM-dd'

  const closed = trades.filter((t) => t.trade_exit_timestamp != null)
  const open = trades.filter((t) => t.trade_exit_timestamp == null)

  const today_closed = closed.filter((t) => {
    return getDatePart(t.trade_entry_timestamp) === today_ist
  })

  let totalPnl = 0
  let todayPnl = 0
  let winCount = 0

  for (const t of closed) {
    const pnl = calcTradePnl(t)
    if (pnl == null) continue
    totalPnl += pnl
    if (pnl > 0) winCount++
  }

  for (const t of today_closed) {
    const pnl = calcTradePnl(t)
    if (pnl != null) todayPnl += pnl
  }

  // Max drawdown: peak-to-trough of cumulative PNL (trades sorted oldest-first)
  const sorted = [...closed].sort(
    (a, b) => a.trade_entry_timestamp.localeCompare(b.trade_entry_timestamp)
  )
  let peak = 0
  let cumulative = 0
  let maxDrawdown = 0
  for (const t of sorted) {
    const pnl = calcTradePnl(t)
    if (pnl == null) continue
    cumulative += pnl
    if (cumulative > peak) peak = cumulative
    const dd = peak - cumulative
    if (dd > maxDrawdown) maxDrawdown = dd
  }

  const winRate = closed.length > 0 ? (winCount / closed.length) * 100 : 0

  return {
    todayPnl,
    totalPnl,
    maxDrawdown,
    winRate,
    closedCount: closed.length,
    openCount: open.length,
  }
}

export interface TradesStore {
  trades: OptionTradeAnalysisTrade[]
  legs: Record<string, OptionTradeAnalysisTradeLeg[]>
  loading: boolean
  error: string | null
  niftyCandles: OHLCCandle[]
  niftyLoading: boolean
  livePnl: Record<string, number | null>
  legCharts: Record<string, OHLCCandle[]>
  snapshots: Record<string, TradeSnapshot[]>
  fetchTrades: () => Promise<void>
  fetchLegs: (tradeId: string) => Promise<void>
  fetchNiftyChart: () => Promise<void>
  fetchLivePnl: (tradeId: string) => Promise<void>
  fetchLegCharts: (tradeId: string) => Promise<void>
  fetchSnapshots: (tradeId: string) => Promise<void>
  getStats: () => TradeStats
  getTodayTrades: () => OptionTradeAnalysisTrade[]
}

export const useTradesStore = create<TradesStore>((set, get) => ({
  trades: [],
  legs: {},
  loading: false,
  error: null,
  niftyCandles: [],
  niftyLoading: false,
  livePnl: {},
  legCharts: {},
  snapshots: {},

  fetchTrades: async () => {
    set({ loading: true, error: null })
    try {
      const res = await apiFetch(`${API_BASE_URL}/trades`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      set({ trades: data, loading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to fetch", loading: false })
    }
  },

  fetchLegs: async (tradeId: string) => {
    const { legs } = get()
    if (legs[tradeId]) return
    try {
      const res = await apiFetch(`${API_BASE_URL}/trades/${tradeId}/legs`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      set((state) => ({
        legs: { ...state.legs, [tradeId]: data },
      }))
    } catch (err) {
      console.error(`Failed to fetch legs for trade ${tradeId}:`, err)
    }
  },

  fetchNiftyChart: async () => {
    set({ niftyLoading: true })
    try {
      const res = await apiFetch(`${API_BASE_URL}/nifty/chart`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      set({ niftyCandles: data, niftyLoading: false })
    } catch (err) {
      console.error("Failed to fetch Nifty chart:", err)
      set({ niftyLoading: false })
    }
  },

  fetchLivePnl: async (tradeId: string) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/trades/${tradeId}/live-pnl`)
      if (!res.ok) return
      const data = await res.json()
      set((state) => ({
        livePnl: { ...state.livePnl, [tradeId]: data.unrealized_pnl ?? null },
      }))
    } catch (err) {
      console.error(`Failed to fetch live PNL for trade ${tradeId}:`, err)
    }
  },

  fetchLegCharts: async (tradeId: string) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/trades/${tradeId}/legs-chart`)
      if (!res.ok) return
      const data: { trade_leg_id: string; candles: OHLCCandle[] }[] = await res.json()
      set((state) => ({
        legCharts: {
          ...state.legCharts,
          ...Object.fromEntries(data.map((x) => [x.trade_leg_id, x.candles])),
        },
      }))
    } catch (err) {
      console.error(`Failed to fetch leg charts for trade ${tradeId}:`, err)
    }
  },

  fetchSnapshots: async (tradeId: string) => {
    const { snapshots } = get()
    if (snapshots[tradeId]) return
    try {
      const res = await apiFetch(`${API_BASE_URL}/trades/${tradeId}/snapshots`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      set((state) => ({
        snapshots: { ...state.snapshots, [tradeId]: data },
      }))
    } catch (err) {
      console.error(`Failed to fetch snapshots for trade ${tradeId}:`, err)
    }
  },

  getStats: () => computeStats(get().trades),

  getTodayTrades: () => {
    const today_ist = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
    return get().trades.filter((t) => getDatePart(t.trade_entry_timestamp) === today_ist)
  },
}))
