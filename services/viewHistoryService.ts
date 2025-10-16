// services/viewHistoryService.js
import api from './api'

// Dữ liệu ghi lại mỗi lần xem sản phẩm
interface ViewHistoryPayload {
  productId: number
}

// Service quản lý lịch sử xem gần đây
export const viewHistoryService = {
  addView: async (productId: number) => {
    const response = await api.post('/view-history', { productId })
    return response.data
  },

  getHistory: async () => {
    const response = await api.get('/view-history')
    return response.data
  },

  clearHistory: async () => {
    const response = await api.delete('/view-history')
    return response.data
  },
}
