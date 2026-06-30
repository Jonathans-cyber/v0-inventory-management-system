# Diagrama UML de Clases — Patrón Factory Method

El siguiente diagrama (Mermaid) evidencia el patrón Factory Method y su
relación con las capas Controller → Service → Repository.

```mermaid
classDiagram
    %% ---------- Producto ----------
    class Equipo {
        <<abstract>>
        +id
        +nombre
        +marca
        +modelo
        +serial
        +estado
        +tipo()*
        +categoria()*
        +icono()*
        +to_dict()
    }
    class Laptop
    class Desktop
    class Servidor
    class Impresora
    class Monitor
    class Router
    class Switch

    Equipo <|-- Laptop
    Equipo <|-- Desktop
    Equipo <|-- Servidor
    Equipo <|-- Impresora
    Equipo <|-- Monitor
    Equipo <|-- Router
    Equipo <|-- Switch

    %% ---------- Creator ----------
    class EquipoFactory {
        <<abstract>>
        +crear_equipo()*
    }
    class LaptopFactory
    class DesktopFactory
    class ServidorFactory
    class ImpresoraFactory
    class MonitorFactory
    class RouterFactory
    class SwitchFactory

    EquipoFactory <|-- LaptopFactory
    EquipoFactory <|-- DesktopFactory
    EquipoFactory <|-- ServidorFactory
    EquipoFactory <|-- ImpresoraFactory
    EquipoFactory <|-- MonitorFactory
    EquipoFactory <|-- RouterFactory
    EquipoFactory <|-- SwitchFactory

    %% ---------- Fabricas crean Productos ----------
    LaptopFactory ..> Laptop : crea
    DesktopFactory ..> Desktop : crea
    ServidorFactory ..> Servidor : crea
    ImpresoraFactory ..> Impresora : crea
    MonitorFactory ..> Monitor : crea
    RouterFactory ..> Router : crea
    SwitchFactory ..> Switch : crea

    %% ---------- Capas ----------
    class EquipoController {
        +nuevo()
        +editar()
        +listar()
    }
    class EquipoService {
        +crear_equipo()
        +listar_equipos()
    }
    class EquipoRepository {
        +crear()
        +listar()
    }

    EquipoController ..> EquipoService : usa
    EquipoService ..> EquipoFactory : usa (Factory Method)
    EquipoService ..> EquipoRepository : usa
    EquipoRepository ..> Equipo : persiste
```

## Lectura del diagrama

- **EquipoFactory** es el *Creator* abstracto y declara `crear_equipo()`.
- Cada **fábrica concreta** (LaptopFactory, RouterFactory, …) implementa
  `crear_equipo()` y produce su **producto** concreto correspondiente.
- **EquipoController** nunca instancia un `Equipo`: llama a **EquipoService**.
- **EquipoService** selecciona la fábrica (vía el registro `FABRICAS`) y delega
  la creación. Así la lógica queda desacoplada.
- **EquipoRepository** solo persiste/lee en SQLite.
