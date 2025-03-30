import { OrderResponse, ProductResponse } from "../types/apiTypes";
import { apiRequest } from "./client";

// 주문 API 엔드포인트
const ORDER_API = {
    CREATE_ORDER: '/api/v1/orders/create',
    GET_ORDERS: '/api/v1/orders/view',
    GET_ORDER_ITEMS: '/api/v1/orders/view-items',
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

// 현재 로그인한 사용자의 주문 상품 목록 조회
export const getCurrentUserOrderItems = async (): Promise<ProductResponse[]> => {
    const response = await apiRequest.get<ProductResponse[]>(ORDER_API.GET_ORDER_ITEMS);

    return response.data.data;
};
