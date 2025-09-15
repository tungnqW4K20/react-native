import api from './api'
export const cartService = {
  // Lấy danh sách giỏ hàng
  getCart: async () => {
    const response = await api.get('/carts')
    return response.data
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (data: {
    product_id: number
    color_product_id: number
    size_product_id: number
    quantity: number
    image_url?: string
  }) => {
    const response = await api.post('/carts', data)
    return response.data
  },


  deleteCart: async (id: number) => {
    const response = await api.delete(`/carts/${id}`)
    return response.data
  },
  
  updateCart: async (id: number, quantity: number) => {
    const response = await api.put(`/carts/${id}`, {
      quantity
    })
    return response.data
  }
}

