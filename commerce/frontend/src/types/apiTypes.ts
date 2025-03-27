// API 응답 타입 정의
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}


// 회원가입 데이터 타입
export interface SignupRequest {
  userId: string;       // 사용자 아이디 (예: 이메일)
  password: string;     // 비밀번호
  nickname: string;     // 닉네임
}

// 백엔드에서 받는 상품 데이터 타입
export interface ProductApiItem {
  id: string;           // 상품 고유 ID
  title: string;
  link: string;
  image: string;
  author: string;
  discount: number;
  publisher: string;
  pubdate: string;
  isbn?: string;
  description?: string;
}

/**
 * 저자 이름 구분자 변경 함수
 * 백엔드에서 공동저자를 '^' 구분자로 전달받아 ', '로 변경합니다.
 */
export const formatAuthor = (author: string): string => {
  return author.replace(/\^/g, ', ');
};

// 프론트엔드에서 사용하는 BookItem과 백엔드 ProductApiItem 간의 매핑 함수
export const mapProductApiToBookItem = (product: ProductApiItem, index: number): import('./index').BookItem => {
  return {
    // 고유 ID 사용 (없는 경우에만 index 기반 임시 ID 생성)
    id: product.id || `book-${index}`,
    title: product.title,
    imageUrl: product.image,
    author: formatAuthor(product.author),
    publisher: product.publisher,
    publishDate: product.pubdate,
    price: product.discount || 0,
    rating: 0, // 백엔드에서 제공하지 않는 정보는 기본값 설정
    reviewCount: 0, // 백엔드에서 제공하지 않는 정보는 기본값 설정
    isFavored: false,
    isChecked: false,
    isbn: product.isbn,
    description: product.description
  };
};
