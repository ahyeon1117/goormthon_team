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
