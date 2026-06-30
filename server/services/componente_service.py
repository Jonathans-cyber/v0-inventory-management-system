"""Capa de Servicio para componentes."""

from repositories.componente_repository import ComponenteRepository

# Tipos de componente permitidos (segun el alcance del proyecto).
TIPOS_COMPONENTE = ["Procesador", "Memoria RAM", "Disco HDD", "Disco SSD"]


class ComponenteService:

    def __init__(self):
        self.repo = ComponenteRepository()

    def listar_por_equipo(self, equipo_id):
        return self.repo.listar_por_equipo(equipo_id)

    def crear(self, equipo_id, datos):
        self.repo.crear(equipo_id, datos)

    def eliminar(self, componente_id):
        self.repo.eliminar(componente_id)

    def tipos(self):
        return TIPOS_COMPONENTE
