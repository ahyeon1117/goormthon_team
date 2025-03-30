import { OrderResponse } from "../types/apiTypes";
import { apiRequest } from "./client";

// 주문 API 엔드포인트
const ORDER_API = {
    CREATE_DIRECT_ORDER: '/api/v1/orders/direct',
    CREATE_ORDER_FROM_CART: '/api/v1/orders/cart',
};

/**
 * 단일 상품 주문 생성 (바로 구매)
 */
export const createDirectOrder = async (productId: number, paymentMethod: string): Promise<OrderResponse | null> => {
    const response = await apiRequest.post<OrderResponse>(ORDER_API.CREATE_DIRECT_ORDER, {
        productId,
        paymentMethod
    });
    
    return response.data.data;
};
/**
 * 장바구니 상품 주문 생성
 */
export const createCartOrder = async (paymentMethod: string): Promise<OrderResponse | null> => {
    const response = await apiRequest.post<OrderResponse>(ORDER_API.CREATE_ORDER_FROM_CART, {
        paymentMethod
    });

    return response.data.data;
};