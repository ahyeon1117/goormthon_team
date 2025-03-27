import { useInventoryStore, getInventoryItemsAsBooks } from '../store/inventoryStore';
import { BookItem } from '../types';
import { useState, useEffect } from 'react';

/**
 * 인벤토리 관련 기능과 상태를 제공하는 커스텀 훅
 */
export function useInventory() {
  const {
    inventoryItems,
    totalCount,
    isLoading,
    error,
    productDetails,
    fetchInventoryItems,
    fetchProductDetails,
    updateLastAccessed,
    setLoading,
    setError
  } = useInventoryStore();

  const [books, setBooks] = useState<BookItem[]>([]);

  // 인벤토리 아이템을 BookItem 형식으로 변환
  useEffect(() => {
    setBooks(getInventoryItemsAsBooks());
  }, [inventoryItems, productDetails]);

  /**
   * 상품의 상세정보를 가져오고 최근 접근 시간 업데이트
   */
  const accessProduct = async (productId: string) => {
    // 접근 시간 업데이트
    await updateLastAccessed(productId);

    // 상세 정보가 없으면 가져오기
    if (!productDetails[productId]) {
      await fetchProductDetails(productId);
    }

    return productDetails[productId] || null;
  };

  /**
   * 인벤토리가 비어있는지 확인
   */
  const isInventoryEmpty = (): boolean => {
    return totalCount === 0 || inventoryItems.length === 0;
  };

  /**
   * 상품이 인벤토리에 있는지 확인
   */
  const isProductInInventory = (productId: string | number): boolean => {
    const id = typeof productId === 'string' ? productId : productId.toString();
    return inventoryItems.some(item => item.productId.toString() === id);
  };

  return {
    // 상태
    inventoryItems,
    totalCount,
    isLoading,
    error,
    productDetails,
    books,

    // 액션
    fetchInventoryItems,
    fetchProductDetails,
    updateLastAccessed,
    accessProduct,
    setLoading,
    setError,

    // 유틸리티
    isInventoryEmpty,
    isProductInInventory,
  };
}
