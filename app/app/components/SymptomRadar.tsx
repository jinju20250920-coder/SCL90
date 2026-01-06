"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SymptomRadarProps {
  factorResults: {
    name: string;
    avgScore: number;
    level: string;
  }[];
}

export default function SymptomRadar({ factorResults }: SymptomRadarProps) {
  // 准备雷达图数据
  const data = factorResults.map(factor => ({
    subject: factor.name,
    score: factor.avgScore,
    fullMark: 5
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            className="text-xs"
            tick={{ fontSize: 10, fill: '#666' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fontSize: 9, fill: '#999' }}
            tickCount={6}
          />
          <Radar
            name="症状指数"
            dataKey="score"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
