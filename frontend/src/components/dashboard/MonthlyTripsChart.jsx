import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MonthlyTripsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -15,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E2E8F0"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{
            fill: "#64748B",
            fontSize: 13,
          }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{
            fill: "#64748B",
            fontSize: 13,
          }}
        />

        <Tooltip
          cursor={{
            fill: "#F8FAFC",
          }}
        />

        <Bar
          dataKey="trips"
          radius={[8, 8, 0, 0]}
          fill="#F97316"
          barSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyTripsChart;