"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyRevenueData } from "@/lib/dummyData";
import { dummyCategorySalesData } from "@/lib/dummyData";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(245, 58%, 51%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(340, 75%, 55%)",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold">{payload[0].name}</p>
        <p className="text-xs text-muted-foreground">{payload[0].value}% of sales</p>
      </div>
    );
  }
  return null;
};

export default function ProfitLossChart() {
  const totalRevenue = dummyRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = dummyRevenueData.reduce((sum, d) => sum + d.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Sales by Category</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dummyCategorySalesData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {dummyCategorySalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                formatter={(value) => <span className="text-foreground text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}