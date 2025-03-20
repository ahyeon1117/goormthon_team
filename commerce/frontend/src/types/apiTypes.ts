// API 응답 타입 정의
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 백엔드에서 받는 상품 데이터 타입
export interface ProductApiItem {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: number;
  publisher: string;
  pubdate: string;
  isbn: string;
}

// 프론트엔드에서 사용하는 BookItem과 백엔드 ProductApiItem 간의 매핑 함수
export const mapProductApiToBookItem = (product: ProductApiItem, index: number): import('./index').BookItem => {
  return {
    // ISBN을 고유 식별자로 사용 (없는 경우에만 index 기반 임시 ID 생성)
    id: product.isbn || `book-${index}`,
    title: product.title,
    imageUrl: product.image,
    author: product.author,
    publisher: product.publisher,
    publishDate: product.pubdate,
    price: product.discount || 0,
    rating: 0, // 백엔드에서 제공하지 않는 정보는 기본값 설정
    reviewCount: 0, // 백엔드에서 제공하지 않는 정보는 기본값 설정
    isFavored: false,
    isChecked: false
  };
};
