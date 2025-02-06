
interface HeatmapProps {
  xLabels: string[];
  yLabels: string[];
  data: Array<{
    x: number;
    y: number;
    value: number;
    mood: "happy" | "neutral" | "sad";
  }>;
}

const CustomHeatmap = ({ xLabels, yLabels, data }: HeatmapProps) => {
  const getCellContent = (x: number, y: number) => {
    const cell = data.find((d) => d.x === x && d.y === y);
    if (!cell) return null;

    const moodColors = {
      happy: "bg-emerald-500 hover:bg-emerald-600",
      neutral: "bg-amber-500 hover:bg-amber-600",
      sad: "bg-red-500 hover:bg-red-600",
    };

    const moodText = {
      happy: "Happy",
      neutral: "Neutral",
      sad: "Sad",
    };

    return (
      <div
        className={`w-full h-full ${
          moodColors[cell.mood]
        } rounded-md transition-colors
          flex items-center justify-center group relative`}
      >
        <span className="text-xs text-white font-medium">
          {moodText[cell.mood]}
        </span>

        {/* Tooltip */}
        <div
          className="absolute invisible group-hover:visible bg-gray-900 text-white 
          text-xs rounded py-1 px-2 -top-8 whitespace-nowrap z-10"
        >
          {`${yLabels[y]} - ${xLabels[x]}: ${moodText[cell.mood]}`}
        </div>
      </div>
    );
  };

  return (
    <div className="md:max-w-[700px] overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* X-axis labels */}
        <div className="flex">
          <div className="w-32" /> {/* Spacing for y-labels */}
          <div className="flex-1 flex">
            {xLabels.map((label, i) => (
              <div key={i} className="flex-1 px-1">
                <div className="text-xs text-gray-600 truncate text-center">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-2">
          {yLabels.map((yLabel, y) => (
            <div key={y} className="flex mb-2">
              {/* Y-axis label */}
              <div className="w-32 pr-2">
                <div className="text-xs text-gray-600 truncate uppercase font-bold">{yLabel}</div>
              </div>

              {/* Grid cells */}
              <div className="flex-1 flex gap-1">
                {xLabels.map((_, x) => (
                  <div key={x} className="flex-1 aspect-square">
                    {getCellContent(x, y) || (
                      <div className="w-full h-full bg-gray-100 rounded-md" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomHeatmap;
