"""Capa de Servicio para proveedores."""

from repositories.proveedor_repository import ProveedorRepository


class ProveedorService:

    def __init__(self):
        self.repo = ProveedorRepository()

    def listar(self):
        return self.repo.listar()

    def obtener(self, proveedor_id):
        return self.repo.obtener(proveedor_id)

    def crear(self, datos):
        return self.repo.crear(datos)

    def actualizar(self, proveedor_id, datos):
        self.repo.actualizar(proveedor_id, datos)

    def eliminar(self, proveedor_id):
        self.repo.eliminar(proveedor_id)
