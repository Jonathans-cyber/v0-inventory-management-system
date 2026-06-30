"""
=========================================================================
 INICIO DE LA IMPLEMENTACION DEL PATRON FACTORY METHOD  (Fabricas concretas)
=========================================================================

Aqui viven las FABRICAS CONCRETAS. Cada una implementa el factory method
`crear_equipo(...)` y es la unica responsable de instanciar su producto
concreto correspondiente.

Ademas se expone un REGISTRO (`FABRICAS`) que mapea el nombre del tipo con
su fabrica. Gracias a este registro, el servicio selecciona la fabrica con
una simple busqueda en diccionario y NO con una cadena de if/elif.
"""

from patterns.interfaces.equipo_factory import EquipoFactory
from models.equipo import (
    Laptop, Desktop, Servidor, Impresora, Monitor, Router, Switch,
)


class LaptopFactory(EquipoFactory):
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None):
        return Laptop(nombre, marca, modelo, serial, estado, proveedor, id)


class DesktopFactory(EquipoFactory):
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None):
        return Desktop(nombre, marca, modelo, serial, estado, proveedor, id)


class ServidorFactory(EquipoFactory):
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None):
        return Servidor(nombre, marca, modelo, serial, estado, proveedor, id)


class ImpresoraFactory(EquipoFactory):
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None):
        return Impresora(nombre, marca, modelo, serial, estado, proveedor, id)


class MonitorFactory(EquipoFactory):
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None):
        return Monitor(nombre, marca, modelo, serial, estado, proveedor, id)


class RouterFactory(EquipoFactory):
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None):
        return Router(nombre, marca, modelo, serial, estado, proveedor, id)


class SwitchFactory(EquipoFactory):
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None):
        return Switch(nombre, marca, modelo, serial, estado, proveedor, id)


# ---------------------------------------------------------------------------
# REGISTRO DE FABRICAS
# Mapea el tipo de equipo -> instancia de su fabrica concreta.
# Esto reemplaza por completo cualquier cadena if/elif: para obtener la
# fabrica correcta basta con consultar este diccionario por la clave `tipo`.
# ---------------------------------------------------------------------------
FABRICAS = {
    "Laptop": LaptopFactory(),
    "Desktop": DesktopFactory(),
    "Servidor": ServidorFactory(),
    "Impresora": ImpresoraFactory(),
    "Monitor": MonitorFactory(),
    "Router": RouterFactory(),
    "Switch": SwitchFactory(),
}


def obtener_factory(tipo: str) -> EquipoFactory:
    """
    Devuelve la fabrica concreta asociada a un tipo de equipo.

    No usa if/elif: resuelve la fabrica con una busqueda directa en el
    diccionario `FABRICAS`. Si el tipo no existe, lanza un ValueError.
    """
    factory = FABRICAS.get(tipo)
    if factory is None:
        tipos_validos = ", ".join(FABRICAS.keys())
        raise ValueError(
            f"Tipo de equipo no soportado: '{tipo}'. "
            f"Tipos validos: {tipos_validos}."
        )
    return factory


def tipos_disponibles() -> list:
    """Lista de tipos de equipo soportados (claves del registro)."""
    return list(FABRICAS.keys())

# =========================================================================
#  FIN DE LAS FABRICAS CONCRETAS DEL PATRON FACTORY METHOD
# =========================================================================
