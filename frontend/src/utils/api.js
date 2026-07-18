export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('scanOrderToken')
}

export async function apiRequest(path, options = {}) {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload.data
}

export const api = {
  login: (body) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiRequest('/api/auth/me'),
  getCart: () => apiRequest('/api/cart'),
  addCartItem: (item) => apiRequest('/api/cart/items', { method: 'POST', body: JSON.stringify(item) }),
  updateCartItem: (itemId, quantity) => apiRequest(`/api/cart/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId) => apiRequest(`/api/cart/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiRequest('/api/cart', { method: 'DELETE' }),
  checkout: (paymentMode) => apiRequest('/api/orders/checkout', { method: 'POST', body: JSON.stringify({ paymentMode }) }),
  myOrders: () => apiRequest('/api/orders/my'),
  chefOrders: () => apiRequest('/api/chef/orders'),
  adminOrders: () => apiRequest('/api/admin/orders'),
  updateChefStatus: (userId, status) => apiRequest(`/api/chef/orders/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  markPaid: (userId) => apiRequest(`/api/admin/orders/${userId}/paid`, { method: 'PATCH' }),
  markServed: (userId) => apiRequest(`/api/admin/orders/${userId}/served`, { method: 'PATCH' }),
}
