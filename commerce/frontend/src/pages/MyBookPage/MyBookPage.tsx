import { useEffect, useState, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { formatAuthor, ProductResponse, MyBook } from "../../types/apiTypes";
import { getCurrentUserOrderItems } from "../../api/orderApi";
import Pagination from "./components/Pagination/Pagination";
import SortingBar from "./components/SortingBar/SortingBar";
import {
  MyBookContainer,
  PageHeader,
  PageTitle,
  BookCount,
  FilterContainer,
  SearchBox,
  BookList,
  BookItem,
  BookCoverWrapper,
  BookCover,
  BookInfo,
  BookTitle,
  BookAuthor,
  PurchaseDate,
  EmptyState,
  PaginationContainer
} from "./MyBookPage.styled";

const MyBookPage: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 초기값 가져오기
  const initialKeyword = searchParams.get("keyword") || "";
  const initialSort = searchParams.get("sort") || "최근 구매순";
  const initialItemsPerPage = Number(searchParams.get("perPage") || "10");
  const initialPage = Number(searchParams.get("page") || "1");

  const [sortOption, setSortOption] = useState<string>(initialSort);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialKeyword);
  const [books, setBooks] = useState<MyBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<MyBook[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 정렬 옵션 정의
  const sortOptions = [
    { value: "최근 구매순", label: "최근 구매순" },
    { value: "제목 가나다순", label: "제목 가나다순" },
    { value: "저자 가나다순", label: "저자 가나다순" },
  ];

  // 페이지당 아이템 수 옵션 정의
  const itemsPerPageOptions = [
    { value: 10, label: "10개씩 보기" },
    { value: 20, label: "20개씩 보기" },
    { value: 40, label: "40개씩 보기" },
  ];

  // 검색어로 책 필터링
  const filterBooksByKeyword = useCallback((keyword: string) => {
    if (!keyword.trim()) {
      return books;
    }

    const lowercasedKeyword = keyword.toLowerCase();
    return books.filter(book =>
      book.title.toLowerCase().includes(lowercasedKeyword) ||
      book.author.toLowerCase().includes(lowercasedKeyword) ||
      book.publisher.toLowerCase().includes(lowercasedKeyword)
    );
  }, [books]);

  // API에서 구매한 책 데이터 가져오기
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const orderItems = await getCurrentUserOrderItems();

        // ProductResponse를 MyBook 형식으로 변환
        const myBooks: MyBook[] = orderItems.map((item: ProductResponse) => ({
          id: item.id,
          title: item.title,
          author: formatAuthor(item.author),
          imageUrl: item.image,
          publisher: item.publisher,
          purchaseDate: item.pubdate // 출판일을 구매일로 임시 사용 (실제로는 주문 날짜가 필요)
        }));

        setBooks(myBooks);
        setIsLoading(false);
      } catch (err) {
        console.error("책 데이터를 불러오는 중 오류 발생:", err);
        setError("책 데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // 다른 페이지 -> 마이북 페이지로 이동 시 스크롤 처리
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // URL 검색 파라미터가 변경되면 검색 및 정렬 적용
  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    const sort = searchParams.get("sort") || "최근 구매순";
    const perPage = Number(searchParams.get("perPage") || "10");
    const page = Number(searchParams.get("page") || "1");

    setSearchKeyword(keyword);
    setSortOption(sort);
    setItemsPerPage(perPage);
    setCurrentPage(page);

    const filtered = filterBooksByKeyword(keyword);
    setFilteredBooks(filtered);
  }, [searchParams, filterBooksByKeyword]);

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // URL 파라미터 업데이트
    const newParams = new URLSearchParams(searchParams);
    if (searchKeyword) {
      newParams.set("keyword", searchKeyword);
    } else {
      newParams.delete("keyword");
    }
    newParams.set("page", "1"); // 검색 시 첫 페이지로 이동

    setSearchParams(newParams);
  };

  // 정렬 변경 처리
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    // URL 파라미터 업데이트
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSortOption);
    setSearchParams(newParams);
  };

  // 페이지당 아이템 수 변경 처리
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);

    // URL 파라미터 업데이트
    const newParams = new URLSearchParams(searchParams);
    newParams.set("perPage", newItemsPerPage.toString());
    newParams.set("page", "1"); // 페이지당 아이템 수 변경 시 첫 페이지로 이동
    setSearchParams(newParams);
  };

  // 페이지 변경 처리
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    // URL 파라미터 업데이트
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber.toString());
    setSearchParams(newParams);

    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  };

  // 정렬 함수
  const sortBooks = (books: MyBook[]) => {
    if (sortOption === "최근 구매순") {
      return [...books].sort((a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      );
    } else if (sortOption === "제목 가나다순") {
      return [...books].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "저자 가나다순") {
      return [...books].sort((a, b) => a.author.localeCompare(b.author));
    }
    return books;
  };

  // 책 읽기 핸들러
  const handleReadBook = (bookId: string) => {
    // 여기에 책 읽기 로직 구현 (나중에 라우팅 또는 API 호출 등으로 대체)
    console.log(`책 읽기: ${bookId}`);
  };

  // 페이지네이션 계산
  const sortedBooks = sortBooks(filteredBooks);
  const totalItems = sortedBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 페이지에 표시할 책 목록
  const currentBooks = sortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <MyBookContainer>
      <PageHeader>
        <PageTitle>내 서재</PageTitle>
        <BookCount>총 {filteredBooks.length}권의 책</BookCount>

        <FilterContainer>
          <SearchBox onSubmit={handleSearch}>
            <input
              type="text"
              className="search-keyword-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="내 서재 검색"
            />
            <button type="submit" className="search-submit-button">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="#555"
                  stroke="#555"
                  strokeWidth="0.5"
                />
              </svg>
            </button>
          </SearchBox>
          <SortingBar
            sortOptions={sortOptions}
            selectedSort={sortOption}
            onSortChange={handleSortChange}
            itemsPerPageOptions={itemsPerPageOptions}
            selectedItemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </FilterContainer>
      </PageHeader>

      {isLoading ? (
        <EmptyState>데이터를 불러오는 중입니다...</EmptyState>
      ) : error ? (
        <EmptyState>{error}</EmptyState>
      ) : currentBooks.length > 0 ? (
        <>
          <BookList>
            {currentBooks.map((book) => (
              <BookItem key={book.id}>
                <BookCoverWrapper
                  onClick={() => handleReadBook(book.id)}
                >
                  <BookCover src={book.imageUrl} alt={book.title} />
                </BookCoverWrapper>
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.author}</BookAuthor>
                  <PurchaseDate>구매일: {book.purchaseDate}</PurchaseDate>
                </BookInfo>
              </BookItem>
            ))}
          </BookList>

          {totalPages >= 1 && (
            <PaginationContainer>
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </PaginationContainer>
          )}
        </>
      ) : (
        <EmptyState>
          책이 없습니다.
        </EmptyState>
      )}
    </MyBookContainer>
  );
};

export default MyBookPage;
