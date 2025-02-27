import bestBannerImage from "../../assets/images/best-banner.png";
import newBannerImage from "../../assets/images/new-banner.png";
import { Container,
  ProductSection,
  ProductSectionTitle,
  ProductList,
  ProductItem,
  Rank,
  ProductImageBox,
  ProductImage,
  ProductInfo,
  ProductTitle,
  ProductAuthor,
  Divider,
  ProductPublisher,
  BannerSection,
  BannerLink,
  BannerText,
  BannerImage } from "../../styles/MainPageStyles/BestNew.styled";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  imageUrl: string;
  rank: number;
}

interface BestNewProps {
  sectionType: "best" | "new";
  bookData: Book[];
}

function BestNew({ sectionType, bookData }: BestNewProps) {
  // 상품 섹션의 제목
  const sectionTitle = sectionType === "best" ? "베스트" : "신상품";
  // 배너 텍스트
  const bannerText = sectionType === "best" ? "로켓문고에선 3000원 할인!" : "로켓문고 리뷰왕을 찾아라!";

  return (
    <Container>
      {/* 상품 섹션 (베스트/신상품) */}
      <ProductSection>
        <ProductSectionTitle>{sectionTitle}</ProductSectionTitle>
        <ProductList>
          {bookData.map((book) => (
            <ProductItem key={book.id}>
              {sectionType === "best" && <Rank>{book.rank}</Rank>}
              {/* 도서 이미지 박스 */}
              <ProductImageBox>
                <a><ProductImage src={book.imageUrl} alt="도서 이미지" /></a>
              </ProductImageBox>
              {/* 도서 정보 */}
              <ProductInfo>
                <ProductTitle>{book.title}</ProductTitle>
                <ProductAuthor>{book.author}</ProductAuthor>
                <Divider>|</Divider>
                <ProductPublisher>{book.publisher}</ProductPublisher>
              </ProductInfo>
            </ProductItem>
          ))}
        </ProductList>
      </ProductSection>

      {/* 배너 섹션 */}
      <BannerSection sectionType={sectionType}>
        <BannerLink>
          <BannerText>{bannerText}</BannerText>
          <BannerImage src={sectionType === "best" ? bestBannerImage : newBannerImage} />
        </BannerLink>
      </BannerSection>
    </Container>
  )
}

export default BestNew;