import axiosInstance from './config';
const paymentApi = { 

    createPayment: async (userId, amount, orderId, subscriptionId) => {
        try {
            const response = await axiosInstance.put('/Payment/create-momo', {
                userId,
                amount,
                orderId,
                subscriptionId
            });

            if (response.status === 200 && response.data.status === 1) {
                return {
                    success: true,
                    data: response.data,
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Failed to create payment',
                };
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            return {
                success: false,
                message: 'An error occurred. Please try again later.',
            };
        }
    }
};

export default paymentApi;
