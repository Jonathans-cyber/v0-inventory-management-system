const API_BASE = '/api';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error en la solicitud');
  }
  return response.json();
}

// Proveedores
export const proveedoresApi = {
  getAll: () => fetch(`${API_BASE}/proveedores`).then(handleResponse),
  create: (data: Record<string, unknown>) =>
    fetch(`${API_BASE}/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  update: (id: number, data: Record<string, unknown>) =>
    fetch(`${API_BASE}/proveedores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  delete: (id: number) =>
    fetch(`${API_BASE}/proveedores/${id}`, { method: 'DELETE' }).then(handleResponse),
};

// Equipos
export const equiposApi = {
  getAll: () => fetch(`${API_BASE}/equipos`).then(handleResponse),
  getOne: (id: number) => fetch(`${API_BASE}/equipos/${id}`).then(handleResponse),
  create: (data: Record<string, unknown>) =>
    fetch(`${API_BASE}/equipos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  update: (id: number, data: Record<string, unknown>) =>
    fetch(`${API_BASE}/equipos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  delete: (id: number) =>
    fetch(`${API_BASE}/equipos/${id}`, { method: 'DELETE' }).then(handleResponse),
  cambiarEstado: (id: number, data: { estado: string; descripcion?: string; responsable?: string; observaciones?: string }) =>
    fetch(`${API_BASE}/equipos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// Componentes
export const componentesApi = {
  getByEquipo: (equipoId: number) =>
    fetch(`${API_BASE}/equipos/${equipoId}/componentes`).then(handleResponse),
  create: (equipoId: number, data: Record<string, unknown>) =>
    fetch(`${API_BASE}/equipos/${equipoId}/componentes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  update: (id: number, data: Record<string, unknown>) =>
    fetch(`${API_BASE}/componentes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  delete: (id: number) =>
    fetch(`${API_BASE}/componentes/${id}`, { method: 'DELETE' }).then(handleResponse),
};

// Hojas de Vida
export const hojasVidaApi = {
  getByEquipo: (equipoId: number) =>
    fetch(`${API_BASE}/equipos/${equipoId}/hojas-vida`).then(handleResponse),
  create: (equipoId: number, data: Record<string, unknown>) =>
    fetch(`${API_BASE}/equipos/${equipoId}/hojas-vida`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// Estadísticas
export const estadisticasApi = {
  get: () => fetch(`${API_BASE}/estadisticas`).then(handleResponse),
};
