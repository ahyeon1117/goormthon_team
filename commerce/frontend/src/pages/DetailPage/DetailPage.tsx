import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as S from "./DetailPage.styled";
import { getProductById } from "../../api/productApi";
import { BookItem } from "../../types";
import { useCart } from "../../hooks";
import { addWishItem, getWishItems, removeWishItem } from "../../api/wishApi";

// 임시 상품 데이터
const mockProduct: BookItem = {
  id: "1", // 고유 ID
  title: "자바스크립트 디자인 패턴",
  author: "에디 오스마니",
  publisher: "한빛미디어",
  publishDate: "2024년 08월 01일",
  rating: 9.06,
  reviewCount: 15,
  price: 25200,
  imageUrl: "https://shopping-phinf.pstatic.net/main_4933517/49335174628.20240725071120.jpg",
  isbn: "1234567890",
  description: "이 책은 자바스크립트 언어로 구현한 23가지 디자인 패턴을 소개합니다. 객체 지향 디자인 패턴을 자바스크립트 환경에 맞게 응용하는 방법을 설명하고, 각 패턴의 실제 사용 사례와 함께 코드 예제를 제공합니다.",
  isFavored: false,
  isChecked: false
};

// 상품 상세 페이지 컴포넌트
const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<BookItem | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [reviewText, setReviewText] = useState(""); // 리뷰 텍스트 상태
  const [reviews, setReviews] = useState<string[]>([]); // 리뷰 목록 상태
  const [wishLoading, setWishLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // 장바구니 관련 훅 사용
  const {
    cartItems,
    fetchCartItems,
    addToCart,
    removeFromCart
  } = useCart();

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      console.log(`상세 페이지 - 상품 ID(${id}) 도서 정보 요청 중...`);

      try {
        if (id) {
          const bookItem = await getProductById(id);

          if (bookItem) {
            console.log("도서 데이터 불러오기 성공:", bookItem.title);
            setProduct(bookItem);
          } else {
            console.warn("API 요청 실패, 임시 데이터 사용");
            setProduct(mockProduct);
          }
        } else {
          console.error("도서 ID가 제공되지 않았습니다.");
          setProduct(null);
        }
      } catch (error) {
        console.error("도서 데이터 로딩 중 오류:", error);
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 컴포넌트 마운트 시 장바구니 데이터 로드
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        console.log('장바구니 데이터 로드 중...');
        await fetchCartItems();
        console.log('장바구니 데이터 로드 완료');
      } catch (error) {
        console.error('장바구니 데이터 로드 실패:', error);
      }
    };

    loadCartItems();
  }, [fetchCartItems]);

  // 상품과 장바구니 아이템이 변경될 때 장바구니 상태 확인
  useEffect(() => {
    const checkCartStatus = () => {
      if (!product) return;

      console.log('장바구니 상태 확인 중...', cartItems);
      console.log('현재 상품 ID:', product.id);

      // 현재 상품이 장바구니에 있는지 확인
      const inCart = cartItems.some(item => {
        const itemId = String(item.productId);
        const productId = String(product.id);
        console.log(`비교: 장바구니 아이템 ID(${itemId}) vs 현재 상품 ID(${productId}), 일치: ${itemId === productId}`);
        return itemId === productId;
      });

      console.log(`상품 ID(${product.id})는 장바구니에 ${inCart ? '있습니다' : '없습니다'}`);
      setIsInCart(inCart);
    };

    checkCartStatus();
  }, [product, cartItems]);

  // 장바구니 토글 함수
  const toggleCart = async () => {
    if (!product) return;

    try {
      setCartLoading(true);
      console.log(`장바구니 토글 시작: isInCart = ${isInCart}, 상품 ID = ${product.id}`);

      if (isInCart) {
        console.log(`상품 ID(${product.id})를 장바구니에서 제거 중...`);
        const success = await removeFromCart(product.id);

        if (success) {
          console.log(`상품 ID(${product.id})를 장바구니에서 제거 완료`);
          setIsInCart(false);
        } else {
          console.error('장바구니에서 제거 실패');
        }
      } else {
        console.log(`상품 ID(${product.id})를 장바구니에 추가 중...`);
        const success = await addToCart(product.id);

        if (success) {
          console.log(`상품 ID(${product.id})를 장바구니에 추가 완료`);
          setIsInCart(true);
        } else {
          console.error('장바구니에 추가 실패');
        }
      }

      // 장바구니 상태 갱신을 위해 데이터 다시 불러오기
      await fetchCartItems();
    } catch (error) {
      console.error('장바구니 작업 중 오류 발생:', error);
    } finally {
      setCartLoading(false);
    }
  };

  // 바로구매 함수
  const handlePurchase = () => {
    if (!product) return;

  };

  // 찜하기 목록 확인
  useEffect(() => {
    const checkWishStatus = async () => {
      if (!product) return;

      try {
        setWishLoading(true);
        console.log('찜 목록을 확인하는 중...');
        const wishItems = await getWishItems();
        console.log('받아온 찜 목록:', wishItems);
        console.log('현재 상품 ID:', product.id);

        const isProductInWishlist = wishItems.some(item => {
          const itemId = String(item.productId);
          const productId = String(product.id);
          console.log(`비교: 찜 아이템 ID(${itemId}) vs 현재 상품 ID(${productId}), 일치: ${itemId === productId}`);
          return itemId === productId;
        });

        setIsWishlist(isProductInWishlist);
        console.log(`상품 ID(${product.id})는 찜 목록에 ${isProductInWishlist ? '있습니다' : '없습니다'}`);
      } catch (error) {
        console.error('찜 목록 확인 중 오류 발생:', error);
      } finally {
        setWishLoading(false);
      }
    };

    checkWishStatus();
  }, [product]);

  // 탭 변경 함수
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 찜하기 토글 함수
  const toggleWishlist = async () => {
    if (!product) return;

    try {
      setWishLoading(true);
      console.log(`찜하기 토글 시작: isWishlist = ${isWishlist}, 상품 ID = ${product.id}`);

      if (isWishlist) {
        // 찜 목록에서 제거
        console.log(`상품 ID(${product.id})를 찜 목록에서 제거 중...`);
        const success = await removeWishItem(Number(product.id));
        if (success) {
          setIsWishlist(false);
          console.log(`상품 ID(${product.id})를 찜 목록에서 제거 완료`);
        } else {
          console.error('찜 목록에서 제거 실패');
        }
      } else {
        // 찜 목록에 추가
        console.log(`상품 ID(${product.id})를 찜 목록에 추가 중...`);
        const success = await addWishItem(Number(product.id));
        if (success) {
          setIsWishlist(true);
          console.log(`상품 ID(${product.id})를 찜 목록에 추가 완료`);
        } else {
          console.error('찜 목록에 추가 실패');
        }
      }

      // 상태 갱신을 위해 찜 목록 다시 조회
      const updatedWishItems = await getWishItems();
      console.log('업데이트된 찜 목록:', updatedWishItems);
    } catch (error) {
      console.error('찜하기 작업 중 오류 발생:', error);
    } finally {
      setWishLoading(false);
    }
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

  return (
    <S.DetailPageWrapper>
      <S.DetailContainer>
        <S.ProductImage src={product.imageUrl} alt={product.title} />
        <S.ProductDetails>
          <S.ProductInfoSection>
            <S.BookTypeTag>소득공제</S.BookTypeTag>
            <S.ProductTitle>{product.title}</S.ProductTitle>
            <S.ProductAuthor>
              {product.author}
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

          <S.ButtonsSection>
            <S.WishlistButton
              onClick={toggleWishlist}
              disabled={wishLoading}
              style={{ opacity: wishLoading ? 0.5 : 1 }}
            >
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
            <S.CartButton
              onClick={toggleCart}
              disabled={cartLoading}
              style={{
                backgroundColor: isInCart ? '#f0f0f0' : '#e078ca',
                color: isInCart ? '#333' : '#fff'
              }}
            >
              {cartLoading ? '처리 중...' : (isInCart ? '장바구니 빼기' : '장바구니 담기')}
            </S.CartButton>
            <S.PurchaseButton onClick={handlePurchase}>바로구매</S.PurchaseButton>
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
    </S.DetailPageWrapper>
  );
};

export default DetailPage;
