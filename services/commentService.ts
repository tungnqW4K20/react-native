import api from './api'

export const commentService = {
  createComment: async (payload: {
    product_id?: string | number
    rating?: number
    content: string
    image_urls: string[]
  }) => {
    const response = await api.post('/comments', payload)
    return response.data
  }
}
