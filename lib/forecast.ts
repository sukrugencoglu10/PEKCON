export interface DailyDemandPoint {
  date: string;
  demand: number;
  container_type: string;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  predicted?: number;
  lower?: number;
  upper?: number;
  is_forecast: boolean;
}

export interface ContainerForecast {
  container_type: string;
  points: ForecastPoint[];
  trend: 'yukseliyor' | 'dusuyor' | 'sabit';
  trend_percent: number;
  avg_demand_30d: number;
  predicted_30d: number;
  predicted_60d: number;
  predicted_90d: number;
}

export interface DayOfWeekIndex {
  dow: number;
  index: number;
  label: string;
}

const DOW_LABELS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function getDow(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00Z').getUTCDay();
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function stddev(arr: number[], mu?: number): number {
  if (arr.length < 2) return 0;
  const m = mu ?? mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

export function smoothTimeSeries(points: number[], window = 7): number[] {
  return points.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = points.slice(start, i + 1);
    return mean(slice);
  });
}

export function linearRegression(y: number[]): { slope: number; intercept: number; residualStd: number } {
  const n = y.length;
  if (n < 2) return { slope: 0, intercept: y[0] ?? 0, residualStd: 0 };

  const xMean = (n - 1) / 2;
  const yMean = mean(y);

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (y[i] - yMean);
    den += (i - xMean) ** 2;
  }

  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;

  const residuals = y.map((v, i) => v - (intercept + slope * i));
  const residualStd = stddev(residuals, 0);

  return { slope, intercept, residualStd };
}

export function computeDowIndices(points: DailyDemandPoint[]): DayOfWeekIndex[] {
  const buckets: number[][] = [[], [], [], [], [], [], []];
  for (const p of points) {
    buckets[getDow(p.date)].push(p.demand);
  }
  const overall = mean(points.map((p) => p.demand));
  if (overall === 0) {
    return DOW_LABELS.map((label, dow) => ({ dow, index: 1, label }));
  }
  return DOW_LABELS.map((label, dow) => ({
    dow,
    index: buckets[dow].length > 0 ? mean(buckets[dow]) / overall : 1,
    label,
  }));
}

export function fillDateGaps(points: DailyDemandPoint[], containerType: string): DailyDemandPoint[] {
  if (points.length === 0) return [];
  const map = new Map(points.map((p) => [p.date, p.demand]));
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const result: DailyDemandPoint[] = [];
  let cur = sorted[0].date;
  const end = sorted[sorted.length - 1].date;
  while (cur <= end) {
    result.push({ date: cur, demand: map.get(cur) ?? 0, container_type: containerType });
    cur = addDays(cur, 1);
  }
  return result;
}

export function forecastDemand(
  historical: DailyDemandPoint[],
  horizonDays: number,
  dowIndices: DayOfWeekIndex[],
): ForecastPoint[] {
  const filled = fillDateGaps(historical, historical[0]?.container_type ?? '');
  const smoothed = smoothTimeSeries(filled.map((p) => p.demand));
  const { slope, intercept, residualStd } = linearRegression(smoothed);
  const n = filled.length;
  const lastDate = filled[n - 1]?.date ?? new Date().toISOString().slice(0, 10);
  const result: ForecastPoint[] = [];
  for (let i = 1; i <= horizonDays; i++) {
    const date = addDays(lastDate, i);
    const dow = getDow(date);
    const base = Math.max(0, intercept + slope * (n - 1 + i));
    const seasonal = dowIndices[dow]?.index ?? 1;
    const predicted = Math.max(0, base * seasonal);
    result.push({
      date,
      predicted: Math.round(predicted * 100) / 100,
      lower: Math.max(0, Math.round((predicted - 1.96 * residualStd) * 100) / 100),
      upper: Math.round((predicted + 1.96 * residualStd) * 100) / 100,
      is_forecast: true,
    });
  }
  return result;
}

export function detectTrend(points: number[]): { trend: 'yukseliyor' | 'dusuyor' | 'sabit'; percent: number } {
  if (points.length < 4) return { trend: 'sabit', percent: 0 };
  const half = Math.floor(points.length / 2);
  const first = mean(points.slice(0, half));
  const second = mean(points.slice(half));
  const percent = first === 0 ? 0 : ((second - first) / first) * 100;
  const trend = percent > 10 ? 'yukseliyor' : percent < -10 ? 'dusuyor' : 'sabit';
  return { trend, percent: Math.round(percent * 10) / 10 };
}

export function buildContainerForecasts(
  rawPoints: DailyDemandPoint[],
  horizonDays: number,
): ContainerForecast[] {
  const byType = new Map<string, DailyDemandPoint[]>();
  for (const p of rawPoints) {
    const key = p.container_type || 'Belirtilmemiş';
    if (!byType.has(key)) byType.set(key, []);
    byType.get(key)!.push(p);
  }

  const result: ContainerForecast[] = [];
  for (const [containerType, typePoints] of byType) {
    const filled = fillDateGaps(typePoints, containerType);
    const nonZero = filled.filter((p) => p.demand > 0).length;
    const dowIndices = computeDowIndices(filled);

    const historicalPoints: ForecastPoint[] = filled.map((p) => ({
      date: p.date,
      actual: p.demand,
      is_forecast: false,
    }));

    let forecastPoints: ForecastPoint[] = [];
    let trendInfo: { trend: 'yukseliyor' | 'dusuyor' | 'sabit'; percent: number } = { trend: 'sabit', percent: 0 };

    if (nonZero >= 3) {
      forecastPoints = forecastDemand(filled, horizonDays, dowIndices);
      trendInfo = detectTrend(filled.map((p) => p.demand));
    } else {
      const flatVal = nonZero > 0 ? mean(filled.filter((p) => p.demand > 0).map((p) => p.demand)) : 0;
      const lastDate = filled[filled.length - 1]?.date ?? new Date().toISOString().slice(0, 10);
      for (let i = 1; i <= horizonDays; i++) {
        forecastPoints.push({
          date: addDays(lastDate, i),
          predicted: flatVal,
          lower: 0,
          upper: flatVal * 2,
          is_forecast: true,
        });
      }
    }

    const now = new Date().toISOString().slice(0, 10);
    const last30 = filled.filter((p) => p.date >= addDays(now, -30));
    const avg_demand_30d = last30.length > 0 ? mean(last30.map((p) => p.demand)) : 0;

    const sum = (pts: ForecastPoint[], days: number) =>
      pts.slice(0, days).reduce((s, p) => s + (p.predicted ?? 0), 0);

    result.push({
      container_type: containerType,
      points: [...historicalPoints, ...forecastPoints],
      trend: trendInfo.trend,
      trend_percent: trendInfo.percent,
      avg_demand_30d: Math.round(avg_demand_30d * 10) / 10,
      predicted_30d: Math.round(sum(forecastPoints, 30) * 10) / 10,
      predicted_60d: Math.round(sum(forecastPoints, 60) * 10) / 10,
      predicted_90d: Math.round(sum(forecastPoints, 90) * 10) / 10,
    });
  }

  return result.sort((a, b) => b.avg_demand_30d - a.avg_demand_30d);
}
