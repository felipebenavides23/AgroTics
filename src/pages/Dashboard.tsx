import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { mockCrops, mockInventory, mockMonitoringData } from "@/data/mockData";
import { Crop, InventoryItem } from "@/types";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem("crops");
    return saved ? JSON.parse(saved) : mockCrops;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : mockInventory;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedCrops = localStorage.getItem("crops");
      const savedInventory = localStorage.getItem("inventory");
      if (savedCrops) setCrops(JSON.parse(savedCrops));
      if (savedInventory) setInventory(JSON.parse(savedInventory));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const activeCrops = crops.filter(c => c.status === 'growing' || c.status === 'harvesting').length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock).length;
  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const estimatedYield = crops.reduce((sum, crop) => sum + (crop.yieldEstimate || 0), 0);

  const cropStatusData = [
    { name: 'En Crecimiento', value: crops.filter(c => c.status === 'growing').length },
    { name: 'En Cosecha', value: crops.filter(c => c.status === 'harvesting').length },
    { name: 'Plantados', value: crops.filter(c => c.status === 'planted').length },
    { name: 'Completados', value: crops.filter(c => c.status === 'completed').length },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Resumen general de su operación agrícola</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Cultivos Activos"
            value={activeCrops}
            icon={Leaf}
            description={`Total de ${crops.length} cultivos registrados`}
          />
          <MetricCard
            title="Área Total"
            value={`${totalArea.toFixed(1)} ha`}
            icon={TrendingUp}
            description="Hectáreas en producción"
          />
          <MetricCard
            title="Rendimiento Estimado"
            value={`${estimatedYield.toLocaleString()} kg`}
            icon={Package}
            description="Para la temporada actual"
          />
          <MetricCard
            title="Alertas de Stock"
            value={lowStockItems}
            icon={AlertTriangle}
            description={lowStockItems > 0 ? "Items requieren reposición" : "Inventario óptimo"}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Cultivos</CardTitle>
              <CardDescription>Distribución por etapa de cultivo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Condiciones Ambientales</CardTitle>
              <CardDescription>Últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockMonitoringData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="hsl(var(--chart-1))" name="Temperatura (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="hsl(var(--chart-2))" name="Humedad (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cultivos Recientes</CardTitle>
            <CardDescription>Últimos cultivos registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crops.slice(0, 3).map((crop) => (
                <div key={crop.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{crop.name} - {crop.variety}</p>
                    <p className="text-sm text-muted-foreground">
                      Área: {crop.area} ha • Estado: {crop.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      crop.healthStatus === 'excellent' ? 'text-success' :
                      crop.healthStatus === 'good' ? 'text-info' :
                      crop.healthStatus === 'fair' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {crop.healthStatus === 'excellent' ? 'Excelente' :
                       crop.healthStatus === 'good' ? 'Bueno' :
                       crop.healthStatus === 'fair' ? 'Regular' : 'Pobre'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cosecha: {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                    </p>
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

export default Dashboard;
