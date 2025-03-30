// API 응답 타입 정의
export interface ApiResponse<T> {
  code: number;
  msg?: string;
  message?: string;
  data: T;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string;
  error?: string;
  success: boolean;
  message?: string;
}

//닉네임 수정
export interface UpdateNicknameRequest {
  nickname: string;
}

// 구매 도서 인터페이스 정의
export interface MyBook {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  publisher: string;
  purchaseDate: string;
}

// 리뷰 응답 데이터 타입
export interface ReviewResponseDto {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  productId: number;
}

// 리뷰 생성 요청 데이터 타입
export interface ReviewRequestDto {
  userId: string;
  productId: number;
  title: string;
  message: string;
}

// 찜하기 API 관련 타입 정의
export interface WishItemRequest {
  productId: number;
}

export interface WishItemResponse {
  id: number;
  productId: number;
  title: string;
  image: string;
  author: string;
  discount: number;
  publisher: string;
  createdAt: string | null;
}

// 찜하기 작업 결과 타입 정의
export interface WishResult {
  id: string;
  success: boolean;
  error: Error | null;
}

export interface ApiWishResponse {
  wishItems: WishItemResponse[];
  totalCount: number;
}

// 회원가입 데이터 타입
export interface SignupRequest {
  userId: string;       // 사용자 아이디 (예: 이메일)
  password: string;     // 비밀번호
  nickname: string;     // 닉네임
}

// 백엔드에서 받는 상품 데이터 타입
export interface ProductResponse {
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

// 장바구니 아이템 인터페이스
export interface CartItemDto {
  id: number;
  productId: number;
  title: string;
  image: string;
  author: string;
  discount: number;
  publisher: string;
  createdAt: string;
}

// 장바구니 조회 응답 인터페이스
export interface CartItemsResponse {
  cartItems: CartItemDto[];
  totalCount: number;
}

// 장바구니 상품 추가/삭제 응답 인터페이스
export interface CartActionResponse {
  result: string;
}

// 인벤토리 아이템 인터페이스
export interface InventoryItemDto {
  id: number;
  productId: number;
  productTitle: string;
  lastAccessed: string;
}

// 인벤토리 조회 응답 인터페이스
export interface InventoryItemsResponse {
  inventoryItems: InventoryItemDto[];
  totalCount: number;
}

/**
 * 저자 이름 구분자 변경 함수
 * 백엔드에서 공동저자를 '^' 구분자로 전달받아 ', '로 변경합니다.
 */
export const formatAuthor = (author: string): string => {
  return author.replace(/\^/g, ', ');
};

// 프론트엔드에서 사용하는 BookItem과 백엔드 ProductApiItem 간의 매핑 함수
export const mapProductApiToBookItem = (product: ProductResponse, index: number): import('./index').BookItem => {
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

/**
 * 장바구니 아이템을 프론트엔드 BookItem 형식으로 변환하는 유틸리티 함수
 */
export const mapCartItemToBookItem = (cartItem: CartItemDto): import('./index').BookItem => {
  return {
    id: cartItem.productId.toString(),
    title: cartItem.title,
    imageUrl: cartItem.image,
    author: formatAuthor(cartItem.author),  // 작가 이름 포맷 변경
    publisher: cartItem.publisher,
    publishDate: '',  // 카트 아이템에는 출판일이 없으므로 빈 문자열 사용
    price: cartItem.discount,
    rating: 0,  // 기본값
    reviewCount: 0,   // 기본값
    isFavored: false,
    isChecked: true,  // 장바구니에 추가된 상품은 기본적으로 체크됨
  };
};

/**
 * 인벤토리 아이템을 프론트엔드 BookItem 형식으로 변환하는 유틸리티 함수
 * 참고: 인벤토리 아이템에는 제한된 정보만 있으므로, 나머지는 기본값 설정
 */
export const mapInventoryItemToBookItem = (
  inventoryItem: InventoryItemDto,
  productDetails?: Partial<ProductResponse>
): import('./index').BookItem => {
  // 상품 상세 정보가 제공된 경우 해당 정보 사용, 아니면 기본값 사용
  return {
    id: inventoryItem.productId.toString(),
    title: inventoryItem.productTitle,
    imageUrl: productDetails?.image || '/placeholder.jpg', // 기본 이미지 경로 제공
    author: productDetails?.author ? formatAuthor(productDetails.author) : '',
    publisher: productDetails?.publisher || '',
    publishDate: productDetails?.pubdate || '',
    price: productDetails?.discount || 0,
    rating: 0,  // 기본값
    reviewCount: 0,  // 기본값
    isFavored: false,
    isChecked: false,
  };
};

/**
 * 백엔드에서 받은 도서 데이터를 BestNewBook 타입으로 변환하는 함수
 */
export const mapProductResToBestNewBook = (product: ProductResponse, index: number): import('./index').BestNewBook => {
  const shortTitle = product.title.split('(')[0].trim();

  return {
    id: product.id || `book-${index}`,
    title: shortTitle,
    imageUrl: product.image,
    author: formatAuthor(product.author),
    publisher: product.publisher
  };
};

// 주문 응답 인터페이스
export interface OrderResponse {
  id: number;
  orderStatus: string;
  totalPrice: number;
  paymentMethod: string;
  createdAt: string;
  orderItems: OrderItemDto[];
}

// 주문 아이템 인터페이스
export interface OrderItemDto {
  id: number;
  productId: number;
}
