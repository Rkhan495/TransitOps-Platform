import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function VehicleStatusChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={4}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.color}
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{
            fontSize: 14,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default VehicleStatusChart;