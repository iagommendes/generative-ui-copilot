export type SalesComparison = {
  title: string;
  labels: string[];
  values: number[];
  source: string;
};

export type WeatherSnapshot = {
  city: string;
  temperatureC: number;
  condition: string;
  source: string;
};

export type SalesTable = {
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
  source: string;
};

/** Datasets mock — substituídos por servers MCP reais no roadmap. */
const SALES_BY_PERIOD: Record<string, SalesComparison> = {
  trimestre: {
    title: "Vendas por trimestre",
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values: [124, 158, 142, 191],
    source: "mcp://mock/sales/quarterly",
  },
  mensal: {
    title: "Vendas mensais (últimos 6 meses)",
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    values: [42, 48, 51, 47, 55, 62],
    source: "mcp://mock/sales/monthly",
  },
  default: {
    title: "Comparativo de vendas",
    labels: ["Norte", "Sul", "Leste", "Oeste"],
    values: [86, 112, 97, 74],
    source: "mcp://mock/sales/regions",
  },
};

const WEATHER_BY_CITY: Record<string, WeatherSnapshot> = {
  "são paulo": {
    city: "São Paulo",
    temperatureC: 24,
    condition: "Parcialmente nublado",
    source: "mcp://mock/weather/sao-paulo",
  },
  "rio de janeiro": {
    city: "Rio de Janeiro",
    temperatureC: 29,
    condition: "Ensolarado",
    source: "mcp://mock/weather/rio",
  },
  curitiba: {
    city: "Curitiba",
    temperatureC: 17,
    condition: "Chuvisco",
    source: "mcp://mock/weather/curitiba",
  },
  default: {
    city: "São Paulo",
    temperatureC: 24,
    condition: "Parcialmente nublado",
    source: "mcp://mock/weather/default",
  },
};

export function getSalesComparison(period?: string): SalesComparison {
  const key = (period ?? "default").toLowerCase();
  if (key.includes("trim") || key.includes("quart")) {
    return SALES_BY_PERIOD.trimestre;
  }
  if (key.includes("mes") || key.includes("mês") || key.includes("month")) {
    return SALES_BY_PERIOD.mensal;
  }
  return SALES_BY_PERIOD.default;
}

export function getWeatherSnapshot(city?: string): WeatherSnapshot {
  const key = (city ?? "default").toLowerCase().trim();
  return WEATHER_BY_CITY[key] ?? {
    ...WEATHER_BY_CITY.default,
    city: city?.trim() || WEATHER_BY_CITY.default.city,
  };
}

export function getSalesTable(period?: string): SalesTable {
  const sales = getSalesComparison(period);
  return {
    title: `${sales.title} (tabela)`,
    columns: ["Dimensão", "Valor"],
    rows: sales.labels.map((label, index) => [label, sales.values[index] ?? 0]),
    source: sales.source.replace("sales", "sales-table"),
  };
}
