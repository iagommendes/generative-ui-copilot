type WeatherCardProps = {
  city: string;
  temperatureC: number;
  condition: string;
};

/** Componente generativo de exemplo — tool `showWeather`. */
export function WeatherCard({
  city,
  temperatureC,
  condition,
}: WeatherCardProps) {
  return (
    <div className="flex max-w-xs items-end justify-between gap-6 border-b border-border/80 pb-3">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {city}
        </p>
        <p className="text-sm text-foreground/80">{condition}</p>
      </div>
      <p className="font-mono text-3xl font-medium tracking-tight tabular-nums">
        {temperatureC}°
      </p>
    </div>
  );
}
