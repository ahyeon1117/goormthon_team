import styled from "styled-components";
import Slider from "react-slick";

export const ProductSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    min-height:700px;
    margin: 0 auto;
    box-sizing: border-box;
`;

export const ProductSectionTitle = styled.div`
    font-size: 30px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 25px;
    padding-left: 20px;
`;

// react-slick 슬라이더 스타일 적용
export const StyledSlider = styled(Slider)`
  .slick-slide {
    display: flex;
    justify-content: center;
  }
    
  // 슬라이더 화살표
  .slick-prev, .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
    
    &:before {
      content: '';
    }
  }
  .slick-prev {
    left: -45px;
  }

  .slick-next {
    right: -50px;
  }

  // 슬라이더 하단 점
  .slick-dots {
    bottom: -50px;
  }

  .slick-dots li {
    margin: 0 8px; /* 점 간격 조정 */
    width: 10px;
    height: 10px;
  }

  .slick-dots li button:before {
    content: ''; // 기본 점 스타일 제거
    width: 8px;
    height: 8px;
    background-color: #707070;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); // 중앙 정렬
  }

  .slick-dots li.slick-active button:before {
    width: 10px;
    height: 10px;
    background-color: #707070;
  }
`;

// 슬라이더 커스텀 화살표
const ArrowButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;

  &:focus {
    outline: none;
  }
`;

export const StyledPrevArrow = styled(ArrowButton)``;
export const StyledNextArrow = styled(ArrowButton)``;

export const ProductItem = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

export const Rank = styled.div<{ $rank: number }>`
    width: 35px;
    height: 35px;
    background-color: ${({ $rank }) => $rank === 1 ? "#E896FF" : "#C0C0C0"};
    color: white;
    text-align: center;
    line-height: 35px;
    border-radius: 14px 0;
    margin-bottom: 15px;
    font-weight: 700;
`;

export const ProductImageBox = styled.div`
    width: 200px;
    height: 300px;
    box-shadow: 10px 10px 4px rgba(232, 150, 255, 0.43);
    margin-bottom: 30px;
    border: 1px solid #D9D9D9;

    &:hover {
      cursor: pointer;
    }
`;

export const ProductImage = styled.img`
    width: 100%;
    height: 100%;
`;

// 스타일은 없지만 일관성을 위해 styled-components로 정의
export const ProductInfo = styled.div``;

export const ProductTitle = styled.a`
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 3px;

    &:hover {
      cursor: pointer;
      color: #000000;
    }
`;

export const AuthorPublisherWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
`;

export const ProductAuthor = styled.span`
    color: #707070;
`;

export const Divider = styled.span`
    color: #D9D9D9;
`;

export const ProductPublisher = styled.span`
    color: #707070;
`;