import { useCartStore, getCartItemsAsBooks } from '../store/cartStore';
import { BookItem } from '../types';
import { useState, useEffect } from 'react';

/**
 * 장바구니 관련 기능과 상태를 제공하는 커스텀 훅
 */
export function useCart() {
  const {
    cartItems,
    totalCount,
    isLoading,
    error,
    fetchCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    setLoading,
    setError
  } = useCartStore();

  const [books, setBooks] = useState<BookItem[]>([]);

  // 장바구니 아이템을 BookItem 형식으로 변환
  useEffect(() => {
    setBooks(getCartItemsAsBooks());
  }, [cartItems]);

  /**
   * 장바구니에 상품 추가
   */
  const handleAddToCart = async (productId: string): Promise<boolean> => {
    return await addToCart(productId);
  };

  /**
   * 장바구니에서 상품 제거
   */
  const handleRemoveFromCart = async (productId: string): Promise<boolean> => {
    return await removeFromCart(productId);
  };

  /**
   * 장바구니가 비어있는지 확인
   */
  const isCartEmpty = (): boolean => {
    return totalCount === 0 || cartItems.length === 0;
  };

  /**
   * 장바구니 아이템 총 가격 계산
   */
  const calculateTotalPrice = (): number => {
    return books.reduce((total, book) => total + book.price, 0);
  };

  return {
    // 상태
    cartItems,
    totalCount,
    isLoading,
    error,
    books,

    // 액션
    fetchCartItems,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    clearCart,
    setLoading,
    setError,

    // 유틸리티
    isCartEmpty,
    calculateTotalPrice,
  };
}
