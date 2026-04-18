"use client";

import {
  LayoutDashboard,
  Monitor,
  Truck,
  Settings,
  HardDrive,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "equipos", label: "Equipos", icon: Monitor },
    { id: "proveedores", label: "Proveedores", icon: Truck },
  ];

  return (
    <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <HardDrive className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg">Inventario IT</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Gestión de Equipos
          </p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-[var(--border)]">
        <button
          onClick={() => setActiveTab("configuracion")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            activeTab === "configuracion"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configuracion</span>
        </button>
      </div>
    </aside>
  );
}
