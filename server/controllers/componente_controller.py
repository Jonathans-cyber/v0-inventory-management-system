"""Controlador de Componentes (asociados a un equipo)."""

from flask import Blueprint, request, redirect, url_for, flash
from services.componente_service import ComponenteService

componente_bp = Blueprint("componentes", __name__, url_prefix="/componentes")
_service = ComponenteService()


@componente_bp.route("/nuevo", methods=["POST"])
def nuevo():
    equipo_id = int(request.form.get("equipo_id"))
    datos = {
        "tipo": request.form.get("tipo", "").strip(),
        "detalle": request.form.get("detalle", "").strip(),
    }
    _service.crear(equipo_id, datos)
    flash("Componente agregado.", "success")
    return redirect(url_for("equipos.detalle", equipo_id=equipo_id))


@componente_bp.route("/<int:componente_id>/eliminar", methods=["POST"])
def eliminar(componente_id):
    equipo_id = int(request.form.get("equipo_id"))
    _service.eliminar(componente_id)
    flash("Componente eliminado.", "success")
    return redirect(url_for("equipos.detalle", equipo_id=equipo_id))
