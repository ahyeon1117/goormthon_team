import { useState, ChangeEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  DetailPageWrapper,
  ProductInfoSection,
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
  TabButton
} from './DetailPage.styled';
import { getProductById } from '../../api/productApi';
import { BookItem } from '../../types';

// 상품 정보 인터페이스
interface Product {
  id: string;  // ISBN 값이 저장됨
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
    id: bookItem.id,  // ISBN 값
    title: bookItem.title,
    author: bookItem.author,
    publisher: bookItem.publisher,
    publishDate: bookItem.publishDate,
    rating: bookItem.rating,
    reviewCount: bookItem.reviewCount,
    price: bookItem.price,
    imageUrl: bookItem.imageUrl
  };
};

// 임시 상품 데이터
const mockProduct: Product = {
  id: '1',  // 실제로는 ISBN 값이 들어갈 위치
  title: '자바스크립트 디자인 패턴',
  author: '에디 오스마니',
  translator: '윤병식',
  publisher: '한빛미디어',
  publishDate: '2024년 08월 01일',
  rating: 9.06,
  reviewCount: 15,
  price: 25200,
  imageUrl: 'https://shopping-phinf.pstatic.net/main_4036719/40367194618.20240307165423.jpg'
};

// 상품 상세 페이지 컴포넌트
const DetailPage = () => {
  // URL 파라미터에서 ISBN 값을 가져옴
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);

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
            console.log('도서 데이터 불러오기 성공:', productData.title);
            setProduct(productData);
          } else {
            // API 요청 실패 시 임시 데이터 사용 (개발 중에만 사용)
            console.warn('API 요청 실패, 임시 데이터 사용');
            setProduct(mockProduct);
          }
        } else {
          console.error('도서 ISBN이 제공되지 않았습니다.');
          setProduct(null);
        }
      } catch (error) {
        console.error('도서 데이터 로딩 중 오류:', error);
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
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  // 수량 감소 함수
  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // 탭 변경 함수
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 로딩 중일 때 표시
  if (loading) {
    return <DetailPageWrapper>로딩 중...</DetailPageWrapper>;
  }

  // 상품이 없을 때 표시
  if (!product) {
    return <DetailPageWrapper>상품을 찾을 수 없습니다.</DetailPageWrapper>;
  }

  return (
    <DetailPageWrapper>
      <ProductInfoSection>
        <ProductImage src={product.imageUrl} alt={product.title} />
        <ProductDetails>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductAuthor>
            {product.author} 저 {product.translator && `| ${product.translator} 역`}
          </ProductAuthor>
          <ProductPublisher>{product.publisher} | {product.publishDate}</ProductPublisher>
          <ProductRating>⭐ {product.rating.toFixed(2)} ({product.reviewCount})</ProductRating>

          <PriceSection>
            <Price>{product.price.toLocaleString()}원</Price>
          </PriceSection>

          <QuantityControl>
            <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
            <QuantityInput
              type="number"
              value={quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
            />
            <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
          </QuantityControl>

          <ButtonsSection>
            <CartButton>장바구니</CartButton>
            <PurchaseButton>바로구매</PurchaseButton>
          </ButtonsSection>
        </ProductDetails>
      </ProductInfoSection>

      <TabsSection>
        <TabButton
          $active={activeTab === 'info'}
          onClick={() => handleTabChange('info')}
        >
          도서정보
        </TabButton>
        <TabButton
          $active={activeTab === 'review'}
          onClick={() => handleTabChange('review')}
        >
          리뷰 ({product.reviewCount})
        </TabButton>
        <TabButton
          $active={activeTab === 'shipping'}
          onClick={() => handleTabChange('shipping')}
        >
          배송/반품
        </TabButton>
      </TabsSection>

      {/* 탭 내용은 나중에 구현 */}
    </DetailPageWrapper>
  );
};

export default DetailPage;
