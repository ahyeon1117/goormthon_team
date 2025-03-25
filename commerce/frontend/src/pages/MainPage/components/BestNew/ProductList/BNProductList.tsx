import BNProductItem from "./BNProductItem";
import { BestNewBook } from "../../../../../types";
import * as S from "./BNProductList.styled";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomArrowProps } from "react-slick";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

interface BNProductListProps {
  type: "best" | "new";
  books: BestNewBook[];
}

// 슬라이드 이전 화살표 컴포넌트
const PrevArrow = ({ onClick, className }: CustomArrowProps) => (
  <div className={className} onClick={onClick}>
    <S.StyledPrevArrow>
      <SlArrowLeft size={20} color="#A9ABB8" />
    </S.StyledPrevArrow>
  </div>
);

// 슬라이드 다음 화살표 컴포넌트
const NextArrow = ({ onClick, className }: CustomArrowProps) => (
  <div className={className} onClick={onClick}>
    <S.StyledNextArrow>
      <SlArrowRight size={20} color="#A9ABB8" />
    </S.StyledNextArrow>
  </div>
);

const BNProductList: React.FC<BNProductListProps> = ({ type, books }) => {
  // react-slick 설정
  const settings = {
    infinite: true, // 무한 슬라이딩
    speed: 1000, // 슬라이딩 속도
    slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 5, // 한 번에 슬라이딩할 슬라이드 개수
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: type === "new", // 신상품 섹션만 하단 점 표시
  };

  return (
    <S.ProductSection className="product-section">
      <S.ProductSectionTitle>{type === "best" ? "베스트셀러" : "신상품"}</S.ProductSectionTitle>
      <S.StyledSlider className="product-list" {...settings}>
        {books.map((book) => (
          <BNProductItem key={book.id} book={book} type={type} />
        ))}
      </S.StyledSlider>
    </S.ProductSection>
  )
}

export default BNProductList;