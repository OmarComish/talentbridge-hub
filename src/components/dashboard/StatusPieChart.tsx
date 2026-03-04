import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Under Review", value: 60 },
  { name: "Shortlisted", value: 18 },
  { name: "Interviewed", value: 12 },
  { name: "Rejected", value: 35 },
  { name: "Hired", value: 20 },
];

const COLORS = [
  "hsl(217, 91%, 60%)",  // blue
  "hsl(142, 71%, 45%)",  // green
  "hsl(38, 92%, 50%)",   // amber
  "hsl(0, 84%, 60%)",    // red
  "hsl(262, 83%, 58%)",  // purple
];

export function StatusPieChart() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold text-base mb-1">Application Status</h3>
      <p className="text-sm text-muted-foreground mb-4">Breakdown by current status</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              fontSize: "13px",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
