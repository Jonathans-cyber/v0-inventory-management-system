"""
Controlador de Equipos.

IMPORTANTE: el controlador NUNCA crea objetos Equipo directamente.
Solo solicita al `EquipoService` que lo haga; el servicio internamente usa
el patron Factory Method.
"""

from flask import (
    Blueprint, render_template, request, redirect, url_for, flash, abort,
)

from services.equipo_service import EquipoService
from services.proveedor_service import ProveedorService
from services.componente_service import ComponenteService

equipo_bp = Blueprint("equipos", __name__, url_prefix="/equipos")

_equipos = EquipoService()
_proveedores = ProveedorService()
_componentes = ComponenteService()

ESTADOS = ["Activo", "Inactivo", "Mantenimiento", "Baja", "Repuesto"]


def _form_datos():
    """Extrae y normaliza los datos del formulario de equipo."""
    proveedor_id = request.form.get("proveedor_id") or None
    proveedor = None
    if proveedor_id:
        prov = _proveedores.obtener(int(proveedor_id))
        proveedor = prov["nombre"] if prov else None
    return {
        "nombre": request.form.get("nombre", "").strip(),
        "tipo": request.form.get("tipo", "").strip(),
        "marca": request.form.get("marca", "").strip(),
        "modelo": request.form.get("modelo", "").strip(),
        "serial": request.form.get("serial", "").strip(),
        "estado": request.form.get("estado", "Activo"),
        "proveedor_id": int(proveedor_id) if proveedor_id else None,
        "proveedor": proveedor,
    }


@equipo_bp.route("")
def listar():
    return render_template("equipos/lista.html", equipos=_equipos.listar_equipos())


@equipo_bp.route("/nuevo", methods=["GET", "POST"])
def nuevo():
    if request.method == "POST":
        datos = _form_datos()
        try:
            # El controlador delega la creacion al servicio (que usa Factory).
            _equipos.crear_equipo(datos)
            flash("Equipo creado correctamente.", "success")
            return redirect(url_for("equipos.listar"))
        except ValueError as e:
            flash(str(e), "danger")
        except Exception:
            flash("No se pudo crear el equipo. Verifica que el serial no exista.", "danger")
    return render_template(
        "equipos/form.html",
        equipo=None,
        tipos=_equipos.tipos(),
        estados=ESTADOS,
        proveedores=_proveedores.listar(),
    )


@equipo_bp.route("/<int:equipo_id>")
def detalle(equipo_id):
    equipo = _equipos.obtener_equipo(equipo_id)
    if not equipo:
        abort(404)
    return render_template(
        "equipos/detalle.html",
        equipo=equipo,
        componentes=_componentes.listar_por_equipo(equipo_id),
        tipos_componente=_componentes.tipos(),
    )


@equipo_bp.route("/<int:equipo_id>/editar", methods=["GET", "POST"])
def editar(equipo_id):
    equipo = _equipos.obtener_equipo(equipo_id)
    if not equipo:
        abort(404)
    if request.method == "POST":
        datos = _form_datos()
        try:
            _equipos.actualizar_equipo(equipo_id, datos)
            flash("Equipo actualizado correctamente.", "success")
            return redirect(url_for("equipos.detalle", equipo_id=equipo_id))
        except ValueError as e:
            flash(str(e), "danger")
        except Exception:
            flash("No se pudo actualizar el equipo.", "danger")
    return render_template(
        "equipos/form.html",
        equipo=equipo,
        tipos=_equipos.tipos(),
        estados=ESTADOS,
        proveedores=_proveedores.listar(),
    )


@equipo_bp.route("/<int:equipo_id>/eliminar", methods=["POST"])
def eliminar(equipo_id):
    _equipos.eliminar_equipo(equipo_id)
    flash("Equipo eliminado.", "success")
    return redirect(url_for("equipos.listar"))
