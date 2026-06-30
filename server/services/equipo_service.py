"""
Capa de Servicio (logica de negocio) para equipos.

ESTE ES EL UNICO LUGAR donde se usa el Factory Method para crear equipos.
El controlador jamas instancia objetos `Equipo`; solo llama a este servicio.
"""

from repositories.equipo_repository import EquipoRepository

# ----- Importacion del patron Factory Method -----------------------------
from patterns.factory.factories import obtener_factory, tipos_disponibles


class EquipoService:

    def __init__(self):
        self.repo = EquipoRepository()

    def crear_equipo(self, datos):
        """
        Crea un equipo usando el Factory Method.

        ================= USO DEL PATRON FACTORY METHOD =================
        1. Se obtiene la fabrica concreta segun el tipo (sin if/elif).
        2. La fabrica produce el objeto Equipo correcto.
        El servicio no sabe que clase concreta se crea: depende de la
        abstraccion EquipoFactory.
        """
        factory = obtener_factory(datos["tipo"])          # (1) seleccion sin if/elif
        equipo = factory.crear_equipo(                    # (2) creacion via factory
            nombre=datos["nombre"],
            marca=datos["marca"],
            modelo=datos["modelo"],
            serial=datos["serial"],
            estado=datos.get("estado", "Activo"),
            proveedor=datos.get("proveedor"),
        )
        # ================= FIN USO DEL PATRON FACTORY ==================
        return self.repo.crear(equipo, datos.get("proveedor_id"))

    def listar_equipos(self):
        """Lista los equipos y los enriquece con categoria/icono via Factory."""
        filas = self.repo.listar()
        return [self._enriquecer(f) for f in filas]

    def obtener_equipo(self, equipo_id):
        fila = self.repo.obtener(equipo_id)
        return self._enriquecer(fila) if fila else None

    def actualizar_equipo(self, equipo_id, datos):
        # Validamos el tipo usando el registro de fabricas (sin if/elif).
        obtener_factory(datos["tipo"])
        self.repo.actualizar(equipo_id, datos, datos.get("proveedor_id"))

    def eliminar_equipo(self, equipo_id):
        self.repo.eliminar(equipo_id)

    def tipos(self):
        """Tipos validos provistos por el registro de fabricas."""
        return tipos_disponibles()

    # --- privado ----------------------------------------------------------
    def _enriquecer(self, fila):
        """
        Reconstruye el objeto Equipo con el Factory para obtener atributos
        derivados (categoria, icono) sin duplicar logica en la vista.
        """
        try:
            factory = obtener_factory(fila["tipo"])
            equipo = factory.crear_equipo(
                nombre=fila["nombre"], marca=fila["marca"], modelo=fila["modelo"],
                serial=fila["serial"], estado=fila["estado"], id=fila["id"],
            )
            fila["categoria"] = equipo.categoria
            fila["icono"] = equipo.icono
        except ValueError:
            fila["categoria"] = "Desconocida"
            fila["icono"] = "bi-question-circle"
        return fila
