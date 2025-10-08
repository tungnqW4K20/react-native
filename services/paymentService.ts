import api from './api'; // Giả sử bạn có một file cấu hình axios instance

export const paymentService = {
  createPaymentUrl: (orderId: number, amount: number): Promise<{ success: boolean; data: string }> => {
    return api.post('/payment/create_payment_url', {
      orderId,
      amount,
      orderDescription: `Thanh toan cho don hang YODY${orderId}`,
      bankCode:"NCB"
    }).then(res => res.data); // Giả định API trả về { success: true, data: 'URL' }
  }
};