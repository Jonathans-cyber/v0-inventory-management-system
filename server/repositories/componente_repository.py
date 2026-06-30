"""Capa de Repositorio para componentes (solo persistencia SQL)."""

from database.db import get_connection


class ComponenteRepository:

    def listar_por_equipo(self, equipo_id):
        conn = get_connection()
        filas = conn.execute(
            "SELECT * FROM componentes WHERE equipo_id = ? ORDER BY id",
            (equipo_id,),
        ).fetchall()
        conn.close()
        return [dict(f) for f in filas]

    def obtener(self, componente_id):
        conn = get_connection()
        fila = conn.execute(
            "SELECT * FROM componentes WHERE id = ?", (componente_id,)
        ).fetchone()
        conn.close()
        return dict(fila) if fila else None

    def crear(self, equipo_id, datos):
        conn = get_connection()
        conn.execute(
            "INSERT INTO componentes (equipo_id, tipo, detalle) VALUES (?, ?, ?)",
            (equipo_id, datos["tipo"], datos["detalle"]),
        )
        conn.commit()
        conn.close()

    def eliminar(self, componente_id):
        conn = get_connection()
        conn.execute("DELETE FROM componentes WHERE id = ?", (componente_id,))
        conn.commit()
        conn.close()
