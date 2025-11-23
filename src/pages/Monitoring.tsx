import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMonitoringData } from "@/data/mockData";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Thermometer, Droplets, Cloud, Sprout } from "lucide-react";

const Monitoring = () => {
  const latestData = mockMonitoringData[mockMonitoringData.length - 1];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Monitoreo de Cultivos</h2>
          <p className="text-muted-foreground">Seguimiento de condiciones ambientales y salud de cultivos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData.temperature}°C</div>
              <p className="text-xs text-muted-foreground">Condiciones óptimas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humedad</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData.humidity}%</div>
              <p className="text-xs text-muted-foreground">Nivel adecuado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precipitación</CardTitle>
              <Cloud className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData.rainfall} mm</div>
              <p className="text-xs text-muted-foreground">Última medición</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humedad del Suelo</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData.soilMoisture}%</div>
              <p className="text-xs text-muted-foreground">Óptimo para cultivos</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Temperatura y Humedad</CardTitle>
              <CardDescription>Tendencia de los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockMonitoringData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).getDate().toString()} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="hsl(var(--chart-1))" 
                    name="Temperatura (°C)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="hsl(var(--chart-2))" 
                    name="Humedad (%)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precipitación y Humedad del Suelo</CardTitle>
              <CardDescription>Análisis de agua disponible</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockMonitoringData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).getDate().toString()} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="rainfall" 
                    stackId="1"
                    stroke="hsl(var(--chart-3))" 
                    fill="hsl(var(--chart-3))"
                    name="Precipitación (mm)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="soilMoisture" 
                    stackId="2"
                    stroke="hsl(var(--chart-4))" 
                    fill="hsl(var(--chart-4))"
                    name="Humedad Suelo (%)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Condiciones Detalladas</CardTitle>
            <CardDescription>Historial completo de mediciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMonitoringData.slice().reverse().map((data, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="font-medium">
                    {new Date(data.date).toLocaleDateString('es-CO', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>🌡️ {data.temperature}°C</span>
                    <span>💧 {data.humidity}%</span>
                    <span>🌧️ {data.rainfall}mm</span>
                    <span>🌱 {data.soilMoisture}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Monitoring;
