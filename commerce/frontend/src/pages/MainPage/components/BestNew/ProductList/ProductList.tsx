import ProductItem from "./ProductItem";
import { BestNewBook } from "../../../../../types";
import * as S from "./ProductList.styled";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomArrowProps } from "react-slick";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

interface ProductListProps {
  type: "best" | "new";
  books: BestNewBook[];
}

// 슬라이드 이전 화살표 컴포넌트
const PrevArrow = (props: CustomArrowProps) => (
  <div {...props}>
    <S.StyledPrevArrow>
      <SlArrowLeft size={20} color="#A9ABB8" />
    </S.StyledPrevArrow>
  </div>
);

// 슬라이드 다음 화살표 컴포넌트
const NextArrow = (props: CustomArrowProps) => (
  <div {...props}>
    <S.StyledNextArrow>
      <SlArrowRight size={20} color="#A9ABB8" />
    </S.StyledNextArrow>
  </div>
);

const ProductList: React.FC<ProductListProps> = ({ type, books }) => {
  // react-slick 설정
  const settings = {
    infinite: true, // 무한 슬라이딩
    speed: 1000, // 슬라이딩 속도
    slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 5, // 한 번에 슬라이딩할 슬라이드 개수
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: type === "new", // 신상품 섹션만 하단 점 표시
    responsive: [
      {
        breakpoint: 1200, // 화면 크기 1200px 이하일 때
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 900, // 화면 크기 900px 이하일 때
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 700, // 화면 크기 700px 이하일 때
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <S.ProductSection>
      <S.ProductSectionTitle>{type === "best" ? "베스트셀러" : "신상품"}</S.ProductSectionTitle>
      <S.StyledSlider className="product-list" {...settings}>
        {books.map((book) => (
          <ProductItem key={book.id} book={book} type={type} />
        ))}
      </S.StyledSlider>
    </S.ProductSection>
  )
}

export default ProductList;