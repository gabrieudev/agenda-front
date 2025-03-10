"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReportChartProps {
  data: Report;
  startDate: Date;
  endDate: Date;
  onStartDateChange: (startDate: Date) => void;
  onEndDateChange: (endDate: Date) => void;
}

export default function ReportChart({
  data,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: ReportChartProps) {
  
  const filteredCommitments = data.completedCommitments;
  const filteredTasks = data.completedTasks;

  const chartData = [
    {
      name: "Relatório",
      Compromissos: filteredCommitments.length,
      Tarefas: filteredTasks.length,
    },
  ];


  return (
    <Card className="w-full p-4">
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div>
            <Label htmlFor="startDate">Data Início</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => {
                if (!isNaN(new Date(e.target.value).getTime())) {
                  onStartDateChange(new Date(e.target.value));
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Data Fim</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => {
                const newEndDate = new Date(e.target.value);
                if (!isNaN(new Date(e.target.value).getTime())) {
                  onEndDateChange(new Date(e.target.value));
                }
              }}
            />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barCategoryGap={20} barGap={375}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Compromissos" fill="#4F46E5" barSize={30}/>
            <Bar dataKey="Tarefas" fill="#10B981" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
