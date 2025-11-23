import { Sprout } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">AgroGestión</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestión Agrícola</p>
          </div>
        </div>
      </div>
    </header>
  );
};
