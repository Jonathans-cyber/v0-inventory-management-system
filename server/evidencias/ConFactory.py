"""
EVIDENCIA ACADEMICA  ----  DESPUES (CON Factory Method)
=======================================================

Mismo ejemplo que SinFactory.py, pero aplicando el patron Factory Method.

Ventajas:
  - No hay if/elif: la fabrica correcta se obtiene desde un registro (dict).
  - Cada fabrica concreta sabe construir SU producto.
  - Agregar un tipo nuevo = agregar una clase + registrarla. No se modifica
    el codigo existente (cumple el principio Open/Closed).

Este archivo es autocontenido para poder ejecutarlo de forma aislada en la
sustentacion:  python ConFactory.py
"""

from abc import ABC, abstractmethod


# ---------- Producto abstracto y productos concretos ----------------------
class Equipo(ABC):
    def __init__(self, nombre, marca, modelo, serial):
        self.nombre = nombre
        self.marca = marca
        self.modelo = modelo
        self.serial = serial

    @property
    @abstractmethod
    def tipo(self): ...

    @property
    @abstractmethod
    def categoria(self): ...

    def __str__(self):
        return f"[{self.categoria}] {self.tipo}: {self.nombre} ({self.marca} {self.modelo})"


class Laptop(Equipo):    tipo, categoria = "Laptop", "Computo"
class Desktop(Equipo):   tipo, categoria = "Desktop", "Computo"
class Servidor(Equipo):  tipo, categoria = "Servidor", "Computo"
class Impresora(Equipo): tipo, categoria = "Impresora", "Periferico"
class Monitor(Equipo):   tipo, categoria = "Monitor", "Periferico"
class Router(Equipo):    tipo, categoria = "Router", "Red"
class Switch(Equipo):    tipo, categoria = "Switch", "Red"


# ---------- Creator abstracto y fabricas concretas ------------------------
class EquipoFactory(ABC):
    @abstractmethod
    def crear_equipo(self, nombre, marca, modelo, serial) -> Equipo: ...


class LaptopFactory(EquipoFactory):
    def crear_equipo(self, n, m, mo, s): return Laptop(n, m, mo, s)
class DesktopFactory(EquipoFactory):
    def crear_equipo(self, n, m, mo, s): return Desktop(n, m, mo, s)
class ServidorFactory(EquipoFactory):
    def crear_equipo(self, n, m, mo, s): return Servidor(n, m, mo, s)
class ImpresoraFactory(EquipoFactory):
    def crear_equipo(self, n, m, mo, s): return Impresora(n, m, mo, s)
class MonitorFactory(EquipoFactory):
    def crear_equipo(self, n, m, mo, s): return Monitor(n, m, mo, s)
class RouterFactory(EquipoFactory):
    def crear_equipo(self, n, m, mo, s): return Router(n, m, mo, s)
class SwitchFactory(EquipoFactory):
    def crear_equipo(self, n, m, mo, s): return Switch(n, m, mo, s)


# ---------- Registro de fabricas (reemplaza al if/elif) -------------------
FABRICAS = {
    "Laptop": LaptopFactory(),
    "Desktop": DesktopFactory(),
    "Servidor": ServidorFactory(),
    "Impresora": ImpresoraFactory(),
    "Monitor": MonitorFactory(),
    "Router": RouterFactory(),
    "Switch": SwitchFactory(),
}


def crear_equipo(tipo, nombre, marca, modelo, serial):
    """Sin if/elif: se resuelve la fabrica por clave y se delega la creacion."""
    factory = FABRICAS.get(tipo)
    if factory is None:
        raise ValueError(f"Tipo no soportado: {tipo}")
    return factory.crear_equipo(nombre, marca, modelo, serial)


if __name__ == "__main__":
    e1 = crear_equipo("Laptop", "Portatil RRHH", "Dell", "Latitude", "SN-1")
    e2 = crear_equipo("Router", "Router Piso 2", "Cisco", "RV340", "SN-2")
    print(e1)
    print(e2)
