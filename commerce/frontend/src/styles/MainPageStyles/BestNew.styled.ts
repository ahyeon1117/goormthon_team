import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

export const ProductSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    min-height: 82vh;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
`;

export const ProductSectionTitle = styled.div`
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 15px;
`;

export const ProductList = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 30px; /* 화면이 작아질 경우 간격 조정 */
`;

export const ProductItem = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

export const Rank = styled.div`
    width: 35px;
    height: 35px;
    background-color: #E896FF;
    color: white;
    text-align: center;
    line-height: 35px;
    border-radius: 14px 0;
    margin-bottom: 15px;
`;

export const ProductImageBox = styled.div`
    width: 210px;
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
    object-fit: cover;
`;

// 스타일은 없지만 일관성을 위해 styled-components로 정의
export const ProductInfo = styled.div``;

export const ProductTitle = styled.a`
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 3px;

    &:hover {
      cursor: pointer;
      color: #000000;
    }
`;

const CommonStyle = styled.span`
    font-size: 15px;
    color: #756E77;
`;

export const ProductAuthor = styled(CommonStyle)``;
export const Divider = styled(CommonStyle)`
    margin: 0 4px;
    font-size: 12px;
`;
export const ProductPublisher = styled(CommonStyle)``;

export const BannerSection = styled.section<{ sectionType: "best" | "new" }>`
    height: 18vh;
    background-color: ${({ sectionType }) => (sectionType === "best" ? "#FBD642" : "#47BF86")};
`;

export const BannerLink = styled.a`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      color: white;
    }
`;

export const BannerText = styled.div`
    font-size: 22px;
    font-weight: 700;
    margin-left: 70px;
    color: white;
`;

export const BannerImage = styled.img`
    height: 100%;
`;