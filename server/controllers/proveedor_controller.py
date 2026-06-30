"""Controlador de Proveedores (CRUD sencillo)."""

from flask import (
    Blueprint, render_template, request, redirect, url_for, flash, abort,
)
from services.proveedor_service import ProveedorService

proveedor_bp = Blueprint("proveedores", __name__, url_prefix="/proveedores")
_service = ProveedorService()


def _form_datos():
    return {
        "nombre": request.form.get("nombre", "").strip(),
        "contacto": request.form.get("contacto", "").strip(),
        "telefono": request.form.get("telefono", "").strip(),
        "email": request.form.get("email", "").strip(),
    }


@proveedor_bp.route("")
def listar():
    return render_template("proveedores/lista.html", proveedores=_service.listar())


@proveedor_bp.route("/nuevo", methods=["GET", "POST"])
def nuevo():
    if request.method == "POST":
        _service.crear(_form_datos())
        flash("Proveedor creado correctamente.", "success")
        return redirect(url_for("proveedores.listar"))
    return render_template("proveedores/form.html", proveedor=None)


@proveedor_bp.route("/<int:proveedor_id>/editar", methods=["GET", "POST"])
def editar(proveedor_id):
    proveedor = _service.obtener(proveedor_id)
    if not proveedor:
        abort(404)
    if request.method == "POST":
        _service.actualizar(proveedor_id, _form_datos())
        flash("Proveedor actualizado correctamente.", "success")
        return redirect(url_for("proveedores.listar"))
    return render_template("proveedores/form.html", proveedor=proveedor)


@proveedor_bp.route("/<int:proveedor_id>/eliminar", methods=["POST"])
def eliminar(proveedor_id):
    _service.eliminar(proveedor_id)
    flash("Proveedor eliminado.", "success")
    return redirect(url_for("proveedores.listar"))
