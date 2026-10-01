const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Fetch all vehicles from MySQL backend
 */
export async function fetchVehiclesFromAPI() {
  const response = await fetch(`${API_BASE_URL}/vehicles`);
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} ao carregar veículos.`);
  }
  return await response.json();
}

/**
 * Create or save a new vehicle in MySQL
 */
export async function saveVehicleToAPI(vehicleData) {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erro ao salvar veículo no banco.`);
  }
  return await response.json();
}

/**
 * Update existing vehicle in MySQL
 */
export async function updateVehicleInAPI(id, vehicleData) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erro ao atualizar veículo.`);
  }
  return await response.json();
}

/**
 * Delete vehicle from MySQL
 */
export async function deleteVehicleFromAPI(id) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erro ao deletar veículo.`);
  }
  return await response.json();
}

/**
 * Toggle featured vehicle status in MySQL
 */
export async function toggleFeaturedInAPI(id) {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}/featured`, {
    method: 'PATCH'
  });
  if (!response.ok) {
    throw new Error(`Erro ao alterar destaque.`);
  }
  return await response.json();
}

/**
 * Upload real car photos to backend
 */
export async function uploadPhotosToAPI(fileList) {
  const formData = new FormData();
  for (let i = 0; i < fileList.length; i++) {
    formData.append('photos', fileList[i]);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Erro no upload de fotos.');
  }

  const data = await response.json();
  return data.urls; // Array of hosted URLs
}

/**
 * Send customer lead / trade-in evaluation to MySQL
 */
export async function sendLeadToAPI(leadData) {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao registrar proposta.');
  }
  return await response.json();
}

/**
 * Fetch real database stats
 */
export async function fetchStatsFromAPI() {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error('Erro ao buscar estatísticas.');
  }
  return await response.json();
}
