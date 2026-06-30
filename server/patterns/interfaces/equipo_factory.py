"""
=========================================================================
 INICIO DE LA IMPLEMENTACION DEL PATRON FACTORY METHOD  (Creator abstracto)
=========================================================================

Este archivo define la INTERFAZ del patron Factory Method.

`EquipoFactory` es el "Creator" abstracto: declara el factory method
`crear_equipo(...)` que las fabricas concretas deben implementar.

El resto de la aplicacion depende de esta abstraccion, NO de las clases
concretas de equipos. Asi se cumple el principio de inversion de
dependencias y se elimina la necesidad de cadenas if/elif por tipo.
"""

from abc import ABC, abstractmethod
from models.equipo import Equipo


class EquipoFactory(ABC):
    """Creator abstracto del patron Factory Method."""

    @abstractmethod
    def crear_equipo(self, nombre, marca, modelo, serial,
                     estado="Activo", proveedor=None, id=None) -> Equipo:
        """
        Factory Method.

        Cada fabrica concreta implementa este metodo para devolver una
        instancia del `Equipo` que le corresponde (Laptop, Desktop, etc.).
        """
        raise NotImplementedError

# =========================================================================
#  FIN DE LA INTERFAZ DEL PATRON FACTORY METHOD
# =========================================================================
