import { apiRequest } from './client';
import { CartItemDto, CartItemsResponse, CartActionResponse } from '../types/apiTypes';

// 장바구니 API 엔드포인트
const CART_API = {
  ADD: '/api/v1/cart/add',
  VIEW: '/api/v1/cart/view',
  REMOVE: '/api/v1/cart/remove', // 단일 상품 삭제
  REMOVE_MULTIPLE: '/api/v1/cart/remove-multiple', // 여러 상품 삭제
};

/**
 * 장바구니에 상품 추가하는 함수
 */
export const addToCart = async (productId: number): Promise<CartActionResponse | null> => {
  try {
    console.log(`상품 ID(${productId})를 장바구니에 추가 중...`);

    const response = await apiRequest.post<CartActionResponse>(CART_API.ADD, {
      productId
    });

    if (response.data.code === 200 && response.data.data) {
      console.log('장바구니에 상품 추가 성공:', response.data.data);
      return response.data.data;
    }

    console.error('장바구니에 상품 추가 실패:', response.data.msg);
    return null;
  } catch (error) {
    console.error('장바구니 추가 API 호출 중 오류 발생:', error);
    return null;
  }
};

/**
 * 장바구니 목록을 조회하는 함수
 */
export const getCartItems = async (): Promise<CartItemDto[] | null> => {
  try {
    console.log('장바구니 목록 조회 중...');

    const response = await apiRequest.get<CartItemsResponse>(CART_API.VIEW);
    if (response.data.code === 200 && response.data.data) {
      console.log(`장바구니 조회 결과: ${response.data.data.totalCount}개의 상품이 있습니다.`);
      return response.data.data.cartItems;
    }

    console.error('장바구니 목록 조회 실패:', response.data.msg);
    return null;
  } catch (error) {
    console.error('장바구니 목록 조회 API 호출 중 오류 발생:', error);
    return null;
  }
};

/**
 * 장바구니에서 단일 상품을 삭제하는 함수
 */
export const removeFromCart = async (productId: number): Promise<CartActionResponse | null> => {
  try {
    console.log(`상품 ID(${productId})를 장바구니에서 삭제 중...`);

    const response = await apiRequest.delete<CartActionResponse>(CART_API.REMOVE, {
      data: { productId }
    });

    if (response.data.code === 200 && response.data.data) {
      console.log('장바구니에서 상품 삭제 성공:', response.data.data);
      return response.data.data;
    }

    console.error('장바구니에서 상품 삭제 실패:', response.data.msg);
    return null;
  } catch (error) {
    console.error('장바구니 삭제 API 호출 중 오류 발생:', error);
    return null;
  }
};

/**
 * 장바구니에서 여러 상품을 삭제하는 함수
 */
export const removeMultipleFromCart = async (productIdList: number[]): Promise<CartActionResponse | null> => {
  try {
    console.log(`상품 ID 목록을 장바구니에서 삭제 중...`);

    const response = await apiRequest.delete<CartActionResponse>(CART_API.REMOVE_MULTIPLE, {
      data: { productIdList }
    })

    if (response.data.code === 200 && response.data.data) {
      console.log('장바구니에서 여러 상품 삭제 성공: ', response.data.data);
      return response.data.data;
    }

    console.error('장바구니에서 여러 상품 삭제 실패: ', response.data.msg);
    return null;

  } catch (error) {
    console.error('장바구니 여러 상품 삭제 API 호출 중 오류 발생:', error);
    return null;
  }
};