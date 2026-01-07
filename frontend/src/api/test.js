import api from './index';

export const testAPI = {
  // Test de conexión con el backend
  checkHealth: () => api.get('/health/'),
  
  // Obtener información de la API
  getApiInfo: () => api.get('/info/'),
  
  // Método de prueba
  testConnection: async () => {
    try {
      const response = await api.get('/health/');
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status
      };
    }
  }
};