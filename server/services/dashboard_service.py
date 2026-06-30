"""Capa de Servicio para el dashboard (solo conteos simples)."""

from repositories.equipo_repository import EquipoRepository
from repositories.proveedor_repository import ProveedorRepository


class DashboardService:

    def __init__(self):
        self.equipos = EquipoRepository()
        self.proveedores = ProveedorRepository()

    def resumen(self):
        return {
            "total_equipos": self.equipos.total(),
            "total_laptops": self.equipos.contar_por_tipo("Laptop"),
            "total_desktops": self.equipos.contar_por_tipo("Desktop"),
            "total_servidores": self.equipos.contar_por_tipo("Servidor"),
            "total_proveedores": self.proveedores.total(),
            "ultimos_equipos": self.equipos.ultimos(5),
        }
