import { apiRequest } from './client';
import { WishItemRequest, WishItemResponse, GetWishItemsResponse } from '../types/apiTypes';

// 찜하기 API 엔드포인트
const WISH_API = {
  ADD: '/api/v1/wish/add',
  VIEW: '/api/v1/wish/view',
  REMOVE: '/api/v1/wish/remove',
};

/**
 * 찜하기에 상품을 추가하는 함수
 */
export const addWishItem = async (productId: number): Promise<boolean> => {
  try {
    const requestData: WishItemRequest = { productId };
    const response = await apiRequest.post<WishItemResponse>(WISH_API.ADD, requestData);

    if (response.data.code === 200) {
      console.log('상품을 찜 목록에 추가했습니다.');
      return true;
    }

    console.error('찜하기 추가 실패:', response.data.msg);
    return false;
  } catch (error) {
    console.error('찜하기 추가 API 호출 중 오류 발생:', error);
    return false;
  }
};

/**
 * 현재 로그인한 사용자의 찜하기 목록을 조회하는 함수
 */
export const getWishItems = async (): Promise<WishItemResponse[]> => {
  try {
    const response = await apiRequest.get<GetWishItemsResponse>(WISH_API.VIEW);

    if (response.data.code === 200 && response.data.data) {
      return response.data.data.items || [];
    }

    console.error('찜 목록 조회 실패:', response.data.msg);
    return [];
  } catch (error) {
    console.error('찜 목록 조회 API 호출 중 오류 발생:', error);
    return [];
  }
};

/**
 * 찜하기에서 상품을 삭제하는 함수
 */
export const removeWishItem = async (productId: number): Promise<boolean> => {
  try {
    const requestData: WishItemRequest = { productId };
    const response = await apiRequest.delete<WishItemResponse>(WISH_API.REMOVE, {
      data: requestData
    });

    if (response.data.code === 200) {
      console.log('상품을 찜 목록에서 삭제했습니다.');
      return true;
    }

    console.error('찜하기 삭제 실패:', response.data.msg);
    return false;
  } catch (error) {
    console.error('찜하기 삭제 API 호출 중 오류 발생:', error);
    return false;
  }
};
