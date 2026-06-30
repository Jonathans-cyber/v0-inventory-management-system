"""
Controlador del Dashboard.

Los controladores solo orquestan: reciben la peticion, llaman al servicio
y renderizan la plantilla. No contienen logica de negocio ni crean objetos
de dominio directamente.
"""

from flask import Blueprint, render_template
from services.dashboard_service import DashboardService

dashboard_bp = Blueprint("dashboard", __name__)
_service = DashboardService()


@dashboard_bp.route("/")
def index():
    return render_template("dashboard.html", resumen=_service.resumen())
