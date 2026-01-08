import api from './index';

export const crudAPI = {

  //User
  getUser: () => api.get('/users/list_users/'),

  // Productos
  getProductos: () => api.get('/productos/'),
  getProducto: (id) => api.get(`/productos/${id}/`),
  crearProducto: (producto) => api.post('/productos/', producto),
  actualizarProducto: (id, producto) => api.put(`/productos/${id}/`, producto),
  eliminarProducto: (id) => api.delete(`/productos/${id}/`),
  
  // Usuarios
  getUsuarios: () => api.get('/usuarios/'),
  crearUsuario: (usuario) => api.post('/usuarios/', usuario),
  
  // Endpoint simple
  crearRegistroSimple: (data) => api.post('/crear-simple/', data),
  
  // Método genérico para probar conexión
  testPost: async (data) => {
    try {
      const response = await api.post('/crear-simple/', data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      };
    }
  }
};