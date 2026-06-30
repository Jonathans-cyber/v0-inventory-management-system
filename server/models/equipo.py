"""
Capa de Modelos (Domain Models).

Aqui vive el "Producto" del patron Factory Method: la clase abstracta `Equipo`
y sus subclases concretas (Laptop, Desktop, Servidor, etc.).

Cada fabrica concreta sera responsable de instanciar UNA de estas subclases.
De esta forma el resto de la aplicacion trabaja contra la abstraccion `Equipo`
y no necesita conocer la clase concreta.
"""

from abc import ABC, abstractmethod


class Equipo(ABC):
    """
    Producto abstracto del patron Factory Method.

    Define la estructura comun de todos los equipos de computo del inventario.
    Las subclases concretas definen el `tipo` y la `categoria`.
    """

    def __init__(self, nombre, marca, modelo, serial,
                 estado="Activo", proveedor=None, id=None):
        self.id = id
        self.nombre = nombre
        self.marca = marca
        self.modelo = modelo
        self.serial = serial
        self.estado = estado
        self.proveedor = proveedor

    # --- Metodos que cada subclase concreta debe definir -------------------
    @property
    @abstractmethod
    def tipo(self) -> str:
        """Tipo de equipo, p.ej. 'Laptop'. Lo define cada subclase."""

    @property
    @abstractmethod
    def categoria(self) -> str:
        """Categoria logica: 'Computo', 'Periferico' o 'Red'."""

    @property
    @abstractmethod
    def icono(self) -> str:
        """Icono de Bootstrap Icons asociado al tipo."""

    # --- Comportamiento comun ---------------------------------------------
    def to_dict(self) -> dict:
        """Serializa el equipo a un diccionario (util para la capa de datos)."""
        return {
            "id": self.id,
            "nombre": self.nombre,
            "tipo": self.tipo,
            "categoria": self.categoria,
            "icono": self.icono,
            "marca": self.marca,
            "modelo": self.modelo,
            "serial": self.serial,
            "estado": self.estado,
            "proveedor": self.proveedor,
        }


# ---------------------------------------------------------------------------
# Productos concretos: una subclase por cada tipo de equipo.
# El Factory Method devolvera instancias de estas clases.
# ---------------------------------------------------------------------------
class Laptop(Equipo):
    tipo = "Laptop"
    categoria = "Computo"
    icono = "bi-laptop"


class Desktop(Equipo):
    tipo = "Desktop"
    categoria = "Computo"
    icono = "bi-pc-display"


class Servidor(Equipo):
    tipo = "Servidor"
    categoria = "Computo"
    icono = "bi-hdd-rack"


class Impresora(Equipo):
    tipo = "Impresora"
    categoria = "Periferico"
    icono = "bi-printer"


class Monitor(Equipo):
    tipo = "Monitor"
    categoria = "Periferico"
    icono = "bi-display"


class Router(Equipo):
    tipo = "Router"
    categoria = "Red"
    icono = "bi-router"


class Switch(Equipo):
    tipo = "Switch"
    categoria = "Red"
    icono = "bi-diagram-3"
