import { useState, ChangeEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as S from "./DetailPage.styled";
import { getProductById } from "../../api/productApi";
import { BookItem } from "../../types";

// 상품 정보 인터페이스
interface Product {
  id: string; // 상품 고유 ID
  title: string;
  author: string;
  translator?: string;
  publisher: string;
  publishDate: string;
  rating: number;
  reviewCount: number;
  price: number;
  imageUrl: string;
  isbn?: string; // ISBN은 별도 필드로 저장
  description?: string;
}

// BookItem을 Product로 변환하는 함수
const mapBookItemToProduct = (bookItem: BookItem): Product => {
  return {
    id: bookItem.id, // 고유 ID
    title: bookItem.title,
    author: bookItem.author,
    publisher: bookItem.publisher,
    publishDate: bookItem.publishDate,
    rating: bookItem.rating,
    reviewCount: bookItem.reviewCount,
    price: bookItem.price,
    imageUrl: bookItem.imageUrl,
    isbn: bookItem.isbn,
    description: bookItem.description,
  };
};

// 임시 상품 데이터
const mockProduct: Product = {
  id: "1", // 고유 ID
  title: "자바스크립트 디자인 패턴",
  author: "에디 오스마니",
  translator: "윤병식",
  publisher: "한빛미디어",
  publishDate: "2024년 08월 01일",
  rating: 9.06,
  reviewCount: 15,
  price: 25200,
  imageUrl:
    "https://shopping-phinf.pstatic.net/main_4933517/49335174628.20240725071120.jpg",
  isbn: "1234567890",
  description:
    "이 책은 자바스크립트 언어로 구현한 23가지 디자인 패턴을 소개합니다. 객체 지향 디자인 패턴을 자바스크립트 환경에 맞게 응용하는 방법을 설명하고, 각 패턴의 실제 사용 사례와 함께 코드 예제를 제공합니다.",
};

// 상품 상세 페이지 컴포넌트
const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [reviewText, setReviewText] = useState(""); // 리뷰 텍스트 상태
  const [reviews, setReviews] = useState<string[]>([]); // 리뷰 목록 상태

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      console.log(`상세 페이지 - 상품 ID(${id}) 도서 정보 요청 중...`);

      try {
        if (id) {
          // API에서 상품 정보 가져오기 시도 (ID로 조회)
          const bookItem = await getProductById(id);

          if (bookItem) {
            // 실제 데이터가 있으면 변환해서 사용
            const productData = mapBookItemToProduct(bookItem);
            console.log("도서 데이터 불러오기 성공:", productData.title);
            setProduct(productData);
          } else {
            // API 요청 실패 시 임시 데이터 사용 (개발 중에만 사용)
            console.warn("API 요청 실패, 임시 데이터 사용");
            setProduct(mockProduct);
          }
        } else {
          console.error("도서 ID가 제공되지 않았습니다.");
          setProduct(null);
        }
      } catch (error) {
        console.error("도서 데이터 로딩 중 오류:", error);
        // 오류 발생 시 임시 데이터 사용 (개발 중에만 사용)
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 수량 증가 함수
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // 수량 감소 함수
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // 탭 변경 함수
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 위시리스트 토글 함수
  const toggleWishlist = () => {
    setIsWishlist((prev) => !prev);
  };

  // 리뷰 추가 함수
  const handleAddReview = () => {
    if (reviewText.trim()) {
      setReviews((prevReviews) => [...prevReviews, reviewText]);
      setReviewText(""); // 리뷰 작성 후 텍스트 초기화
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return <S.DetailPageWrapper>로딩 중...</S.DetailPageWrapper>;
  }

  // 상품이 없을 때 표시
  if (!product) {
    return <S.DetailPageWrapper>상품을 찾을 수 없습니다.</S.DetailPageWrapper>;
  }

  // 총 가격 계산
  const totalPrice = product.price * quantity;

  return (
    <S.DetailPageWrapper>
      <S.DetailContainer>
        <S.ProductImage src={product.imageUrl} alt={product.title} />
        <S.ProductDetails>
          <S.ProductInfoSection>
            <S.BookTypeTag>소득공제</S.BookTypeTag>
            <S.ProductTitle>{product.title}</S.ProductTitle>
            <S.ProductAuthor>
              {product.author} <span style={{ color: "#666" }}>저자</span>{" "}
              {product.translator && `| ${product.translator} `}
              <span style={{ color: "#666" }}>
                {product.translator && "역자"}
              </span>
            </S.ProductAuthor>
            <S.ProductPublisher>
              {product.publisher} | {product.publishDate}
            </S.ProductPublisher>
            <S.ProductRating>
              <span className="stars">★</span>
              <span className="rating">{product.rating.toFixed(2)}</span>
              <span className="review-count">({product.reviewCount})</span>
            </S.ProductRating>
          </S.ProductInfoSection>

          <S.PriceSection>
            <S.Price>{product.price.toLocaleString()}원</S.Price>
          </S.PriceSection>

          <S.ShippingInfoSection>
            <S.SectionTitle>배송정보</S.SectionTitle>
            <S.ShippingInfoRow>
              <span>배송비</span>
              <span>무료</span>
            </S.ShippingInfoRow>
            <S.ShippingInfoRow>
              <span>배송지</span>
              <span>
                서울특별시 종로구 이화동 123{" "}
                <span
                  style={{
                    color: "#E896FF",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  지역변경 ▾
                </span>
              </span>
            </S.ShippingInfoRow>
          </S.ShippingInfoSection>

          <S.QuantityAndPriceContainer>
            <S.QuantityControl>
              <div>
                <S.QuantityButton onClick={decreaseQuantity}>
                  -
                </S.QuantityButton>
                <S.QuantityInput
                  type="number"
                  value={quantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setQuantity(parseInt(e.target.value) || 1)
                  }
                  min="1"
                />
                <S.QuantityButton onClick={increaseQuantity}>
                  +
                </S.QuantityButton>
              </div>
            </S.QuantityControl>

            <S.TotalPriceSection>
              <S.TotalPriceLabel>총 상품 금액</S.TotalPriceLabel>
              <S.TotalPriceValue>
                {totalPrice.toLocaleString()}원
              </S.TotalPriceValue>
            </S.TotalPriceSection>
          </S.QuantityAndPriceContainer>

          <S.ButtonsSection>
            <S.WishlistButton onClick={toggleWishlist}>
              {isWishlist ? (
                <S.FavoredHeartIcon>
                  <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
                </S.FavoredHeartIcon>
              ) : (
                <S.UnfavoredHeartIcon>
                  <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
                </S.UnfavoredHeartIcon>
              )}
            </S.WishlistButton>
            <S.CartButton>장바구니</S.CartButton>
            <S.PurchaseButton>바로구매</S.PurchaseButton>
          </S.ButtonsSection>
        </S.ProductDetails>
      </S.DetailContainer>

      <S.TabsSection>
        <S.TabButton
          $active={activeTab === "info"}
          onClick={() => handleTabChange("info")}
        >
          도서정보
        </S.TabButton>
        <S.TabButton
          $active={activeTab === "review"}
          onClick={() => handleTabChange("review")}
        >
          리뷰 ({product.reviewCount})
        </S.TabButton>
        <S.TabButton
          $active={activeTab === "shipping"}
          onClick={() => handleTabChange("shipping")}
        >
          배송/반품
        </S.TabButton>
      </S.TabsSection>

      {/* 탭 내용 */}
      {activeTab === "info" && (
        <S.TabContent>
          <S.BookDescriptionSection>
            <S.BookDescriptionTitle>도서 소개</S.BookDescriptionTitle>
            <S.BookDescriptionText>
              {product.description || "이 도서에 대한 설명이 없습니다."}
            </S.BookDescriptionText>
          </S.BookDescriptionSection>
          <S.BookDescriptionSection>
            <S.BookDescriptionTitle>상세 정보</S.BookDescriptionTitle>
            <S.BookInfoTable>
              <tbody>
                <S.BookInfoRow>
                  <S.BookInfoLabel>제목</S.BookInfoLabel>
                  <S.BookInfoValue>{product.title}</S.BookInfoValue>
                </S.BookInfoRow>
                <S.BookInfoRow>
                  <S.BookInfoLabel>저자</S.BookInfoLabel>
                  <S.BookInfoValue>{product.author}</S.BookInfoValue>
                </S.BookInfoRow>
                {product.translator && (
                  <S.BookInfoRow>
                    <S.BookInfoLabel>역자</S.BookInfoLabel>
                    <S.BookInfoValue>{product.translator}</S.BookInfoValue>
                  </S.BookInfoRow>
                )}
                <S.BookInfoRow>
                  <S.BookInfoLabel>출판사</S.BookInfoLabel>
                  <S.BookInfoValue>{product.publisher}</S.BookInfoValue>
                </S.BookInfoRow>
                <S.BookInfoRow>
                  <S.BookInfoLabel>출판일</S.BookInfoLabel>
                  <S.BookInfoValue>{product.publishDate}</S.BookInfoValue>
                </S.BookInfoRow>
                <S.BookInfoRow>
                  <S.BookInfoLabel>ISBN</S.BookInfoLabel>
                  <S.BookInfoValue>{product.isbn || "ISBN 정보 없음"}</S.BookInfoValue>
                </S.BookInfoRow>
              </tbody>
            </S.BookInfoTable>
          </S.BookDescriptionSection>
        </S.TabContent>
      )}


      {activeTab === "review" && (
        <S.TabContent>
          <S.ReviewForm>
            <S.ReviewTitle>리뷰 작성</S.ReviewTitle>
            <S.ReviewInput
              value={reviewText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setReviewText(e.target.value)
              }
              placeholder="리뷰를 작성해주세요."
            />
            <S.ReviewButton onClick={handleAddReview}>리뷰 추가</S.ReviewButton>
          </S.ReviewForm>

          <S.ReviewList>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <S.ReviewItem key={index}>
                  <S.ReviewAuthor>작성자</S.ReviewAuthor>
                  <S.ReviewText>{review}</S.ReviewText>
                </S.ReviewItem>
              ))
            ) : (
              <p>아직 등록된 리뷰가 없습니다.</p>
            )}
          </S.ReviewList>
        </S.TabContent>
      )}

      {activeTab === "shipping" && (
        <S.TabContent>
          <h3>배송 및 반품 정보</h3>
          <p>배송비: 무료</p>
          <p>배송방법: 택배</p>
          <p>반품/교환 안내: 상품 수령 후 7일 이내 가능</p>
        </S.TabContent>
      )}
    </S.DetailPageWrapper>
  );
};

export default DetailPage;
