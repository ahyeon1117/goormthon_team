import { useState, ChangeEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  DetailPageWrapper,
  DetailContainer,
  ProductImage,
  ProductDetails,
  ProductTitle,
  ProductAuthor,
  ProductPublisher,
  ProductRating,
  PriceSection,
  Price,
  QuantityControl,
  QuantityButton,
  QuantityInput,
  ButtonsSection,
  CartButton,
  PurchaseButton,
  TabsSection,
  TabButton,
  TotalPriceSection,
  TotalPriceLabel,
  TotalPriceValue,
  BookTypeTag,
  WishlistButton,
  QuantityAndPriceContainer,
  SectionTitle,
  ShippingInfoSection,
  ShippingInfoRow,
  ProductInfoSection,
  FavoredHeartIcon,
  UnfavoredHeartIcon,
} from "./DetailPage.styled";
import { getProductById } from "../../api/productApi";
import { BookItem } from "../../types";

// 상품 정보 인터페이스
interface Product {
  id: string; // ISBN 값이 저장됨
  title: string;
  author: string;
  translator?: string;
  publisher: string;
  publishDate: string;
  rating: number;
  reviewCount: number;
  price: number;
  imageUrl: string;
}

// BookItem을 Product로 변환하는 함수
const mapBookItemToProduct = (bookItem: BookItem): Product => {
  return {
    id: bookItem.id, // ISBN 값
    title: bookItem.title,
    author: bookItem.author,
    publisher: bookItem.publisher,
    publishDate: bookItem.publishDate,
    rating: bookItem.rating,
    reviewCount: bookItem.reviewCount,
    price: bookItem.price,
    imageUrl: bookItem.imageUrl,
  };
};

// 임시 상품 데이터
const mockProduct: Product = {
  id: "1", // 실제로는 ISBN 값이 들어갈 위치
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
};

// 상품 상세 페이지 컴포넌트
const DetailPage = () => {
  // URL 파라미터에서 ISBN 값을 가져옴
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      console.log(`상세 페이지 - ISBN(${id}) 도서 정보 요청 중...`);

      try {
        if (id) {
          // API에서 상품 정보 가져오기 시도 (ISBN으로 조회)
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
          console.error("도서 ISBN이 제공되지 않았습니다.");
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

  // 로딩 중일 때 표시
  if (loading) {
    return <DetailPageWrapper>로딩 중...</DetailPageWrapper>;
  }

  // 상품이 없을 때 표시
  if (!product) {
    return <DetailPageWrapper>상품을 찾을 수 없습니다.</DetailPageWrapper>;
  }

  // 총 가격 계산
  const totalPrice = product.price * quantity;

  return (
    <DetailPageWrapper>
      <DetailContainer>
        <ProductImage src={product.imageUrl} alt={product.title} />
        <ProductDetails>
          <ProductInfoSection>
            <BookTypeTag>소득공제</BookTypeTag>
            <ProductTitle>{product.title}</ProductTitle>
            <ProductAuthor>
              {product.author} <span style={{ color: "#666" }}>저자</span>{" "}
              {product.translator && `| ${product.translator} `}
              <span style={{ color: "#666" }}>
                {product.translator && "역자"}
              </span>
            </ProductAuthor>
            <ProductPublisher>
              {product.publisher} | {product.publishDate}
            </ProductPublisher>
            <ProductRating>
              <span className="stars">★</span>
              <span className="rating">{product.rating.toFixed(2)}</span>
              <span className="review-count">({product.reviewCount})</span>
            </ProductRating>
          </ProductInfoSection>

          <PriceSection>
            <Price>{product.price.toLocaleString()}원</Price>
          </PriceSection>

          <ShippingInfoSection>
            <SectionTitle>배송정보</SectionTitle>
            <ShippingInfoRow>
              <span>배송비</span>
              <span>무료</span>
            </ShippingInfoRow>
            <ShippingInfoRow>
              <span>배송지</span>
              <span>
                서울특별시 종로구 이화동 123{" "}
                <span
                  style={{
                    color: "#e078ca",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  지역변경 ▾
                </span>
              </span>
            </ShippingInfoRow>
          </ShippingInfoSection>

          <QuantityAndPriceContainer>
            <QuantityControl>
              <div>
                <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
                <QuantityInput
                  type="number"
                  value={quantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setQuantity(parseInt(e.target.value) || 1)
                  }
                  min="1"
                />
                <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
              </div>
            </QuantityControl>

            <TotalPriceSection>
              <TotalPriceLabel>총 상품 금액</TotalPriceLabel>
              <TotalPriceValue>{totalPrice.toLocaleString()}원</TotalPriceValue>
            </TotalPriceSection>
          </QuantityAndPriceContainer>

          <ButtonsSection>
            <WishlistButton onClick={toggleWishlist}>
              {isWishlist ? (
                <FavoredHeartIcon>
                  <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
                </FavoredHeartIcon>
              ) : (
                <UnfavoredHeartIcon>
                  <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
                </UnfavoredHeartIcon>
              )}
            </WishlistButton>
            <CartButton>장바구니</CartButton>
            <PurchaseButton>바로구매</PurchaseButton>
          </ButtonsSection>
        </ProductDetails>
      </DetailContainer>

      <TabsSection>
        <TabButton
          $active={activeTab === "info"}
          onClick={() => handleTabChange("info")}
        >
          도서정보
        </TabButton>
        <TabButton
          $active={activeTab === "review"}
          onClick={() => handleTabChange("review")}
        >
          리뷰 ({product.reviewCount})
        </TabButton>
        <TabButton
          $active={activeTab === "shipping"}
          onClick={() => handleTabChange("shipping")}
        >
          배송/반품
        </TabButton>
      </TabsSection>

      {/* 탭 내용 */}
      {activeTab === "info" && (
        <div>
          <h3>책 읽으세요 왜냐면...</h3>
          <p>독서는 인체에 매우 유익합니다.</p>
        </div>
      )}

      {activeTab === "review" && (
        <div>
          <h3>사용자 리뷰 ({product.reviewCount})</h3>
          <p>아직 등록된 리뷰가 없습니다.</p>
        </div>
      )}

      {activeTab === "shipping" && (
        <div>
          <h3>배송 및 반품 정보</h3>
          <p>배송비: 무료</p>
          <p>배송방법: 택배</p>
          <p>반품/교환 안내: 상품 수령 후 7일 이내 가능</p>
        </div>
      )}
    </DetailPageWrapper>
  );
};

export default DetailPage;
