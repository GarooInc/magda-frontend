import type { CSSProperties } from "react";
import { scaleTime, scaleLinear, max, min, line as d3_line } from "d3";

interface DataPoint {
  fecha: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  title?: string;
  color?: string;
  yAxisLabel?: string;
}

export default function LiveIndicesChart({ 
  data = [
    { "fecha": "18-09-2025", "value": 0.6577862286882624 },
    { "fecha": "23-09-2025", "value": 0.5122272543118771 },
    { "fecha": "28-09-2025", "value": 0.7998030868544184 }
  ],
  title = "Índice de Vegetación",
  color = "orange",
  yAxisLabel = ""
}: Props) {
  const parsedData = data.map((d) => {
    const [day, month, year] = d.fecha.split("-");
    const dd = Number(day);
    const mm = Number(month) - 1; 
    const yy = Number(year);
    return { ...d, date: new Date(yy, mm, dd) };

  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  if (parsedData.length === 0) return null;

  // Escalas X (tiempo)
  const xScale = scaleTime()
    .domain([parsedData[0].date, parsedData[parsedData.length - 1].date])
    .range([0, 100]);

  // Escalas Y
  const yScale = scaleLinear()
    .domain([
      min(parsedData.map((d) => d.value)) ?? 0,
      max(parsedData.map((d) => d.value)) ?? 1
    ])
    .range([100, 0])
    .nice();

  // Línea
  const lineGenerator = d3_line<typeof parsedData[number]>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  const linePath = lineGenerator(parsedData);

  if (!linePath) return null;

  // Colores según el tipo
  const colorClasses = {
    orange: {
      stroke: "stroke-orange-500",
      fill: "fill-orange-600",
    },
    blue: {
      stroke: "stroke-[#200085]",
      fill: "fill-[#200085]",
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.orange;

  return (
    <div className="w-full max-w-md">
      <div>
        <h2 className="text-md font-semibold mb-4 text-gray-800">{title}</h2>
        <div
          className="relative h-80 w-full bg-white rounded-lg shadow p-10"
          style={{
            "--marginTop": "10px",
            "--marginRight": "20px",
            "--marginBottom": "35px",
            "--marginLeft": "50px",
          } as CSSProperties}
        >
          {/* Eje Y */}
          <div className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[var(--marginLeft)] translate-y-[var(--marginTop)]">
            {yScale.ticks(6).map((value, i) => (
              <div
                key={i}
                style={{ top: `${yScale(value)}%` }}
                className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-600 w-full text-right pr-3"
              >
                {value.toFixed(3)}
              </div>
            ))}
            {yAxisLabel && (
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-gray-600 font-medium whitespace-nowrap">
                {yAxisLabel}
              </div>
            )}
          </div>

          {/* Área de la gráfica */}
          <div className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)]">
            <svg viewBox="0 0 100 100" className="overflow-visible w-full h-full" preserveAspectRatio="none">
              {/* Líneas de cuadrícula */}
              {yScale.ticks(6).map((value, i) => (
                <g transform={`translate(0,${yScale(value)})`} className="text-gray-200" key={i}>
                  <line x1={0} x2={100} stroke="currentColor" strokeDasharray="4,4" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
                </g>
              ))}

              {/* Línea */}
              <path d={linePath} fill="none" className={colors.stroke} strokeWidth="3" vectorEffect="non-scaling-stroke" />

              {/* Puntos */}
              {parsedData.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={xScale(d.date)}
                    cy={yScale(d.value)}
                    r="1.5"
                    className={colors.fill}
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Tooltip hover area */}
                  <title>
                    {d.date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}: {d.value.toFixed(4)}
                  </title>
                </g>
              ))}
            </svg>

            {/* Eje X */}
            <div className="translate-y-2 w-full">
              {parsedData.map((d, i) => (
                <div
                  key={i}
                  style={{
                    left: `${xScale(d.date)}%`,
                    top: "100%",
                    transform: `translateX(${i === 0 ? "0%" : i === parsedData.length - 1 ? "-100%" : "-50%"})`,
                  }}
                  className="text-xs absolute text-gray-600 min-w-10"
                >
                  {d.date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}