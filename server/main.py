"""
Punto de entrada de la aplicacion Flask.

Ensambla la arquitectura por capas registrando los controladores
(Blueprints) e inicializando la base de datos.

Flujo de una peticion:
    Controller  ->  Service  ->  (Factory)  ->  Repository  ->  SQLite
"""

import os
import sys

# Aseguramos que el directorio del proyecto este en el path para que los
# imports por paquete (controllers, services, ...) funcionen en cualquier host.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask

from database.db import init_db
from controllers.dashboard_controller import dashboard_bp
from controllers.equipo_controller import equipo_bp
from controllers.proveedor_controller import proveedor_bp
from controllers.componente_controller import componente_bp

app = Flask(__name__)
app.secret_key = "patrones-de-diseno-factory-method"

# Crea las tablas y carga datos de ejemplo en el primer arranque.
init_db()

# Registro de controladores (capa de presentacion).
app.register_blueprint(dashboard_bp)
app.register_blueprint(equipo_bp)
app.register_blueprint(proveedor_bp)
app.register_blueprint(componente_bp)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
