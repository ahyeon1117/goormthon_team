import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '../api/client';
import { InventoryItemDto, ProductResponse, mapInventoryItemToBookItem } from '../types/apiTypes';
import { BookItem } from '../types';

// 인벤토리 스토어 상태 타입 정의
interface InventoryState {
  inventoryItems: InventoryItemDto[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  productDetails: Record<string, ProductResponse>; // productId를 키로 사용하는 상품 상세 정보

  // 액션
  fetchInventoryItems: () => Promise<void>;
  fetchProductDetails: (productId: string) => Promise<ProductResponse | null>;
  updateLastAccessed: (productId: string) => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      inventoryItems: [],
      totalCount: 0,
      isLoading: false,
      error: null,
      productDetails: {},

      // 인벤토리 아이템 조회
      fetchInventoryItems: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.get('/api/v1/inventory/view');
          const { inventoryItems, totalCount } = response.data.data;
          set({ inventoryItems, totalCount, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '인벤토리 조회 중 오류가 발생했습니다.',
            isLoading: false
          });
        }
      },

      // 상품 상세 정보 조회
      fetchProductDetails: async (productId: string) => {
        try {
          // 이미 상세 정보가 있으면 재사용
          if (get().productDetails[productId]) {
            return get().productDetails[productId];
          }

          const response = await apiClient.get(`/api/v1/products/${productId}`);
          if (response.data.code === 200) {
            const productDetail = response.data.data;
            // 상품 상세 정보 캐시 업데이트
            set(state => ({
              productDetails: {
                ...state.productDetails,
                [productId]: productDetail
              }
            }));
            return productDetail;
          }
          return null;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '상품 상세 정보 조회 중 오류가 발생했습니다.'
          });
          return null;
        }
      },

      // 마지막 접근 시간 업데이트
      updateLastAccessed: async (productId: string) => {
        try {
          const response = await apiClient.put(`/api/v1/inventory/${productId}/access`);
          if (response.data.code === 200) {
            // 인벤토리 정보 다시 불러오기
            await get().fetchInventoryItems();
            return true;
          }
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '접근 시간 업데이트 중 오류가 발생했습니다.'
          });
          return false;
        }
      },

      // 로딩 상태 설정
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // 에러 상태 설정
      setError: (error: string | null) => {
        set({ error });
      }
    }),
    {
      name: 'inventory-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
      // 지속성을 가질 상태만 선택적으로 저장
      partialize: (state) => ({
        inventoryItems: state.inventoryItems,
        totalCount: state.totalCount,
        productDetails: state.productDetails
      }),
    }
  )
);

// 인벤토리 아이템을 BookItem으로 변환하는 유틸리티 함수
export const getInventoryItemsAsBooks = (): BookItem[] => {
  const { inventoryItems, productDetails } = useInventoryStore.getState();
  return inventoryItems.map(item =>
    mapInventoryItemToBookItem(item, productDetails[item.productId])
  );
};
