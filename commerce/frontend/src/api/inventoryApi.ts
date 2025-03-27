import { apiRequest } from './client';
import { InventoryItemDto, InventoryItemsResponse } from '../types/apiTypes';

// 인벤토리 API 엔드포인트
const INVENTORY_API = {
  VIEW: '/api/v1/inventory/view',
};

/**
 * 사용자의 인벤토리(서재) 목록을 조회하는 함수
 */
export const getInventoryItems = async (): Promise<InventoryItemDto[] | null> => {
  try {
    console.log('인벤토리(서재) 목록 조회 중...');

    const response = await apiRequest.get<InventoryItemsResponse>(INVENTORY_API.VIEW);
    if (response.data.code === 200 && response.data.data) {
      console.log(`인벤토리 조회 결과: ${response.data.data.totalCount}개의 항목이 있습니다.`);
      return response.data.data.inventoryItems;
    }

    console.error('인벤토리 목록 조회 실패:', response.data.msg);
    return null;
  } catch (error) {
    console.error('인벤토리 목록 조회 API 호출 중 오류 발생:', error);
    return null;
  }
};
