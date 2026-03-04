import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", applicants: 18 },
  { month: "Feb", applicants: 25 },
  { month: "Mar", applicants: 20 },
  { month: "Apr", applicants: 32 },
  { month: "May", applicants: 28 },
  { month: "Jun", applicants: 40 },
  { month: "Jul", applicants: 35 },
];

export function ApplicantsChart() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold text-base mb-1">Applicants Over Time</h3>
      <p className="text-sm text-muted-foreground mb-4">Monthly applicant volume</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              fontSize: "13px",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
            }}
          />
          <Bar dataKey="applicants" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
