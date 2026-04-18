"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import EquiposList from "@/components/EquiposList";
import ProveedoresList from "@/components/ProveedoresList";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "equipos" && <EquiposList />}
        {activeTab === "proveedores" && <ProveedoresList />}
      </main>
    </div>
  );
}
