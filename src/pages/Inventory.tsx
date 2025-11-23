import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, AlertCircle, Pencil } from "lucide-react";
import { mockInventory } from "@/data/mockData";
import { InventoryItem } from "@/types";
import { toast } from "@/hooks/use-toast";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : mockInventory;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formItem, setFormItem] = useState<Partial<InventoryItem>>({
    name: "",
    category: "seeds",
    quantity: 0,
    unit: "",
    minStock: 0,
    supplier: "",
    cost: 0,
  });

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      seeds: 'Semillas',
      fertilizers: 'Fertilizantes',
      pesticides: 'Pesticidas',
      tools: 'Herramientas',
      harvest: 'Cosecha',
    };
    return labels[category] || category;
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryLabel(item.category).toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    item.quantity.toString().includes(searchTerm) ||
    item.minStock.toString().includes(searchTerm) ||
    (item.cost?.toString().includes(searchTerm) || false) ||
    item.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLowStock = (item: InventoryItem) => item.quantity <= item.minStock;

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingId(item.id);
      setFormItem({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        minStock: item.minStock,
        supplier: item.supplier || "",
        cost: item.cost || 0,
      });
    } else {
      setEditingId(null);
      setFormItem({
        name: "",
        category: "seeds",
        quantity: 0,
        unit: "",
        minStock: 0,
        supplier: "",
        cost: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!formItem.name || !formItem.unit || formItem.quantity === undefined || formItem.minStock === undefined) {
      toast({
        title: "Error",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Actualizar item existente
      const updatedInventory = inventory.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: formItem.name!,
              category: (formItem.category as InventoryItem["category"]) || "seeds",
              quantity: formItem.quantity!,
              unit: formItem.unit!,
              minStock: formItem.minStock!,
              lastUpdated: new Date().toISOString().split("T")[0],
              supplier: formItem.supplier || undefined,
              cost: formItem.cost || undefined,
            }
          : item
      );
      setInventory(updatedInventory);
      toast({
        title: "Item actualizado",
        description: `${formItem.name} ha sido actualizado exitosamente`,
      });
    } else {
      // Agregar nuevo item
      const item: InventoryItem = {
        id: `item-${Date.now()}`,
        name: formItem.name,
        category: (formItem.category as InventoryItem["category"]) || "seeds",
        quantity: formItem.quantity,
        unit: formItem.unit,
        minStock: formItem.minStock,
        lastUpdated: new Date().toISOString().split("T")[0],
        supplier: formItem.supplier || undefined,
        cost: formItem.cost || undefined,
      };
      setInventory([...inventory, item]);
      toast({
        title: "Item agregado",
        description: `${item.name} ha sido agregado al inventario`,
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Inventarios</h2>
            <p className="text-muted-foreground">Administre sus productos e insumos agrícolas</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4" />
                Agregar Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Item" : "Agregar Nuevo Item"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Modifique los datos del item" : "Complete los datos del nuevo item de inventario"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formItem.name}
                    onChange={(e) => setFormItem({ ...formItem, name: e.target.value })}
                    placeholder="Ej: Semillas de Papa"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formItem.category}
                    onValueChange={(value) => setFormItem({ ...formItem, category: value as InventoryItem["category"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeds">Semillas</SelectItem>
                      <SelectItem value="fertilizers">Fertilizantes</SelectItem>
                      <SelectItem value="pesticides">Pesticidas</SelectItem>
                      <SelectItem value="tools">Herramientas</SelectItem>
                      <SelectItem value="harvest">Cosecha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Cantidad *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formItem.quantity}
                      onChange={(e) => setFormItem({ ...formItem, quantity: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unidad *</Label>
                    <Input
                      id="unit"
                      value={formItem.unit}
                      onChange={(e) => setFormItem({ ...formItem, unit: e.target.value })}
                      placeholder="Ej: kg, L, unidades"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minStock">Stock Mínimo *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formItem.minStock}
                    onChange={(e) => setFormItem({ ...formItem, minStock: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Input
                    id="supplier"
                    value={formItem.supplier}
                    onChange={(e) => setFormItem({ ...formItem, supplier: e.target.value })}
                    placeholder="Ej: Semillas del Valle"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">Costo (COP)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formItem.cost}
                    onChange={(e) => setFormItem({ ...formItem, cost: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveItem}>
                  {editingId ? "Actualizar" : "Agregar Item"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {inventory.filter(isLowStock).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${inventory.reduce((sum, item) => sum + (item.cost || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventario</CardTitle>
                <CardDescription>Lista completa de productos e insumos</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getCategoryLabel(item.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      {item.minStock} {item.unit}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.supplier || '-'}
                    </TableCell>
                    <TableCell>
                      {isLowStock(item) ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Stock Bajo
                        </Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground">Óptimo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.cost?.toLocaleString() || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Inventory;
