import { apiRequest } from './client';
import { WishItemRequest, WishItemResponse, ApiWishResponse } from '../types/apiTypes';

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
    console.log('찜 목록 조회 API 호출 중...');
    const response = await apiRequest.get(WISH_API.VIEW);
    console.log('찜 목록 API 응답:', JSON.stringify(response.data, null, 2));

    if (response.data.code === 200 && response.data.data) {
      // 백엔드 응답 구조에 맞게 데이터 추출
      const data = response.data.data as ApiWishResponse;

      if (Array.isArray(data.wishItems)) {
        console.log(`찜 목록 ${data.wishItems.length}개 항목 조회 성공`);
        return data.wishItems;
      } else {
        console.error('wishItems가 배열이 아닙니다:', data.wishItems);
        return [];
      }
    }

    const errorMsg = response.data.msg || response.data.message || '알 수 없는 오류';
    console.error('찜 목록 조회 실패:', errorMsg);
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
    const response = await apiRequest.delete(WISH_API.REMOVE, {
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
