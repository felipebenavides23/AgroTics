export interface Crop {
  id: string;
  name: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  area: number;
  status: 'planted' | 'growing' | 'harvesting' | 'completed';
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  yieldEstimate?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'seeds' | 'fertilizers' | 'pesticides' | 'tools' | 'harvest';
  quantity: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
  supplier?: string;
  cost?: number;
}

export interface MonitoringData {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  soilMoisture: number;
}
