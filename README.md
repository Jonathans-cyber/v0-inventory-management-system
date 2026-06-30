# Gestor de Inventario de Equipos de Cómputo — Patrón Factory Method

Proyecto académico para la asignatura de **Patrones de Diseño**. El objetivo
principal **no** es la complejidad de la aplicación, sino **evidenciar
correctamente la implementación del patrón Factory Method** dentro de una
arquitectura por capas limpia y fácil de explicar en una sustentación.

---

## 1. Objetivo del proyecto

Administrar un inventario sencillo de equipos de cómputo (equipos, proveedores
y componentes internos), donde **toda la creación de equipos se realiza
mediante el patrón Factory Method**, eliminando las cadenas `if / elif` por tipo.

---

## 2. Tecnologías

- **Python 3.12+**
- **Flask** (servidor web)
- **SQLite** (persistencia)
- **Jinja2** (plantillas HTML)
- **Bootstrap 5** (estilos, vía CDN)

> No se utiliza React, Next.js ni Tailwind.

---

## 3. Arquitectura por capas

```
server/
├── main.py                # Punto de entrada Flask (ensambla las capas)
├── controllers/           # Capa de presentación (Blueprints Flask)
│   ├── dashboard_controller.py
│   ├── equipo_controller.py
│   ├── proveedor_controller.py
│   └── componente_controller.py
├── services/              # Lógica de negocio (AQUI se usa el Factory)
│   ├── equipo_service.py
│   ├── proveedor_service.py
│   ├── componente_service.py
│   └── dashboard_service.py
├── repositories/          # Acceso a datos (SQL puro)
│   ├── equipo_repository.py
│   ├── proveedor_repository.py
│   └── componente_repository.py
├── models/                # Producto del patrón (Equipo y subclases)
│   └── equipo.py
├── patterns/              # >>> IMPLEMENTACIÓN DEL PATRÓN FACTORY METHOD <<<
│   ├── interfaces/
│   │   └── equipo_factory.py     # Creator abstracto (EquipoFactory)
│   └── factory/
│       └── factories.py          # Fábricas concretas + registro FABRICAS
├── database/
│   └── db.py              # Conexión y esquema SQLite
├── templates/             # Vistas Jinja + Bootstrap
├── static/                # CSS propio
├── evidencias/            # Comparativa académica (SinFactory / ConFactory)
│   ├── SinFactory.py
│   └── ConFactory.py
└── docs/
    └── diagrama_uml.md    # Diagrama UML de clases (Mermaid)
```

**Flujo de una petición:**

```
Controller  →  Service  →  (Factory Method)  →  Repository  →  SQLite
```

---

## 4. El patrón Factory Method

El patrón está dividido en dos archivos dentro de `patterns/`:

1. **`patterns/interfaces/equipo_factory.py`** — *Creator abstracto*.
   Declara el método fábrica `crear_equipo(...)`.

2. **`patterns/factory/factories.py`** — *Fábricas concretas*.
   `LaptopFactory`, `DesktopFactory`, `ServidorFactory`, `ImpresoraFactory`,
   `MonitorFactory`, `RouterFactory`, `SwitchFactory`. Cada una crea **su**
   producto concreto.

La selección de la fábrica se hace con un **registro** (diccionario
`FABRICAS`) en lugar de `if / elif`:

```python
factory = obtener_factory(tipo)        # búsqueda en diccionario, sin if/elif
equipo  = factory.crear_equipo(...)    # la fábrica crea el objeto correcto
```

El **controlador nunca crea objetos** `Equipo`: solo llama al servicio, y el
servicio es quien usa el Factory. Todo el código del patrón está claramente
delimitado con comentarios `INICIO / FIN DE LA IMPLEMENTACIÓN DEL PATRÓN`.

---

## 5. Beneficios de eliminar los `if / elif`

| Sin Factory (if/elif)                          | Con Factory Method                         |
|------------------------------------------------|--------------------------------------------|
| Un `elif` por cada tipo nuevo                  | Una clase nueva + registrarla              |
| Modificar código existente (rompe Open/Closed) | No se toca el código existente             |
| Decisión y creación mezcladas                  | Responsabilidad separada por fábrica       |
| Difícil de probar y mantener                   | Cada fábrica se prueba de forma aislada    |

Consulta `evidencias/SinFactory.py` y `evidencias/ConFactory.py` para ver
exactamente el mismo ejemplo resuelto de ambas formas.

---

## 6. Funcionalidad

- **Dashboard** simple: total de equipos, laptops, desktops, servidores y
  últimos equipos registrados.
- **Equipos**: CRUD completo (crear vía Factory, editar, eliminar, detalle).
- **Proveedores**: CRUD sencillo.
- **Componentes** por equipo (Procesador, Memoria RAM, Disco HDD, Disco SSD).

---

## 7. Cómo ejecutar el proyecto

### Opción A — Local

```bash
cd server
pip install flask
python main.py
```

Abre `http://localhost:3000` en el navegador.

### Opción B — En Vercel (este entorno)

El proyecto ya está configurado con `vercel.json` (servicio Python). El
servidor de desarrollo levanta la aplicación automáticamente y la muestra en
la vista previa.

### Ejecutar las evidencias del patrón

```bash
cd server/evidencias
python SinFactory.py
python ConFactory.py
```

---

## 8. Diagrama UML

Disponible en [`server/docs/diagrama_uml.md`](server/docs/diagrama_uml.md)
(diagrama Mermaid que se renderiza directamente en GitHub).
