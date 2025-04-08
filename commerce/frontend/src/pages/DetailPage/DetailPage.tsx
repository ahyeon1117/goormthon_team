import { useState, useEffect, ChangeEvent} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from "./DetailPage.styled";
import { getProductById } from "../../api/productApi";
import { BookItem } from "../../types";
import { useCart } from "../../hooks";
import { addWishItem, getWishItems, removeWishItem } from "../../api/wishApi";
import { getCurrentUserOrderItems } from "../../api/orderApi"; // 주문 API import 추가
//리뷰
import { useReviewStore } from "../../store/reviewStore";
import { ReviewRequestDto, ReviewResponseDto } from '../../types/apiTypes.ts'; // 타입 import
import { getCurrentUserInfo, UserInfoResponse} from '../../api/userApi'; // 필요한 API import

// 상품 상세 페이지 컴포넌트
const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  console.log('현재 페이지의 productId:', id);
  const navigate = useNavigate();
  const [product, setProduct] = useState<BookItem | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewTitle, setReviewTitle] = useState(''); //리뷰
  const [reviewText, setReviewText] = useState(''); //리뷰
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null); // 유저 정보 상태 추가
  const [isPurchased, setIsPurchased] = useState(false); // 상품 구매 여부 상태 추가
  // Zustand에서 상태와 함수 가져오기
  const { reviews, createReview, fetchReviewsByProduct } = useReviewStore();

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
      setError(null);
      console.log(`상세 페이지 - 상품 ID(${id}) 도서 정보 요청 중...`);

      try {
        if (id) {
          const bookItem = await getProductById(id);

          if (bookItem) {
            console.log("도서 데이터 불러오기 성공:", bookItem.title);
            setProduct(bookItem);
          } else {
            console.error("도서 데이터를 찾을 수 없습니다.");
            setError("도서 데이터를 찾을 수 없습니다.");
            setProduct(null);
          }
        } else {
          console.error("도서 ID가 제공되지 않았습니다.");
          setError("도서 ID가 제공되지 않았습니다.");
          setProduct(null);
        }
      } catch (error) {
        console.error("도서 데이터 로딩 중 오류:", error);
        setError("도서 데이터를 불러오는 중 오류가 발생했습니다.");
        setProduct(null);
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

  // 이미 구매한 상품인지 확인
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!product) return;

      try {
        console.log('구매 상태 확인 중...');
        const orderItems = await getCurrentUserOrderItems();
        console.log('사용자 주문 상품 목록:', orderItems);

        // 현재 상품이 주문 목록에 있는지 확인
        const purchased = orderItems.some(item => {
          const itemId = String(item.id);
          const productId = String(product.id);
          console.log(`비교: 주문 상품 ID(${itemId}) vs 현재 상품 ID(${productId}), 일치: ${itemId === productId}`);
          return itemId === productId;
        });

        console.log(`상품 ID(${product.id})는 ${purchased ? '이미 구매한 상품입니다' : '아직 구매하지 않은 상품입니다'}`);
        setIsPurchased(purchased);
      } catch (error) {
        console.error('구매 상태 확인 중 오류 발생:', error);
      }
    };

    checkPurchaseStatus();
  }, [product]);

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

    console.log(`상품 ID(${product.id}) 바로구매 시작`);

    navigate('/order', {
      state: {
        items: [{
          productId: Number(product.id),
          title: product.title,
          discount: product.price,
          image: product.imageUrl,
          author: product.author,
          publisher: product.publisher
        }],
        isDirectPurchase: true,
        totalPrice: product.price
      }
    });
  };

  // 내 서재로 이동 함수
  const goToMyLibrary = () => {
    console.log('내 서재로 이동');
    navigate('/mybook');
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
//=============================리뷰============================================================
  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      const data = await getCurrentUserInfo();  // 사용자 정보 가져오는 API 호출
      setUserInfo(data);  // 사용자 정보를 상태에 저장
    };

    fetchUserInfo();
  }, []);

  // 제품의 리뷰를 API에서 가져오기
  useEffect(() => {
    if (id) {
      fetchReviewsByProduct(Number(id)); // ✅ useReviewStore의 상태 관리 함수 사용
    }
  }, [fetchReviewsByProduct, id]);

  const handleAddReview = async () => {
    if (!reviewTitle || !reviewText) {
      alert('제목과 내용을 모두 작성해주세요.');
      return;
    }

    if (!userInfo) {
      alert('로그인이 필요합니다.');
      return;
    }

    const newReview: ReviewRequestDto = {
      userId: userInfo.userId,  // 로그인한 사용자 ID
      productId: Number(id), // NaN 방지
      title: reviewTitle,
      message: reviewText,
    };

    try {
      await createReview(newReview);  // 리뷰 생성 요청
      alert('리뷰가 성공적으로 등록되었습니다.');
      setReviewTitle('');
      setReviewText('');

      // 🎯 리뷰 작성 후 리스트 최신화
      fetchReviewsByProduct(Number(id));
    } catch (error) {
      console.error('리뷰 추가 실패:', error);
    }
  };


  // 로딩 중일 때 표시
  if (loading) {
    return <S.DetailPageWrapper>로딩 중...</S.DetailPageWrapper>;
  }

  // 오류가 발생했을 때 표시
  if (error) {
    return <S.DetailPageWrapper>{error}</S.DetailPageWrapper>;
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
            {isPurchased ? (
              <S.PurchaseButton onClick={goToMyLibrary}>
                내 서재
              </S.PurchaseButton>
            ) : (
              <S.PurchaseButton onClick={handlePurchase}>바로구매</S.PurchaseButton>
            )}
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
          리뷰
          {/*({product.reviewCount})*/}
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
            <S.ReviewTitleA>리뷰 작성</S.ReviewTitleA>

            {userInfo && (
              <S.ReviewAuthor>{userInfo.userId}</S.ReviewAuthor>)}

            {/* 제목 입력란 */}
            <S.ReviewInput
              type="text"
              value={reviewTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setReviewTitle(e.target.value)
              }
              placeholder="리뷰 제목을 입력하세요."
            />

            {/* 내용 입력란 */}
            <S.ReviewInput
              as="textarea"
              value={reviewText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setReviewText(e.target.value)
              }
              placeholder="리뷰를 작성해주세요."
            />

            <S.ReviewButton onClick={handleAddReview}>리뷰 추가</S.ReviewButton>
          </S.ReviewForm>

          {/* 리뷰 목록 */}
          <S.ReviewList>
            {reviews.length > 0 ? (
              reviews.map((review: ReviewResponseDto, index: number) => (
                <S.ReviewItem key={index}>
                  <S.ReviewAuthor>{review.userId}</S.ReviewAuthor>
                  <S.ReviewTitleB>{review.title}</S.ReviewTitleB>
                  <S.ReviewText>{review.message}</S.ReviewText>
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
