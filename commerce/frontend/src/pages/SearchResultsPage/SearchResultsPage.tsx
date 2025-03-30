import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import FilterSidebar from "./components/FilterSidebar/FilterSidebar.tsx";
import ProductList from "./components/ProductList/ProductList.tsx";
import SortingBar from "./components/SortingBar/SortingBar.tsx";
import Pagination from "./components/Pagination/Pagination.tsx";
import SearchOptions from "./components/SearchOptions/SearchOptions.tsx";
import { PageContainer, ResultHeaderStyled, NoResultsStyled } from "./SearchResultsPage.styled";
import { BookItem, SortOption } from "../../types";
import { getAllProducts, searchProducts } from "../../api/productApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks";
import { addWishItem, getWishItems, removeWishItem } from "../../api/wishApi";
import { WishItemResponse, WishResult } from "../../types/apiTypes";
import { getCurrentUserOrderItems } from "../../api/orderApi";

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
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const { addToCart, fetchCartItems, cartItems } = useCart();
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

  // 스크롤 위치 저장 및 복원 로직
  useEffect(() => {
    // 페이지 이동 여부를 확인하는 플래그
    const hasNavigatedAway = sessionStorage.getItem('hasNavigatedAway') === 'true';

    const handleBeforeUnload = () => {
      // 페이지를 떠날 때 현재 스크롤 위치 저장
      if (pageRef.current) {
        // 체크된 상품 ID 목록 생성
        const checkedBookIds = books.filter(book => book.isChecked).map(book => book.id);

        sessionStorage.setItem('searchResultsScrollPosition', window.scrollY.toString());
        sessionStorage.setItem('searchResultsPageState', JSON.stringify({
          currentPage,
          selectedSort,
          itemsPerPage,
          searchParams: location.search,
          checkedBookIds // 체크된 상품 ID 목록 저장
        }));

        // 페이지를 떠날 때 네비게이션 플래그 설정
        sessionStorage.setItem('hasNavigatedAway', 'true');
      }
    };

    // 페이지 로드 시 저장된 스크롤 위치 복원
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem('searchResultsScrollPosition');
      const savedState = sessionStorage.getItem('searchResultsPageState');

      if (savedPosition && savedState && hasNavigatedAway) {
        const parsedState = JSON.parse(savedState);

        // URL 파라미터가 동일한 경우에만 스크롤 위치 복원
        if (parsedState.searchParams === location.search) {
          // 상태 복원
          if (parsedState.currentPage) setCurrentPage(parsedState.currentPage);
          if (parsedState.selectedSort) setSelectedSort(parsedState.selectedSort);
          if (parsedState.itemsPerPage) setItemsPerPage(parsedState.itemsPerPage);

          // 약간의 지연 후 스크롤 위치 복원 (컨텐츠가 로드된 후)
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(savedPosition),
              behavior: 'auto'
            });
          }, 100);

          // 스크롤 복원 후 네비게이션 플래그 재설정
          sessionStorage.setItem('hasNavigatedAway', 'false');
        } else {
          // URL이 변경된 경우 저장된 상태 삭제
          // (검색 결과 페이지에서 다른 검색어로 검색하거나 필터를 변경하는 등 URL 파라미터가 바뀐 경우)
          sessionStorage.removeItem('searchResultsScrollPosition');
          sessionStorage.removeItem('searchResultsPageState');
          sessionStorage.setItem('hasNavigatedAway', 'false');
        }
      }
    };

    // 컴포넌트 마운트 시 스크롤 위치 복원
    restoreScrollPosition();

    // 페이지 이탈 시 스크롤 위치 저장
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.search, currentPage, selectedSort, itemsPerPage, books]);

  // 체크박스 상태 복원 로직
  useEffect(() => {
    // 도서 데이터가 로드되고 로딩이 완료된 후에만 실행
    if (!loading && books.length > 0) {
      const savedState = sessionStorage.getItem('searchResultsPageState');

      if (savedState) {
        const parsedState = JSON.parse(savedState);

        // URL 파라미터가 동일한 경우에만 체크박스 상태 복원
        if (parsedState.searchParams === location.search && parsedState.checkedBookIds) {
          console.log('체크박스 상태 복원:', parsedState.checkedBookIds);

          // 체크된 상품 ID 목록이 있는 경우에만 업데이트 진행
          if (parsedState.checkedBookIds.length > 0) {
            // 체크박스 상태 복원
            const updatedBooks = books.map(book => ({
              ...book,
              isChecked: parsedState.checkedBookIds.includes(book.id)
            }));

            setBooks(updatedBooks);

            // 원본 도서 목록에도 체크 상태 적용
            const updatedOriginalBooks = originalBooks.map(book => ({
              ...book,
              isChecked: parsedState.checkedBookIds.includes(book.id)
            }));

            setOriginalBooks(updatedOriginalBooks);

            // 복원 완료 후 저장된 체크박스 상태 정보 제거하여 다시 실행되지 않도록 함
            const newState = { ...parsedState };
            delete newState.checkedBookIds;
            sessionStorage.setItem('searchResultsPageState', JSON.stringify(newState));
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [loading, books.length, originalBooks.length, location.search]);

  // 상품 클릭 시 현재 스크롤 위치 저장 핸들러
  const handleProductClick = (bookId: string) => {
    // 현재 스크롤 위치 저장
    const checkedBookIds = books.filter(book => book.isChecked).map(book => book.id);

    sessionStorage.setItem('searchResultsScrollPosition', window.scrollY.toString());
    sessionStorage.setItem('searchResultsPageState', JSON.stringify({
      currentPage,
      selectedSort,
      itemsPerPage,
      searchParams: location.search,
      checkedBookIds
    }));

    // 상품 상세 페이지로 이동 시 네비게이션 플래그 설정
    sessionStorage.setItem('hasNavigatedAway', 'true');

    // 상세 페이지로 이동
    navigate(`/detail/${bookId}`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤 (페이지 변경 시에는 맨 위로)
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 체크된 상품 ID 목록 생성
    const checkedBookIds = books.filter(book => book.isChecked).map(book => book.id);

    // 페이지 변경 시 현재 상태 저장
    sessionStorage.setItem('searchResultsPageState', JSON.stringify({
      currentPage: pageNumber,
      selectedSort,
      itemsPerPage,
      searchParams: location.search,
      checkedBookIds
    }));
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
        let tagText;
        switch (conditionId) {
          case "title":
            tagText = "제목";
            break;
          case "author":
            tagText = "저자";
            break;
          case "publisher":
            tagText = "출판사";
            break;
          default:
            tagText = conditionId;
            break;
        }

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

  // 찜하기 관련 상태 업데이트 로직을 통합하는 헬퍼 함수
  const updateBooksWithWishStatus = (bookList: BookItem[], wishItems: WishItemResponse[]) => {
    return bookList.map(book => ({
      ...book,
      isFavored: wishItems.some(item => String(item.productId) === String(book.id))
    }));
  };

  // 찜하기 상태 업데이트를 관리하는 통합 함수
  const updateWishStatusInBooks = useCallback(async () => {
    try {
      setWishLoading(true);

      // 서버에서 최신 찜 목록 데이터 조회
      const wishItems = await getWishItems();
      console.log('찜 목록 데이터 로드 완료:', wishItems);

      if (books.length > 0) {
        // 도서 목록 및 원본 도서 목록에 찜 상태 반영
        setBooks(prev => updateBooksWithWishStatus(prev, wishItems));
        setOriginalBooks(prev => updateBooksWithWishStatus(prev, wishItems));
      }

      return wishItems;
    } catch (error) {
      console.error('찜 상태 업데이트 오류:', error);
      // 상세 에러 정보 로깅
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
      }
      throw error; // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있게 함
    } finally {
      setWishLoading(false);
    }
  }, [books.length, setBooks, setOriginalBooks, setWishLoading]);

  const handleToggleFavorite = async (bookId: string) => {
    try {
      setWishLoading(true);
      console.log(`찜하기 토글: 도서 ID(${bookId})`);

      // 현재 도서의 찜 상태 확인
      const book = books.find(book => book.id === bookId);
      if (!book) {
        console.error('찜하기 토글: 도서를 찾을 수 없음');
        return;
      }

      const isCurrentlyFavored = book.isFavored;
      let success = false;

      if (isCurrentlyFavored) {
        // 찜 목록에서 제거
        console.log(`도서 ID(${bookId})를 찜 목록에서 제거 중...`);
        success = await removeWishItem(Number(bookId));
        if (success) {
          console.log(`도서 ID(${bookId})를 찜 목록에서 제거 완료`);
        } else {
          console.error('찜 목록에서 제거 실패');
          throw new Error('찜 목록에서 제거에 실패했습니다.');
        }
      } else {
        // 찜 목록에 추가
        console.log(`도서 ID(${bookId})를 찜 목록에 추가 중...`);
        success = await addWishItem(Number(bookId));
        if (success) {
          console.log(`도서 ID(${bookId})를 찜 목록에 추가 완료`);
        } else {
          console.error('찜 목록에 추가 실패');
          throw new Error('찜 목록에 추가에 실패했습니다.');
        }
      }

      // 서버에서 최신 찜 목록을 다시 가져와서 UI 상태 동기화
      await updateWishStatusInBooks();
    } catch (error) {
      console.error('찜하기 토글 중 오류 발생:', error);
      alert('찜하기 처리 중 오류가 발생했습니다.');
    } finally {
      setWishLoading(false);
    }
  };

  const handleToggleCheck = (bookId: string) => {
    // 현재 표시되는 도서 목록에서 체크 상태 업데이트
    const updatedDisplayedBooks = displayedBooks.map((book) =>
      book.id === bookId ? { ...book, isChecked: !book.isChecked } : book
    );
    setDisplayedBooks(updatedDisplayedBooks);

    // 전체 도서 목록에서도 체크 상태 업데이트
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, isChecked: !book.isChecked } : book
    );
    setBooks(updatedBooks);

    // 원본 도서 목록에서도 체크 상태 업데이트
    const updatedOriginalBooks = originalBooks.map((book) =>
      book.id === bookId ? { ...book, isChecked: !book.isChecked } : book
    );
    setOriginalBooks(updatedOriginalBooks);

    // 디버깅 로그 추가
    console.log(`도서 ID ${bookId} 체크 상태 토글`);

    // 체크된 상품 수 계산 및 콘솔 로그 출력
    const checkedCount = updatedBooks.filter(book => book.isChecked).length;
    console.log(`현재 체크된 상품 수: ${checkedCount}개 / 전체 ${books.length}개`);
    console.log(`현재 화면에 표시된 상품 중 체크된 수: ${updatedDisplayedBooks.filter(book => book.isChecked).length}개 / ${displayedBooks.length}개`);
  };

  // 선택된 책들을 찜하기 목록에 추가하는 함수
  const handleAddSelectedToWishlist = async () => {
    const selectedBooks = books.filter((book) => book.isChecked);

    if (selectedBooks.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    try {
      setWishLoading(true);
      console.log("찜하기 목록에 추가할 책들:", selectedBooks);

      // 현재 찜 목록 가져오기
      const currentWishItems = await getWishItems();

      // 이미 찜한 상품 필터링
      const notInWishList = selectedBooks.filter(book => {
        const isInWishList = currentWishItems.some(item => {
          const itemId = String(item.productId);
          const bookId = String(book.id);
          return itemId === bookId;
        });
        return !isInWishList;
      });

      // 모든 상품이 이미 찜하기에 있는 경우
      if (notInWishList.length === 0) {
        alert("선택한 상품이 모두 이미 찜하기 목록에 있습니다.");
        setWishLoading(false);
        return;
      }

      // 찜하기에 없는 상품만 추가
      console.log(`${notInWishList.length}개 상품을 찜하기 목록에 추가합니다.`);

      // 병렬 처리를 위한 Promise.all 사용 시 세부 에러 처리 개선
      const results = await Promise.allSettled(
        notInWishList.map(async (book) => {
          try {
            const success = await addWishItem(Number(book.id));
            return { id: book.id, success, error: null } as WishResult;
          } catch (error) {
            return { id: book.id, success: false, error } as WishResult;
          }
        })
      );

      // 성공 및 실패 건수 계산
      const successResults = results.filter(r => r.status === 'fulfilled' && (r.value as WishResult).success);
      const failResults = results.filter(r => r.status === 'rejected' || !((r.status === 'fulfilled' && (r.value as WishResult).success)));

      const successCount = successResults.length;
      const failCount = failResults.length;
      const alreadyInWishCount = selectedBooks.length - notInWishList.length;

      // 실패한 상품 ID 로깅
      if (failCount > 0) {
        console.error('찜하기 추가 실패한 상품:', failResults.map(r => {
          if (r.status === 'rejected') {
            return { id: 'unknown', reason: r.reason };
          } else {
            return { id: (r.value as WishResult).id, error: (r.value as WishResult).error };
          }
        }));
      }

      // 결과 메시지 생성 및 표시
      let message = '';

      if (successCount > 0) {
        message += `${successCount}개 상품이 찜하기 목록에 추가되었습니다. `;
      }

      if (failCount > 0) {
        message += `${failCount}개 상품은 추가되지 않았습니다. `;
      }

      if (alreadyInWishCount > 0) {
        message += `${alreadyInWishCount}개 상품은 이미 찜하기 목록에 있습니다.`;
      }

      alert(message.trim());

      // 서버에서 최신 찜 목록을 다시 가져와서 UI 상태 동기화
      await updateWishStatusInBooks();
    } catch (error) {
      console.error('찜하기 추가 중 오류 발생:', error);
      if (error instanceof Error) {
        console.error('에러 상세:', error.message);
      }
      alert('찜하기 추가 중 오류가 발생했습니다.');
    } finally {
      setWishLoading(false);
    }
  };

  // 상품 개별 또는 선택된 상품 장바구니 추가 핸들러 (ProductItem용)
  const handleProductAddToCart = async (bookId: string, isChecked: boolean) => {
    try {
      setCartLoading(true);

      if (isChecked) {
        // 체크된 상품이 있는 경우 모든 체크된 상품 장바구니에 추가 (상단 정렬바 로직과 동일하게 작동)
        const checkedBooks = books.filter(book => book.isChecked);
        console.log(`체크된 ${checkedBooks.length}개 상품을 장바구니에 추가합니다.`);

        if (checkedBooks.length === 0) {
          alert("선택된 상품이 없습니다.");
          setCartLoading(false);
          return;
        }

        // 체크된 상품 중 이미 장바구니에 있는 상품 필터링
        const notInCartBooks = checkedBooks.filter(book => {
          const isInCart = cartItems.some(item => {
            const itemId = String(item.productId);
            const productId = String(book.id);
            return itemId === productId;
          });
          return !isInCart;
        });

        // 모든 상품이 이미 장바구니에 있는 경우
        if (notInCartBooks.length === 0) {
          alert("선택한 상품이 모두 이미 장바구니에 있습니다.");
          setCartLoading(false);
          return;
        }

        // 장바구니에 없는 상품만 추가
        console.log(`${notInCartBooks.length}개 상품을 장바구니에 추가합니다.`);
        const results = await Promise.all(
          notInCartBooks.map(async (book) => {
            const success = await addToCart(book.id);
            return { id: book.id, success };
          })
        );

        // 성공 및 실패 건수 계산
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;
        const alreadyInCartCount = checkedBooks.length - notInCartBooks.length;

        if (alreadyInCartCount > 0) {
          if (failCount > 0) {
            alert(`${successCount}개 상품이 장바구니에 담겼습니다. ${failCount}개 상품은 담기지 않았습니다. ${alreadyInCartCount}개 상품은 이미 장바구니에 있습니다.`);
          } else {
            alert(`${successCount}개 상품이 장바구니에 담겼습니다. ${alreadyInCartCount}개 상품은 이미 장바구니에 있습니다.`);
          }
        } else {
          if (failCount > 0) {
            alert(`${successCount}개 상품이 장바구니에 담겼습니다. ${failCount}개 상품은 담기지 않았습니다.`);
          } else {
            alert(`${successCount}개의 상품을 장바구니에 담았습니다.`);
          }
        }

        // 체크박스 상태 유지 (초기화 코드 제거)
      } else {
        // 체크되지 않은 경우 클릭한 상품만 장바구니에 추가 (이미 있는지 확인)
        console.log(`상품 ID(${bookId})를 장바구니에 추가합니다.`);

        // 해당 상품이 이미 장바구니에 있는지 확인
        const isAlreadyInCart = cartItems.some(item => {
          const itemId = String(item.productId);
          const productId = String(bookId);
          return itemId === productId;
        });

        if (isAlreadyInCart) {
          alert('이미 장바구니에 담긴 상품입니다.');
        } else {
          const success = await addToCart(bookId);

          if (success) {
            alert('상품이 장바구니에 담겼습니다.');
          } else {
            alert('장바구니 추가에 실패했습니다.');
          }
        }
      }

      // 장바구니 상태 갱신
      await fetchCartItems();
    } catch (error) {
      console.error('장바구니 추가 중 오류 발생:', error);
      alert('장바구니 추가 중 오류가 발생했습니다.');
    } finally {
      setCartLoading(false);
    }
  };

  // 선택된 책들을 장바구니에 추가하는 함수 (SortingBar용)
  const handleAddSelectedToCart = async () => {
    // 체크 상태인 상품만을 장바구니에 추가하는 함수 호출 (가짜 bookId 전달)
    await handleProductAddToCart('dummy', true);
  };

  // 중복된 useEffect 통합
  useEffect(() => {
    // 도서 데이터가 로드되었을 때만 찜 목록 상태 업데이트
    if (!loading && books.length > 0) {
      updateWishStatusInBooks().catch(error => {
        console.error('찜 목록 데이터 로드 실패:', error);
      });
    }
  }, [loading, books.length, updateWishStatusInBooks]);

  // 바로구매 처리 함수 (ProductItem용)
  const handleProductPurchase = async (bookId: string, isChecked: boolean) => {
    try {
      console.log(`바로구매 요청: 상품 ID(${bookId}), 체크 상태(${isChecked})`);

      // 사용자의 기존 구매 상품 목록 조회
      const userOrderItems = await getCurrentUserOrderItems();
      console.log('사용자 구매 상품 목록:', userOrderItems);

      // 체크된 상품이 있는 경우
      if (isChecked) {
        const checkedBooks = books.filter(book => book.isChecked);

        if (checkedBooks.length === 0) {
          alert("선택된 상품이 없습니다.");
          return;
        }

        console.log(`체크된 ${checkedBooks.length}개 상품 바로구매 진행`);

        // 이미 구매한 상품 필터링
        const alreadyPurchasedBooks = checkedBooks.filter(book =>
          userOrderItems.some(item => String(item.id) === String(book.id))
        );

        // 새로 구매할 상품 필터링
        const newBooks = checkedBooks.filter(book =>
          !userOrderItems.some(item => String(item.id) === String(book.id))
        );

        // 모든 상품이 이미 구매한 경우
        if (alreadyPurchasedBooks.length === checkedBooks.length) {
          alert('선택하신 모든 상품은 이미 구매하신 상품입니다.');
          return;
        }

        // 일부 상품만 이미 구매한 경우
        if (alreadyPurchasedBooks.length > 0 && newBooks.length > 0) {
          const confirmPurchase = window.confirm(
            `선택하신 ${checkedBooks.length}개 상품 중 ${alreadyPurchasedBooks.length}개는 이미 구매하신 상품입니다.\n` +
            `나머지 ${newBooks.length}개 상품만 구매하시겠습니까?`
          );

          if (!confirmPurchase) {
            return;
          }
        }

        // 주문 정보 생성 (이미 구매한 상품 제외)
        const orderItems = newBooks.map(book => ({
          productId: Number(book.id),
          title: book.title,
          discount: book.price,
          image: book.imageUrl,
          author: book.author,
          publisher: book.publisher
        }));

        // 주문 페이지로 이동
        navigate('/order', {
          state: {
            items: orderItems,
            isDirectPurchase: true,
            totalPrice: orderItems.reduce((sum, item) => sum + item.discount, 0)
          }
        });
      } else {
        // 체크되지 않은 경우 클릭한 상품만 주문
        const book = books.find(book => book.id === bookId);

        if (!book) {
          console.error('주문할 상품을 찾을 수 없습니다.');
          return;
        }

        console.log(`상품 ID(${bookId}) 단일 상품 바로구매 진행`);

        // 해당 상품이 이미 구매한 상품인지 확인
        const isAlreadyPurchased = userOrderItems.some(item =>
          String(item.id) === String(bookId)
        );

        if (isAlreadyPurchased) {
          alert('이미 구매하신 상품입니다.');
          return;
        }

        // 주문 정보 생성
        const orderItem = {
          productId: Number(book.id),
          title: book.title,
          discount: book.price,
          image: book.imageUrl,
          author: book.author,
          publisher: book.publisher
        };

        // 주문 페이지로 이동
        navigate('/order', {
          state: {
            items: [orderItem],
            isDirectPurchase: true
          }
        });
      }
    } catch (error) {
      console.error('바로구매 처리 중 오류 발생:', error);
      alert('바로구매 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <PageContainer ref={pageRef}>
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
              cartLoading={cartLoading}
              wishLoading={wishLoading}
            />
          </ResultHeaderStyled>

          {/* 결과 내 재검색 및 검색 조건 관련 컴포넌트 */}
          <SearchOptions tags={searchTags} onRemoveTag={handleRemoveTag} />

          {loading ? (
            <div className="loading-indicator">로딩 중...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredBooks.length === 0 ? (
            <NoResultsStyled>
              <p>검색 결과가 없습니다.</p>
              {searchKeyword &&
              withinSearchTerms.length === 0 &&
              !searchConditions.title &&
              !searchConditions.author &&
              !searchConditions.publisher ? (
                <p>
                  <strong>"{searchKeyword}"</strong>에 대한 검색 결과가 없습니다.
                  <br />
                  다른 검색어로 다시 시도해보세요.
                </p>
              ) : (
                <p>
                  선택하신 조건에 맞는 결과가 없습니다.
                  <br />
                  선택하신 옵션 조건을 변경하거나 다른 검색어로 다시 검색해주세요.
                </p>
              )}
            </NoResultsStyled>
          ) : (
            <>
              <ProductList
                books={displayedBooks}
                onToggleFavorite={handleToggleFavorite}
                onToggleCheck={handleToggleCheck}
                onProductClick={handleProductClick}
                onAddToCart={handleProductAddToCart}
                onPurchase={handleProductPurchase}
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
