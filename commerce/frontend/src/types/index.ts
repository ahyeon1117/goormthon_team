// 도서 아이템 타입 정의
export interface BookItem {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  publisher: string;
  publishDate: string;
  price: number;
  rating: number;
  reviewCount: number;
  isFavored?: boolean;
  isChecked?: boolean;
  isbn?: string;
  description?: string;
}

// 필터 옵션 타입 정의
export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

// 정렬 옵션 타입 정의
export interface SortOption {
  id: string;
  label: string;
}

// BestNew 컴포넌트 - 도서 타입 정의
export interface BestNewBook {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  publisher: string;
}

// 바로 구매 주문 상품 타입
export interface DirectOrderItemType {
  productId: number;
  title: string;
  discount: number;
  image: string;
  author: string;
  publisher: string;
}