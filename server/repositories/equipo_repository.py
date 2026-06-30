"""
Capa de Repositorio para equipos.

Responsable UNICAMENTE de la persistencia (SQL). No contiene logica de
negocio ni conoce el patron Factory.
"""

from database.db import get_connection


class EquipoRepository:

    def listar(self):
        conn = get_connection()
        filas = conn.execute("""
            SELECT e.*, p.nombre AS proveedor_nombre
            FROM equipos e
            LEFT JOIN proveedores p ON e.proveedor_id = p.id
            ORDER BY e.id DESC
        """).fetchall()
        conn.close()
        return [dict(f) for f in filas]

    def obtener(self, equipo_id):
        conn = get_connection()
        fila = conn.execute("""
            SELECT e.*, p.nombre AS proveedor_nombre
            FROM equipos e
            LEFT JOIN proveedores p ON e.proveedor_id = p.id
            WHERE e.id = ?
        """, (equipo_id,)).fetchone()
        conn.close()
        return dict(fila) if fila else None

    def crear(self, equipo, proveedor_id):
        """Inserta un equipo. `equipo` es un objeto producido por el Factory."""
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO equipos (nombre, tipo, marca, modelo, serial, estado, proveedor_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (equipo.nombre, equipo.tipo, equipo.marca, equipo.modelo,
              equipo.serial, equipo.estado, proveedor_id))
        nuevo_id = cur.lastrowid
        conn.commit()
        conn.close()
        return nuevo_id

    def actualizar(self, equipo_id, datos, proveedor_id):
        conn = get_connection()
        conn.execute("""
            UPDATE equipos
            SET nombre = ?, tipo = ?, marca = ?, modelo = ?,
                serial = ?, estado = ?, proveedor_id = ?
            WHERE id = ?
        """, (datos["nombre"], datos["tipo"], datos["marca"], datos["modelo"],
              datos["serial"], datos["estado"], proveedor_id, equipo_id))
        conn.commit()
        conn.close()

    def eliminar(self, equipo_id):
        conn = get_connection()
        conn.execute("DELETE FROM equipos WHERE id = ?", (equipo_id,))
        conn.commit()
        conn.close()

    def contar_por_tipo(self, tipo):
        conn = get_connection()
        total = conn.execute(
            "SELECT COUNT(*) FROM equipos WHERE tipo = ?", (tipo,)
        ).fetchone()[0]
        conn.close()
        return total

    def total(self):
        conn = get_connection()
        total = conn.execute("SELECT COUNT(*) FROM equipos").fetchone()[0]
        conn.close()
        return total

    def ultimos(self, limite=5):
        conn = get_connection()
        filas = conn.execute("""
            SELECT e.*, p.nombre AS proveedor_nombre
            FROM equipos e
            LEFT JOIN proveedores p ON e.proveedor_id = p.id
            ORDER BY e.id DESC
            LIMIT ?
        """, (limite,)).fetchall()
        conn.close()
        return [dict(f) for f in filas]
