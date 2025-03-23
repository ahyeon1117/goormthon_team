import React, { useState, useEffect, useMemo } from "react";
import FilterSidebar from "./components/FilterSidebar/FilterSidebar.tsx";
import ProductList from "./components/ProductList/ProductList.tsx";
import SortingBar from "./components/SortingBar/SortingBar.tsx";
import Pagination from "./components/Pagination/Pagination.tsx";
import SearchOptions from "./components/SearchOptions/SearchOptions.tsx";
import { PageContainer, ResultHeaderStyled } from "./SearchResultsPage.styled";
import { BookItem, SortOption } from "../../types";
import { getAllProducts, searchProducts } from "../../api/productApi";
import { useLocation } from "react-router-dom";

// 정렬 옵션
const sortOptions: SortOption[] = [
  { id: "popularity", label: "인기순" },
  { id: "recent", label: "최신순" },
  { id: "price-low", label: "가격낮은순" },
  { id: "price-high", label: "가격높은순" },
];

const itemsPerPageOptions = [
  { id: "20", label: "20개씩 보기" },
  { id: "40", label: "40개씩 보기" },
  { id: "60", label: "60개씩 보기" },
];

// 검색 태그 타입 정의
interface SearchTag {
  id: string;
  type: string;
  text: string;
}

const SearchResultsPage: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("popularity");
  const [itemsPerPage, setItemsPerPage] = useState<string>("20");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get("keyword") || "";

  const [totalResults, setTotalResults] = useState<number>(0);
  const [displayedBooks, setDisplayedBooks] = useState<BookItem[]>([]);
  const [withinSearchTerms, setWithinSearchTerms] = useState<string[]>([]);
  const [searchConditions, setSearchConditions] = useState({
    title: false,
    author: false,
    publisher: false,
  });
  const [searchTags, setSearchTags] = useState<SearchTag[]>([
    { id: "1", type: "search", text: "통합검색" },
  ]);

  // 원본 검색 결과 저장 (최초 API 호출 결과)
  const [originalBooks, setOriginalBooks] = useState<BookItem[]>([]);

  // 검색어가 변경되거나 페이지가 로드될 때 API 호출
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // 검색어 변경 시 첫 페이지로 초기화

      // 필터링 상태 초기화
      setWithinSearchTerms([]);
      setSearchConditions({
        title: false,
        author: false,
        publisher: false,
      });

      try {
        let result: BookItem[] = [];

        if (searchKeyword) {
          // 검색어가 있으면 검색 API 호출
          console.log(`API 호출: searchProducts("${searchKeyword}")`);
          result = await searchProducts(searchKeyword);
          console.log("검색 결과:", result);
        } else {
          // 검색어가 없으면 전체 상품 목록 가져오기
          console.log("API 호출: getAllProducts()");
          result = await getAllProducts();
          console.log("전체 상품 목록:", result);
        }

        // 원본 검색 결과 저장
        setOriginalBooks(result);
        setBooks(result);
        setTotalResults(result.length);
        setLoading(false);
      } catch (err) {
        console.error("상품 데이터를 가져오는 중 오류 발생:", err);
        setError("상품 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchKeyword]);

  // URL 쿼리 파라미터에서 필터 상태 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // 결과 내 재검색어 가져오기
    const withinTerms: string[] = [];
    params.getAll("within").forEach((term) => {
      if (term.trim()) withinTerms.push(term.trim());
    });
    setWithinSearchTerms(withinTerms);

    // 검색 조건 가져오기
    const title = params.get("title") === "true";
    const author = params.get("author") === "true";
    const publisher = params.get("publisher") === "true";
    setSearchConditions({ title, author, publisher });

    // 검색 태그 초기화
    const newTags: SearchTag[] = [
      { id: "1", type: "search", text: "통합검색" },
    ];

    // 결과 내 재검색어 태그 추가
    withinTerms.forEach((term) => {
      newTags.push({ id: `${newTags.length + 1}`, type: "within", text: term });
    });

    // 검색 조건 태그 추가
    if (title)
      newTags.push({
        id: `${newTags.length + 1}`,
        type: "title",
        text: "제목",
      });
    if (author)
      newTags.push({
        id: `${newTags.length + 1}`,
        type: "author",
        text: "저자",
      });
    if (publisher)
      newTags.push({
        id: `${newTags.length + 1}`,
        type: "publisher",
        text: "출판사",
      });

    setSearchTags(newTags);
  }, [location.search, searchKeyword]);

  // 필터링된 도서 목록 (useMemo로 최적화)
  const filteredBooks = useMemo(() => {
    if (originalBooks.length === 0) return [];

    // 선택된 검색 조건이 있는지 확인
    const anyConditionSelected =
      searchConditions.title ||
      searchConditions.author ||
      searchConditions.publisher;

    console.log("필터링 실행:", {
      검색어: searchKeyword,
      검색조건: searchConditions,
      결과내재검색: withinSearchTerms,
      검색조건선택여부: anyConditionSelected,
    });

    // 항상 원본 도서 목록(API 결과)에서 시작
    const result = originalBooks.filter((book) => {
      // 검색어 소문자 변환
      const keywordLower = searchKeyword.toLowerCase();

      // 1. 기본 검색 결과 확인 (원래 API 호출이 이미 처리했을 것이지만, 검색 조건이 변경된 경우 재필터링)
      let passesBaseFilter = true;

      if (anyConditionSelected) {
        // 선택된 필드에서만 검색
        const matchesTitle =
          searchConditions.title &&
          book.title.toLowerCase().includes(keywordLower);

        const matchesAuthor =
          searchConditions.author &&
          book.author.toLowerCase().includes(keywordLower);

        const matchesPublisher =
          searchConditions.publisher &&
          book.publisher.toLowerCase().includes(keywordLower);

        // 선택된 필드 중 하나라도 일치하면 통과 (OR 조건)
        passesBaseFilter = matchesTitle || matchesAuthor || matchesPublisher;

        // 디버깅용 로그
        if (book.id === originalBooks[0]?.id) {
          console.log("첫 번째 책 기본 필터 결과:", {
            book: book.title,
            제목일치: matchesTitle,
            저자일치: matchesAuthor,
            출판사일치: matchesPublisher,
            통과여부: passesBaseFilter,
          });
        }
      } else {
        // 아무 조건도 선택되지 않은 경우, 원본 검색 결과 그대로 사용
        passesBaseFilter = true;
      }

      // 2. 결과 내 재검색어 필터링 (AND 조건 - 모든 검색어 포함)
      if (!passesBaseFilter) {
        // 기본 필터를 통과하지 못했으면 재검색 조건도 확인할 필요 없음
        return false;
      }

      // 결과 내 재검색어가 없으면, 기본 필터 결과 사용
      if (withinSearchTerms.length === 0) {
        return passesBaseFilter;
      }

      // 결과 내 재검색어가 있으면 AND 조건으로 모든 검색어 포함해야 함
      const withinFilterResult = withinSearchTerms.every((term) => {
        const termLower = term.toLowerCase();

        // 선택된 검색 조건에 따라 필드 결정
        if (anyConditionSelected) {
          // 선택된 필드에서만 검색
          const matchesTitle =
            searchConditions.title &&
            book.title.toLowerCase().includes(termLower);

          const matchesAuthor =
            searchConditions.author &&
            book.author.toLowerCase().includes(termLower);

          const matchesPublisher =
            searchConditions.publisher &&
            book.publisher.toLowerCase().includes(termLower);

          // 선택된 필드 중 하나라도 일치하면 통과 (OR 조건)
          return matchesTitle || matchesAuthor || matchesPublisher;
        } else {
          // 아무 조건도 선택되지 않은 경우 모든 필드에서 검색
          return (
            book.title.toLowerCase().includes(termLower) ||
            book.author.toLowerCase().includes(termLower) ||
            book.publisher.toLowerCase().includes(termLower)
          );
        }
      });

      // 디버깅용 로그
      if (book.id === originalBooks[0]?.id && withinSearchTerms.length > 0) {
        console.log("첫 번째 책 결과 내 재검색 결과:", {
          book: book.title,
          결과내재검색어: withinSearchTerms,
          통과여부: withinFilterResult,
        });
      }

      return withinFilterResult;
    });

    console.log(
      `필터링 결과: ${result.length}/${originalBooks.length}개 도서 표시`
    );
    return result;
  }, [originalBooks, withinSearchTerms, searchConditions, searchKeyword]);

  // 화면에 표시할 책 목록을 페이지와 아이템 수에 따라 필터링
  useEffect(() => {
    if (filteredBooks.length === 0) return;

    const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
    const endIndex = startIndex + parseInt(itemsPerPage);
    setDisplayedBooks(filteredBooks.slice(startIndex, endIndex));
    setTotalResults(filteredBooks.length);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 초기화

    // 정렬 로직은 필터링된 책이 아닌 원본 책 목록에 적용
    // 정렬된 결과는 filteredBooks에서 자동으로 적용됨
    const sortedBooks = [...originalBooks];

    switch (sortId) {
      case "recent":
        // 최신순 정렬 (출판일 기준)
        sortedBooks.sort((a, b) => {
          if (!a.publishDate || !b.publishDate) return 0;
          return b.publishDate.localeCompare(a.publishDate);
        });
        break;
      case "price-low":
        // 가격 낮은순 정렬
        sortedBooks.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        // 가격 높은순 정렬
        sortedBooks.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
      default:
        // 인기순 정렬 (리뷰 수 기준)
        sortedBooks.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    // 정렬된 책 목록 업데이트
    setOriginalBooks(sortedBooks);
  };

  const handleItemsPerPageChange = (count: string) => {
    setItemsPerPage(count);
    setCurrentPage(1); // 페이지당 아이템 수 변경 시 첫 페이지로 초기화
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 결과 내 재검색 처리 함수
  const handleWithinSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const newWithinTerms = [...withinSearchTerms, searchTerm.trim()];
    setWithinSearchTerms(newWithinTerms);

    // 태그 추가
    const newTagId = `${searchTags.length + 1}`;
    const newTags = [
      ...searchTags,
      {
        id: newTagId,
        type: "within",
        text: searchTerm.trim(),
      },
    ];
    setSearchTags(newTags);

    // URL 업데이트
    updateSearchParams(newWithinTerms, searchConditions);
  };

  // 검색 조건 변경 처리 함수
  const handleSearchConditionChange = (
    conditionId: string,
    checked: boolean
  ) => {
    console.log(`검색 조건 변경: ${conditionId} = ${checked}`);

    const newConditions = {
      ...searchConditions,
      [conditionId]: checked,
    };
    setSearchConditions(newConditions);

    // 검색 태그 업데이트 - 태그 추가 또는 제거
    let newTags = [...searchTags];

    // 태그 ID 생성을 위한 함수
    const getNewTagId = () => `${newTags.length + 1}`;

    if (checked) {
      // 태그 추가
      const tagExists = newTags.some((tag) => tag.type === conditionId);
      if (!tagExists) {
        const tagText =
          conditionId === "title"
            ? "제목"
            : conditionId === "author"
            ? "저자"
            : conditionId === "publisher"
            ? "출판사"
            : conditionId;

        newTags.push({
          id: getNewTagId(),
          type: conditionId,
          text: tagText,
        });
      }
    } else {
      // 태그 제거
      newTags = newTags.filter((tag) => tag.type !== conditionId);
    }

    setSearchTags(newTags);

    // URL 업데이트
    updateSearchParams(withinSearchTerms, newConditions);
  };

  // 검색 태그 제거 처리 함수
  const handleRemoveTag = (tagId: string, tagType: string) => {
    // "통합검색" 태그는 제거할 수 없음
    if (tagId === "1") return;

    // 태그 제거
    console.log(`태그 제거: ${tagId} (${tagType})`);
    const tagToRemove = searchTags.find((tag) => tag.id === tagId);
    if (!tagToRemove) return;

    const newTags = searchTags.filter((tag) => tag.id !== tagId);
    setSearchTags(newTags);

    // 결과 내 재검색어 제거
    if (tagType === "within") {
      const tagText = tagToRemove.text;
      const newWithinTerms = withinSearchTerms.filter(
        (term) => term !== tagText
      );
      setWithinSearchTerms(newWithinTerms);

      // URL 업데이트
      updateSearchParams(newWithinTerms, searchConditions);
      return;
    }

    // 검색 조건 제거
    if (["title", "author", "publisher"].includes(tagType)) {
      const newConditions = {
        ...searchConditions,
        [tagType]: false,
      };
      setSearchConditions(newConditions);

      // URL 업데이트
      updateSearchParams(withinSearchTerms, newConditions);
      return;
    }
  };

  // URL 검색 파라미터 업데이트 함수
  const updateSearchParams = (
    withinTerms: string[],
    conditions: { title: boolean; author: boolean; publisher: boolean }
  ) => {
    const params = new URLSearchParams(location.search);

    // 기존 필터 파라미터 제거
    params.delete("within");
    params.delete("title");
    params.delete("author");
    params.delete("publisher");

    // 검색어 유지
    if (searchKeyword) {
      params.set("keyword", searchKeyword);
    }

    // 결과 내 재검색어 추가
    withinTerms.forEach((term) => {
      params.append("within", term);
    });

    // 검색 조건 추가
    if (conditions.title) params.set("title", "true");
    if (conditions.author) params.set("author", "true");
    if (conditions.publisher) params.set("publisher", "true");

    // URL 변경 (history 추가 없이)
    const newUrl = `${location.pathname}?${params.toString()}`;
    console.log("URL 업데이트:", newUrl);
    window.history.replaceState(null, "", newUrl);
  };

  // --------------------------------------------------------------------

  const handleToggleFavorite = (bookId: string) => {
    setBooks(
      books.map((book) =>
        book.id === bookId ? { ...book, isFavored: !book.isFavored } : book
      )
    );
  };

  const handleToggleCheck = (bookId: string) => {
    setBooks(
      books.map((book) =>
        book.id === bookId ? { ...book, isChecked: !book.isChecked } : book
      )
    );
  };

  // 선택된 책들을 찜하기 목록에 추가하는 함수
  const handleAddSelectedToWishlist = () => {
    const selectedBooks = books.filter((book) => book.isChecked);

    if (selectedBooks.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    console.log("찜하기 목록에 추가할 책들:", selectedBooks);
    // 여기에 찜하기 API 호출 로직 구현
    alert(`${selectedBooks.length}개의 상품을 찜하기 목록에 추가했습니다.`);

    // 선택 상태 초기화
    setBooks(books.map((book) => ({ ...book, isChecked: false })));
  };

  // 선택된 책들을 장바구니에 추가하는 함수
  const handleAddSelectedToCart = () => {
    const selectedBooks = books.filter((book) => book.isChecked);

    if (selectedBooks.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    console.log("장바구니에 추가할 책들:", selectedBooks);
    // 여기에 장바구니 추가 API 호출 로직 구현
    alert(`${selectedBooks.length}개의 상품을 장바구니에 담았습니다.`);

    // 선택 상태 초기화
    setBooks(books.map((book) => ({ ...book, isChecked: false })));
  };

  return (
    <PageContainer>
      <div className="search-content-wrapper" style={{ display: "flex" }}>
        <FilterSidebar
          onWithinSearch={handleWithinSearch}
          searchConditions={searchConditions}
          onSearchConditionChange={handleSearchConditionChange}
        />
        <div className="search-results-main-content">
          <ResultHeaderStyled>
            <div className="result-count">
              {searchKeyword && (
                <strong className="keyword">{searchKeyword}</strong>
              )}
              <strong> 검색 결과 총 {totalResults}건</strong>
            </div>
            <SortingBar
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
              itemsPerPageOptions={itemsPerPageOptions}
              selectedItemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              onAddToWishlist={handleAddSelectedToWishlist}
              onAddToCart={handleAddSelectedToCart}
            />
          </ResultHeaderStyled>

          {/* 결과 내 재검색 및 검색 조건 관련 컴포넌트 */}
          <SearchOptions tags={searchTags} onRemoveTag={handleRemoveTag} />

          {loading ? (
            <div className="loading-indicator">로딩 중...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredBooks.length === 0 ? (
            <div
              className="no-results"
              style={{
                padding: "30px",
                textAlign: "center",
                fontSize: "18px",
                color: "#666",
              }}
            >
              <p>검색 결과가 없습니다.</p>
              {searchKeyword &&
              withinSearchTerms.length === 0 &&
              !searchConditions.title &&
              !searchConditions.author &&
              !searchConditions.publisher ? (
                <p>
                  <strong>"{searchKeyword}"</strong>에 대한 검색 결과가
                  없습니다.
                  <br />
                  다른 검색어로 다시 시도해보세요.
                </p>
              ) : (
                <p>
                  선택하신 조건에 맞는 결과가 없습니다.
                  <br />
                  선택하신 옵션 조건을 변경하거나 다른 검색어로 다시 검색해
                  주세요.
                </p>
              )}
            </div>
          ) : (
            <>
              <ProductList
                books={displayedBooks}
                onToggleFavorite={handleToggleFavorite}
                onToggleCheck={handleToggleCheck}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={filteredBooks.length}
                itemsPerPage={parseInt(itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default SearchResultsPage;
