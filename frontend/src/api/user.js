import api from './index';

export const userAPI = {
  getUserAll: () => api.get('/users/list_all_users/'),
};