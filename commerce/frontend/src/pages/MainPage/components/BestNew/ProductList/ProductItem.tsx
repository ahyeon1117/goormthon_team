import * as S from "./ProductList.styled";
import { BestNewBook } from "../../../../../types";
import { Link } from "react-router-dom";

interface ProductItemProps {
  book: BestNewBook;
  type: "best" | "new";
}

const ProductItem: React.FC<ProductItemProps> = ({ book, type }) => {
  return (
    <S.ProductItem key={book.id}>
      {type === "best" && <S.Rank $rank={book.rank}>{book.rank}</S.Rank>}

      {/* 도서 이미지 박스 */}
      <S.ProductImageBox>
        <Link to={`/detail/${book.id}`}>
          <S.ProductImage src={book.imageUrl} alt={book.title} />
        </Link>
      </S.ProductImageBox>

      {/* 도서 정보 */}
      <S.ProductInfo>
        <Link to={`/detail/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <S.ProductTitle>{book.title}</S.ProductTitle>
        </Link>
        <S.AuthorPublisherWrapper>
          <S.ProductAuthor>{book.author}</S.ProductAuthor>
          <S.Divider>|</S.Divider>
          <S.ProductPublisher>{book.publisher}</S.ProductPublisher>
        </S.AuthorPublisherWrapper>
      </S.ProductInfo>
    </S.ProductItem>
  )
}

export default ProductItem;
