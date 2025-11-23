import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Package, 
  Leaf, 
  Activity, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/inventario", icon: Package, label: "Inventario" },
  { to: "/cultivos", icon: Leaf, label: "Cultivos" },
  { to: "/monitoreo", icon: Activity, label: "Monitoreo" },
  { to: "/reportes", icon: FileText, label: "Reportes" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-border bg-sidebar">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
