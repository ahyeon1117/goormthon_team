import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '../api/client';
import { CartItemDto, mapCartItemToBookItem } from '../types/apiTypes';
import { BookItem } from '../types';

// 장바구니 스토어 상태 타입 정의
interface CartState {
  cartItems: CartItemDto[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchCartItems: () => Promise<void>;
  addToCart: (productId: string) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  removeMultipleFromCart: (productIdList: string[]) => Promise<boolean>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      totalCount: 0,
      isLoading: false,
      error: null,

      // 장바구니 아이템 조회
      fetchCartItems: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.get('/api/v1/cart/view');
          const { cartItems, totalCount } = response.data.data;
          set({ cartItems, totalCount, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '장바구니 조회 중 오류가 발생했습니다.',
            isLoading: false
          });
        }
      },

      // 장바구니에 상품 추가
      addToCart: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.post('/api/v1/cart/add', { productId });

          if (response.data.code === 200) {
            await get().fetchCartItems(); // 장바구니 정보 갱신
            return true;
          }
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '장바구니 추가 중 오류가 발생했습니다.',
            isLoading: false
          });
          return false;
        }
      },

      // 장바구니에서 상품 제거
      removeFromCart: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.delete('/api/v1/cart/remove', {
            data: { productId }
          });

          if (response.data.code === 200) {
            await get().fetchCartItems(); // 장바구니 정보 갱신
            return true;
          }
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '장바구니 삭제 중 오류가 발생했습니다.',
            isLoading: false
          });
          return false;
        }
      },

      // 장바구니 비우기
      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.delete('/api/v1/cart/clear');

          if (response.data.code === 200) {
            set({ cartItems: [], totalCount: 0, isLoading: false });
            return true;
          }
          return false;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '장바구니 비우기 중 오류가 발생했습니다.',
            isLoading: false
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
      },

      // 장바구니에서 여러 상품 제거
      removeMultipleFromCart: async (productIdList: string[]) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.delete('/api/v1/cart/remove-multiple', {
            data: { productIdList }
          });

          if (response.data.code === 200) {
            await get().fetchCartItems(); // 장바구니 정보 갱신
            return true;
          }
          return false;

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '장바구니에서 여러 상품 삭제 중 오류가 발생했습니다.',
            isLoading: false
          });
          return false;
        }
      }
    }),
    {
      name: 'cart-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
      // 지속성을 가질 상태만 선택적으로 저장
      partialize: (state) => ({
        cartItems: state.cartItems,
        totalCount: state.totalCount
      }),
    }
  )
);

// 장바구니 아이템을 BookItem으로 변환하는 유틸리티 함수
export const getCartItemsAsBooks = (): BookItem[] => {
  const { cartItems } = useCartStore.getState();
  return cartItems.map(mapCartItemToBookItem);
};

