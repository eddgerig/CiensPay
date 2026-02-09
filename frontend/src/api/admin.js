import api from './index';

export const adminAPI = {
  /**
   * GET /api/admin/users-cards/
   * Returns users with their associated cards
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.page_size - Items per page (default: 20, max: 100)
   * @param {string} params.search - Search by name, email, or document number
   * @param {string} params.status - Filter by user status
   * @param {string} params.has_card - Filter users with/without cards ("true" or "false")
   * @param {string} params.card_active - Filter by active/inactive cards ("true" or "false")
   * @returns {Promise} Response with users and cards data
   */
  getUsersWithCards: (params = {}) => api.get('/admin/users-cards/', { params }),
  
  /**
   * GET /api/admin/users/<id>/
   * Returns specific user details with cards
   * @param {number} id - User ID
   * @returns {Promise} Response with user details
   */
  getUserDetail: (id) => api.get(`/admin/users/${id}/`),

  /**
   * PATCH /api/admin/users/<id>/
   * Updates a user with partial data
   * @param {number} id - User ID
   * @param {Object} data - Partial user data to update
   * @returns {Promise} Response with updated user data
   */
  updateUser: (id, data) => api.patch(`/admin/users/${id}/`, data),
  
  /**
   * DELETE /api/admin/users/<id>/
   * Deletes a user (soft delete by default)
   * @param {number} id - User ID
   * @param {boolean} hard - If true, permanently deletes the user
   * @returns {Promise} Response confirming deletion
   */
  deleteUser: (id, hard = false) => api.delete(`/admin/users/${id}/`, {
    params: { hard: hard ? 'true' : 'false' }
  }),
};
