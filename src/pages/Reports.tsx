import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Calendar } from "lucide-react";
import { mockCrops, mockInventory } from "@/data/mockData";

const Reports = () => {
  const totalCrops = mockCrops.length;
  const totalArea = mockCrops.reduce((sum, crop) => sum + crop.area, 0);
  const totalYield = mockCrops.reduce((sum, crop) => sum + (crop.yieldEstimate || 0), 0);
  const totalInventoryValue = mockInventory.reduce((sum, item) => sum + (item.cost || 0), 0);

  const reports = [
    {
      title: "Reporte de Producción",
      description: "Resumen completo de cultivos y rendimientos",
      icon: BarChart3,
      data: [
        { label: "Total de Cultivos", value: totalCrops },
        { label: "Área Total", value: `${totalArea.toFixed(1)} ha` },
        { label: "Rendimiento Estimado", value: `${totalYield.toLocaleString()} kg` },
        { label: "Rendimiento por Hectárea", value: `${(totalYield / totalArea).toFixed(0)} kg/ha` },
      ],
    },
    {
      title: "Reporte de Inventario",
      description: "Estado actual de productos e insumos",
      icon: FileText,
      data: [
        { label: "Total Items", value: mockInventory.length },
        { label: "Valor Total", value: `$${totalInventoryValue.toLocaleString()}` },
        { label: "Items con Stock Bajo", value: mockInventory.filter(i => i.quantity <= i.minStock).length },
        { label: "Categorías", value: new Set(mockInventory.map(i => i.category)).size },
      ],
    },
    {
      title: "Reporte de Planificación",
      description: "Calendario de siembra y cosecha",
      icon: Calendar,
      data: [
        { label: "Cultivos en Crecimiento", value: mockCrops.filter(c => c.status === 'growing').length },
        { label: "Cultivos en Cosecha", value: mockCrops.filter(c => c.status === 'harvesting').length },
        { label: "Próximas Cosechas (30 días)", value: mockCrops.filter(c => {
          const harvestDate = new Date(c.expectedHarvestDate);
          const today = new Date();
          const diffDays = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 30 && diffDays >= 0;
        }).length },
        { label: "Salud Promedio", value: "Buena" },
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Reportes</h2>
            <p className="text-muted-foreground">Genere y descargue informes detallados</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Todo
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {reports.map((report, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <report.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                  <Button className="w-full mt-4" variant="secondary">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Reporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Ejecutivo</CardTitle>
            <CardDescription>Vista general de la operación agrícola</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Producción</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {mockCrops.filter(c => c.status === 'growing').length} cultivos en fase de crecimiento</li>
                    <li>• {mockCrops.filter(c => c.status === 'harvesting').length} cultivos listos para cosecha</li>
                    <li>• Rendimiento esperado total: {totalYield.toLocaleString()} kg</li>
                    <li>• Área productiva: {totalArea.toFixed(1)} hectáreas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Inventario</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {mockInventory.length} items registrados en el sistema</li>
                    <li>• {mockInventory.filter(i => i.quantity <= i.minStock).length} alertas de stock bajo</li>
                    <li>• Valor total de inventario: ${totalInventoryValue.toLocaleString()}</li>
                    <li>• {mockInventory.filter(i => i.category === 'harvest').length} productos cosechados</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-foreground mb-2">Recomendaciones</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Revisar items con stock bajo para planificar reposición</li>
                  <li>✓ Monitorear cultivos con estado de salud "Regular" o inferior</li>
                  <li>✓ Preparar logística para las cosechas programadas en los próximos 30 días</li>
                  <li>✓ Actualizar registros de inventario después de cada aplicación de insumos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
