import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar as CalendarIcon, Pencil, CalendarDays } from "lucide-react";
import { mockCrops } from "@/data/mockData";
import { Crop } from "@/types";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const Crops = () => {
  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem("crops");
    return saved ? JSON.parse(saved) : mockCrops;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCrop, setFormCrop] = useState<Partial<Crop>>({
    name: "",
    variety: "",
    plantingDate: "",
    expectedHarvestDate: "",
    area: 0,
    status: "planted",
    healthStatus: "good",
    yieldEstimate: 0,
  });

  useEffect(() => {
    localStorage.setItem("crops", JSON.stringify(crops));
  }, [crops]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planted: 'Plantado',
      growing: 'En Crecimiento',
      harvesting: 'En Cosecha',
      completed: 'Completado',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      planted: 'secondary',
      growing: 'default',
      harvesting: 'outline',
      completed: 'secondary',
    };
    return variants[status] || 'default';
  };

  const getHealthColor = (health: string) => {
    const colors: Record<string, string> = {
      excellent: 'text-success',
      good: 'text-info',
      fair: 'text-warning',
      poor: 'text-destructive',
    };
    return colors[health] || '';
  };

  const getHealthLabel = (health: string) => {
    const labels: Record<string, string> = {
      excellent: 'Excelente',
      good: 'Bueno',
      fair: 'Regular',
      poor: 'Pobre',
    };
    return labels[health] || health;
  };

  const handleOpenDialog = (crop?: Crop) => {
    if (crop) {
      setEditingId(crop.id);
      setFormCrop({
        name: crop.name,
        variety: crop.variety,
        plantingDate: crop.plantingDate,
        expectedHarvestDate: crop.expectedHarvestDate,
        area: crop.area,
        status: crop.status,
        healthStatus: crop.healthStatus,
        yieldEstimate: crop.yieldEstimate || 0,
      });
    } else {
      setEditingId(null);
      setFormCrop({
        name: "",
        variety: "",
        plantingDate: "",
        expectedHarvestDate: "",
        area: 0,
        status: "planted",
        healthStatus: "good",
        yieldEstimate: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleSaveCrop = () => {
    if (!formCrop.name || !formCrop.variety || !formCrop.plantingDate || !formCrop.expectedHarvestDate || !formCrop.area) {
      toast({
        title: "Error",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Actualizar cultivo existente
      const updatedCrops = crops.map((crop) =>
        crop.id === editingId
          ? {
              ...crop,
              name: formCrop.name!,
              variety: formCrop.variety!,
              plantingDate: formCrop.plantingDate!,
              expectedHarvestDate: formCrop.expectedHarvestDate!,
              area: formCrop.area!,
              status: (formCrop.status as Crop["status"]) || "planted",
              healthStatus: (formCrop.healthStatus as Crop["healthStatus"]) || "good",
              yieldEstimate: formCrop.yieldEstimate || undefined,
            }
          : crop
      );
      setCrops(updatedCrops);
      toast({
        title: "Cultivo actualizado",
        description: `${formCrop.name} ha sido actualizado exitosamente`,
      });
    } else {
      // Agregar nuevo cultivo
      const newCrop: Crop = {
        id: `crop-${Date.now()}`,
        name: formCrop.name!,
        variety: formCrop.variety!,
        plantingDate: formCrop.plantingDate!,
        expectedHarvestDate: formCrop.expectedHarvestDate!,
        area: formCrop.area!,
        status: (formCrop.status as Crop["status"]) || "planted",
        healthStatus: (formCrop.healthStatus as Crop["healthStatus"]) || "good",
        yieldEstimate: formCrop.yieldEstimate || undefined,
      };
      setCrops([...crops, newCrop]);
      toast({
        title: "Cultivo agregado",
        description: `${newCrop.name} ha sido agregado exitosamente`,
      });
    }

    setDialogOpen(false);
    setEditingId(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Planificación de Cultivos</h2>
            <p className="text-muted-foreground">Gestione y planifique sus cultivos</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4" />
                Nuevo Cultivo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Cultivo" : "Nuevo Cultivo"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Modifique los datos del cultivo" : "Complete los datos del nuevo cultivo"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del Cultivo *</Label>
                    <Input
                      id="name"
                      value={formCrop.name}
                      onChange={(e) => setFormCrop({ ...formCrop, name: e.target.value })}
                      placeholder="Ej: Papa Criolla"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="variety">Variedad *</Label>
                    <Input
                      id="variety"
                      value={formCrop.variety}
                      onChange={(e) => setFormCrop({ ...formCrop, variety: e.target.value })}
                      placeholder="Ej: Parda Pastusa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="plantingDate">Fecha de Siembra *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !formCrop.plantingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {formCrop.plantingDate ? format(new Date(formCrop.plantingDate), "PPP") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formCrop.plantingDate ? new Date(formCrop.plantingDate) : undefined}
                          onSelect={(date) => setFormCrop({ ...formCrop, plantingDate: date ? format(date, "yyyy-MM-dd") : "" })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expectedHarvestDate">Fecha de Cosecha Esperada *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !formCrop.expectedHarvestDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {formCrop.expectedHarvestDate ? format(new Date(formCrop.expectedHarvestDate), "PPP") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formCrop.expectedHarvestDate ? new Date(formCrop.expectedHarvestDate) : undefined}
                          onSelect={(date) => setFormCrop({ ...formCrop, expectedHarvestDate: date ? format(date, "yyyy-MM-dd") : "" })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="area">Área (hectáreas) *</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      value={formCrop.area}
                      onChange={(e) => setFormCrop({ ...formCrop, area: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="yieldEstimate">Rendimiento Estimado (kg)</Label>
                    <Input
                      id="yieldEstimate"
                      type="number"
                      value={formCrop.yieldEstimate}
                      onChange={(e) => setFormCrop({ ...formCrop, yieldEstimate: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Estado del Cultivo *</Label>
                    <Select
                      value={formCrop.status}
                      onValueChange={(value) => setFormCrop({ ...formCrop, status: value as Crop["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planted">Plantado</SelectItem>
                        <SelectItem value="growing">En Crecimiento</SelectItem>
                        <SelectItem value="harvesting">En Cosecha</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="healthStatus">Estado de Salud *</Label>
                    <Select
                      value={formCrop.healthStatus}
                      onValueChange={(value) => setFormCrop({ ...formCrop, healthStatus: value as Crop["healthStatus"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione salud" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excelente</SelectItem>
                        <SelectItem value="good">Bueno</SelectItem>
                        <SelectItem value="fair">Regular</SelectItem>
                        <SelectItem value="poor">Pobre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCrop}>
                  {editingId ? "Actualizar" : "Agregar Cultivo"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {crops.map((crop) => (
            <Card key={crop.id} className="overflow-hidden">
              <CardHeader className="bg-accent/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <CardDescription>{crop.variety}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(crop.status)}>
                      {getStatusLabel(crop.status)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(crop)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Área:</span>
                    <span className="font-medium">{crop.area} hectáreas</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estado de Salud:</span>
                    <span className={`font-medium ${getHealthColor(crop.healthStatus)}`}>
                      {getHealthLabel(crop.healthStatus)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rendimiento Est.:</span>
                    <span className="font-medium">{crop.yieldEstimate?.toLocaleString()} kg</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mt-0.5" />
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Siembra:</span>{' '}
                          {new Date(crop.plantingDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Cosecha esperada:</span>{' '}
                          {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Crops;
