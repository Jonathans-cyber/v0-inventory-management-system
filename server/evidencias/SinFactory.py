"""
EVIDENCIA ACADEMICA  ----  ANTES (SIN Factory Method)
=====================================================

Este archivo muestra como se crearian los equipos SIN aplicar el patron,
utilizando una larga cadena de if / elif segun el tipo.

Problemas de este enfoque:
  - El metodo crece cada vez que aparece un tipo nuevo (viola Open/Closed).
  - Mezcla la decision de "que crear" con el "como crearlo".
  - Codigo dificil de mantener y propenso a errores.

Ejecutar:  python SinFactory.py
"""


class Equipo:
    def __init__(self, tipo, nombre, marca, modelo, serial, categoria):
        self.tipo = tipo
        self.nombre = nombre
        self.marca = marca
        self.modelo = modelo
        self.serial = serial
        self.categoria = categoria

    def __str__(self):
        return f"[{self.categoria}] {self.tipo}: {self.nombre} ({self.marca} {self.modelo})"


def crear_equipo(tipo, nombre, marca, modelo, serial):
    """Creacion acoplada mediante if/elif (lo que QUEREMOS evitar)."""
    if tipo == "Laptop":
        return Equipo(tipo, nombre, marca, modelo, serial, "Computo")
    elif tipo == "Desktop":
        return Equipo(tipo, nombre, marca, modelo, serial, "Computo")
    elif tipo == "Servidor":
        return Equipo(tipo, nombre, marca, modelo, serial, "Computo")
    elif tipo == "Impresora":
        return Equipo(tipo, nombre, marca, modelo, serial, "Periferico")
    elif tipo == "Monitor":
        return Equipo(tipo, nombre, marca, modelo, serial, "Periferico")
    elif tipo == "Router":
        return Equipo(tipo, nombre, marca, modelo, serial, "Red")
    elif tipo == "Switch":
        return Equipo(tipo, nombre, marca, modelo, serial, "Red")
    else:
        raise ValueError(f"Tipo no soportado: {tipo}")
    # Cada tipo nuevo obliga a AGREGAR otro elif aqui.


if __name__ == "__main__":
    e1 = crear_equipo("Laptop", "Portatil RRHH", "Dell", "Latitude", "SN-1")
    e2 = crear_equipo("Router", "Router Piso 2", "Cisco", "RV340", "SN-2")
    print(e1)
    print(e2)
