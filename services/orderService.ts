// services/orderService.js
import api from './api'

interface OrderItemPayload {
  productId: number
  colorProductId: number
  sizeProductId: number
  quantity: number
  imageUrl?: string
}

interface IUpdateOrderItemPayload {
  id: number;
  status: string
}

export const orderService = {
  createOrder: async (items: OrderItemPayload[]) => {
    const response = await api.post('/orders', { items })
    return response.data
  },

  // Hàm mới để lấy chi tiết đơn hàng
  getOrderById: async (id: number) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  getOrderByCustomer: async () => {
    const response = await api.get(`/orders/customer`)
    return response.data
  },

  updateOrderStatus: async (items: IUpdateOrderItemPayload) => {
    const response = await api.patch(`/orders/${items.id}/status`, { status: items.status })
    return response.data
  },

  getPurchaseCustomer: async () => {
    const response = await api.get(`/orders/my-purchased-products`)
    return response.data
  },
}

