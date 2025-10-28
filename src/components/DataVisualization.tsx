import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface VisualizationData {
  type: "bar" | "line" | "pie";
  data: Array<{ label: string; value: number }>;
}

interface DataVisualizationProps {
  data: VisualizationData;
}

const COLORS = ['#7C3AED', '#6366F1', '#8B5CF6', '#A78BFA', '#C4B5FD'];

export const DataVisualization = ({ data }: DataVisualizationProps) => {
  const chartData = data.data.map(item => ({
    name: item.label,
    value: item.value,
  }));

  if (data.type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#7C3AED" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (data.type === "line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (data.type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#7C3AED"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
};