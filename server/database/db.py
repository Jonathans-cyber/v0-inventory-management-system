"""
Capa de Base de Datos.

Encapsula la conexion a SQLite y la creacion del esquema. El resto de la
aplicacion (repositorios) usa `get_connection()` y no conoce los detalles
de SQLite.
"""

import os
import sqlite3

# La base de datos se guarda dentro de la carpeta server/ (escribible en dev).
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "inventario.db")


def get_connection() -> sqlite3.Connection:
    """Abre una conexion a SQLite con filas accesibles por nombre de columna."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    """Crea las tablas si no existen y carga datos de ejemplo la primera vez."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS proveedores (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre  TEXT NOT NULL,
            contacto TEXT,
            telefono TEXT,
            email    TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS equipos (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre       TEXT NOT NULL,
            tipo         TEXT NOT NULL,
            marca        TEXT,
            modelo       TEXT,
            serial       TEXT NOT NULL UNIQUE,
            estado       TEXT NOT NULL DEFAULT 'Activo',
            proveedor_id INTEGER,
            FOREIGN KEY (proveedor_id) REFERENCES proveedores (id) ON DELETE SET NULL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS componentes (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            equipo_id INTEGER NOT NULL,
            tipo      TEXT NOT NULL,
            detalle   TEXT,
            FOREIGN KEY (equipo_id) REFERENCES equipos (id) ON DELETE CASCADE
        )
    """)

    # Datos de ejemplo solo si no hay proveedores aun.
    if cur.execute("SELECT COUNT(*) FROM proveedores").fetchone()[0] == 0:
        cur.executemany(
            "INSERT INTO proveedores (nombre, contacto, telefono, email) "
            "VALUES (?, ?, ?, ?)",
            [
                ("Tecnologia Andina S.A.", "Laura Gomez", "601-2345678", "ventas@tecandina.com"),
                ("CompuMundo Ltda.", "Carlos Ruiz", "604-9876543", "contacto@compumundo.com"),
                ("Redes y Servidores SAS", "Ana Torres", "602-5551234", "info@redservidores.com"),
            ],
        )

    if cur.execute("SELECT COUNT(*) FROM equipos").fetchone()[0] == 0:
        cur.executemany(
            "INSERT INTO equipos (nombre, tipo, marca, modelo, serial, estado, proveedor_id) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                ("Portatil Recepcion", "Laptop", "Dell", "Latitude 5420", "SN-LAP-001", "Activo", 1),
                ("PC Contabilidad", "Desktop", "HP", "ProDesk 600", "SN-DSK-002", "Activo", 2),
                ("Servidor Principal", "Servidor", "Lenovo", "ThinkSystem ST50", "SN-SRV-003", "Activo", 3),
                ("Router Sala TI", "Router", "Cisco", "RV340", "SN-RTR-004", "Activo", 3),
            ],
        )
        cur.executemany(
            "INSERT INTO componentes (equipo_id, tipo, detalle) VALUES (?, ?, ?)",
            [
                (1, "Procesador", "Intel Core i5-1135G7"),
                (1, "Memoria RAM", "16 GB DDR4"),
                (1, "Disco SSD", "512 GB NVMe"),
                (3, "Procesador", "Intel Xeon E-2224"),
                (3, "Memoria RAM", "32 GB ECC"),
                (3, "Disco HDD", "2 TB SATA"),
            ],
        )

    conn.commit()
    conn.close()
