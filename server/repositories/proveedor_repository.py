"""Capa de Repositorio para proveedores (solo persistencia SQL)."""

from database.db import get_connection


class ProveedorRepository:

    def listar(self):
        conn = get_connection()
        filas = conn.execute("SELECT * FROM proveedores ORDER BY nombre").fetchall()
        conn.close()
        return [dict(f) for f in filas]

    def obtener(self, proveedor_id):
        conn = get_connection()
        fila = conn.execute(
            "SELECT * FROM proveedores WHERE id = ?", (proveedor_id,)
        ).fetchone()
        conn.close()
        return dict(fila) if fila else None

    def crear(self, datos):
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO proveedores (nombre, contacto, telefono, email)
            VALUES (?, ?, ?, ?)
        """, (datos["nombre"], datos["contacto"], datos["telefono"], datos["email"]))
        nuevo_id = cur.lastrowid
        conn.commit()
        conn.close()
        return nuevo_id

    def actualizar(self, proveedor_id, datos):
        conn = get_connection()
        conn.execute("""
            UPDATE proveedores
            SET nombre = ?, contacto = ?, telefono = ?, email = ?
            WHERE id = ?
        """, (datos["nombre"], datos["contacto"], datos["telefono"],
              datos["email"], proveedor_id))
        conn.commit()
        conn.close()

    def eliminar(self, proveedor_id):
        conn = get_connection()
        conn.execute("DELETE FROM proveedores WHERE id = ?", (proveedor_id,))
        conn.commit()
        conn.close()

    def total(self):
        conn = get_connection()
        total = conn.execute("SELECT COUNT(*) FROM proveedores").fetchone()[0]
        conn.close()
        return total
