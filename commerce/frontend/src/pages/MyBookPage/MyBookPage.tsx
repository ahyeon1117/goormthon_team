import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

// Mock 데이터
const mockBooks = [
  {
    id: 1,
    title: "챗GPT 시대 살아남기",
    author: "박종천",
    coverImage: "https://via.placeholder.com/150x200",
    purchaseDate: "2023-10-15",
    category: "IT/컴퓨터"
  },
  {
    id: 2,
    title: "개짜판 : 스프링 프레임워크 첫걸음",
    author: "커뮤니티 마이삭개 팀원 스파이크",
    coverImage: "https://via.placeholder.com/150x200",
    purchaseDate: "2023-11-20",
    category: "IT/컴퓨터"
  },
  {
    id: 3,
    title: "인공지능과 함께하는 코딩",
    author: "이진영",
    coverImage: "https://via.placeholder.com/150x200",
    purchaseDate: "2024-01-05",
    category: "IT/컴퓨터"
  },
  {
    id: 4,
    title: "나는 일고 쓰고 번역한다",
    author: "손용석",
    coverImage: "https://via.placeholder.com/150x200",
    purchaseDate: "2024-02-10",
    category: "인문/에세이"
  },
  {
    id: 5,
    title: "사랑을 안다는 것",
    author: "데이비드 브룩스, 이정서",
    coverImage: "https://via.placeholder.com/150x200",
    purchaseDate: "2024-03-01",
    category: "인문/에세이"
  }
];

// 카테고리 목록
const categories = ["전체", "IT/컴퓨터", "인문/에세이", "소설", "경제/경영"];

const MyBookPage: React.FC = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [sortOption, setSortOption] = useState<string>("최근 구매순");

  // 다른 페이지 -> 마이북 페이지로 이동 시 스크롤 처리
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 카테고리별 필터링
  const filteredBooks = selectedCategory === "전체"
    ? mockBooks
    : mockBooks.filter(book => book.category === selectedCategory);

  // 정렬 함수
  const sortBooks = (books: typeof mockBooks) => {
    if (sortOption === "최근 구매순") {
      return [...books].sort((a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      );
    } else if (sortOption === "제목순") {
      return [...books].sort((a, b) => a.title.localeCompare(b.title));
    }
    return books;
  };

  const sortedBooks = sortBooks(filteredBooks);

  return (
    <MyBookContainer>
      <PageHeader>
        <PageTitle>내 서재</PageTitle>
        <BookCount>총 {filteredBooks.length}권의 책</BookCount>
      </PageHeader>

      <FilterContainer>
        <CategoryButtons>
          {categories.map(category => (
            <CategoryButton
              key={category}
              isSelected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryButtons>

        <SortSelect
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="최근 구매순">최근 구매순</option>
          <option value="제목순">제목순</option>
        </SortSelect>
      </FilterContainer>

      {sortedBooks.length > 0 ? (
        <BookList>
          {sortedBooks.map((book) => (
            <BookItem key={book.id}>
              <BookCover src={book.coverImage} alt={book.title} />
              <BookInfo>
                <CategoryTag>{book.category}</CategoryTag>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor>{book.author}</BookAuthor>
                <PurchaseDate>구매일: {book.purchaseDate}</PurchaseDate>
                <ReadButton>읽기</ReadButton>
              </BookInfo>
            </BookItem>
          ))}
        </BookList>
      ) : (
        <EmptyState>
          선택한 카테고리에 책이 없습니다.
        </EmptyState>
      )}
    </MyBookContainer>
  );
};

// 스타일 컴포넌트
const MyBookContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const BookCount = styled.p`
  font-size: 16px;
  color: #666;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CategoryButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const CategoryButton = styled.button<{ isSelected: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${props => props.isSelected ? '#4a90e2' : '#ddd'};
  background-color: ${props => props.isSelected ? '#4a90e2' : 'white'};
  color: ${props => props.isSelected ? 'white' : '#333'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isSelected ? '#4a90e2' : '#f5f5f5'};
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
  cursor: pointer;
`;

const BookList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  list-style: none;
  padding: 0;
`;

const BookItem = styled.li`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const BookInfo = styled.div`
  padding: 15px;
  position: relative;
`;

const CategoryTag = styled.span`
  position: absolute;
  top: -12px;
  left: 15px;
  background-color: #f8f8f8;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 3px 10px;
  font-size: 12px;
  color: #666;
`;

const BookTitle = styled.h3`
  font-size: 16px;
  margin: 10px 0 8px 0;
  font-weight: bold;
`;

const BookAuthor = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
`;

const PurchaseDate = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0 0 15px 0;
`;

const ReadButton = styled.button`
  width: 100%;
  padding: 8px 0;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3a80d2;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 16px;
`;

export default MyBookPage;
