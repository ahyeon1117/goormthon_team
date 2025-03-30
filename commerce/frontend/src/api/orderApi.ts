import { OrderResponse } from "../types/apiTypes";
import { apiRequest } from "./client";

// 주문 API 엔드포인트
const ORDER_API = {
    CREATE_ORDER: '/api/v1/orders/create',
    GET_ORDERS: '/api/v1/orders/view',
};

export const createOrder = async (paymentMethod: string, productIdList: number[]): Promise<OrderResponse | null> => {
    const response = await apiRequest.post<OrderResponse>(ORDER_API.CREATE_ORDER, {
        productIdList,
        paymentMethod
    });

    return response.data.data;
};

export const getOrders = async (): Promise<OrderResponse[]> => {
    const response = await apiRequest.get<OrderResponse[]>(ORDER_API.GET_ORDERS);
    
    return response.data.data;
};
