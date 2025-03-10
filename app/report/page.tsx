'use client'

import { ProtectedRoute } from "@/components/protected-route";
import ReportChart from "@/components/report/chart";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ReportPage() {

  const [userId, setUserId] = useState("")
  const [report, setReport] = useState<Report | null>(null)
  const [startDate, setStarDate] = useState<Date>(new Date("2025-01-01"))
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now()))

  useEffect(() => {
    api.getMe().then((data) => {
      setUserId(data.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return; 

    const reportRequest: ReportRequestBody = {
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    };

    api.createReport(reportRequest).then((data) => {
      setReport(data);
    }).catch(()=> {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Data inválida",
      })
    });
  }, [userId, startDate, endDate]);
  
  const handleStartDateChange = (newStartDate: Date) => {
    setStarDate(newStartDate)
  }

  const handleEndDateChange = (newEndDate: Date) => {
    setEndDate(newEndDate)
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Atividades finalizadas</h1>
          {report ? (
          <ReportChart 
            data={report} 
            startDate={startDate} 
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            >
          </ReportChart>
        ) : (
          <p className="text-muted-foreground">Você não tem nenhum relatório.</p>
        )}
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
