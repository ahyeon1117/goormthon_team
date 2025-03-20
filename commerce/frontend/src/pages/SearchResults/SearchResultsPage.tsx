import React, { useState, useEffect } from 'react';
import FilterSidebar from './components/FilterSidebar/FilterSidebar.tsx';
import ProductList from './components/ProductList/ProductList.tsx';
import SortingBar from './components/SortingBar/SortingBar.tsx';
import ApiDebugInfo from './components/ApiDebugInfo/ApiDebugInfo';
import Pagination from './components/Pagination/Pagination.tsx';
import { PageContainer, ResultHeaderStyled, CategoryTabsStyled } from './SearchResultsPage.styled';
import { BookItem, SortOption } from '../../types';
import { getAllProducts, searchProducts } from '../../api/productApi';
import { useLocation } from 'react-router-dom';

// 정렬 옵션
const sortOptions: SortOption[] = [
  { id: 'popularity', label: '인기순' },
  { id: 'recent', label: '최신순' },
  { id: 'price-low', label: '가격낮은순' },
  { id: 'price-high', label: '가격높은순' },
];

const itemsPerPageOptions = [
  { id: '20', label: '20개씩 보기' },
  { id: '40', label: '40개씩 보기' },
  { id: '60', label: '60개씩 보기' },
];

// 카테고리 탭 데이터
const categoryTabs = [
  { id: 'all', label: '통합검색', count: 800 },
  { id: 'domestic', label: '국내도서', count: 200 },
  { id: 'foreign', label: '외국도서', count: 600 },
];

const SearchResultsPage: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [itemsPerPage, setItemsPerPage] = useState<string>('20');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('keyword') || '';

  const [totalResults, setTotalResults] = useState<number>(0);
  const [displayedBooks, setDisplayedBooks] = useState<BookItem[]>([]);

  // 검색어가 변경되거나 페이지가 로드될 때 API 호출
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // 검색어 변경 시 첫 페이지로 초기화

      try {
        let result: BookItem[] = [];

        if (searchKeyword) {
          // 검색어가 있으면 검색 API 호출
          console.log(`API 호출: searchProducts("${searchKeyword}")`);
          result = await searchProducts(searchKeyword);
          console.log('검색 결과:', result);
        } else {
          // 검색어가 없으면 전체 상품 목록 가져오기
          console.log('API 호출: getAllProducts()');
          result = await getAllProducts();
          console.log('전체 상품 목록:', result);
        }

        setBooks(result);
        setTotalResults(result.length);
        setLoading(false);
      } catch (err) {
        console.error('상품 데이터를 가져오는 중 오류 발생:', err);
        setError('상품 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchKeyword]);

  // 화면에 표시할 책 목록을 페이지와 아이템 수에 따라 필터링
  useEffect(() => {
    if (books.length === 0) return;

    const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
    const endIndex = startIndex + parseInt(itemsPerPage);
    setDisplayedBooks(books.slice(startIndex, endIndex));
  }, [books, currentPage, itemsPerPage]);

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 초기화
    // 정렬 로직 구현
    const sortedBooks = [...books];

    switch(sortId) {
      case 'recent':
        // 최신순 정렬 (출판일 기준)
        sortedBooks.sort((a, b) => {
          if (!a.publishDate || !b.publishDate) return 0;
          return b.publishDate.localeCompare(a.publishDate);
        });
        break;
      case 'price-low':
        // 가격 낮은순 정렬
        sortedBooks.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        // 가격 높은순 정렬
        sortedBooks.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
      default:
        // 인기순 정렬 (리뷰 수 기준)
        sortedBooks.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setBooks(sortedBooks);
  };

  const handleItemsPerPageChange = (count: string) => {
    setItemsPerPage(count);
    setCurrentPage(1); // 페이지당 아이템 수 변경 시 첫 페이지로 초기화
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --------------------------------------------------------------------

  const handleToggleFavorite = (bookId: string) => {
    setBooks(books.map(book =>
      book.id === bookId ? { ...book, isFavored: !book.isFavored } : book
    ));
  };

  const handleToggleCheck = (bookId: string) => {
    setBooks(books.map(book =>
      book.id === bookId ? { ...book, isChecked: !book.isChecked } : book
    ));
  };

  // 선택된 책들을 찜하기 목록에 추가하는 함수
  const handleAddSelectedToWishlist = () => {
    const selectedBooks = books.filter(book => book.isChecked);

    if (selectedBooks.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }

    console.log('찜하기 목록에 추가할 책들:', selectedBooks);
    // 여기에 찜하기 API 호출 로직 구현
    alert(`${selectedBooks.length}개의 상품을 찜하기 목록에 추가했습니다.`);

    // 선택 상태 초기화
    setBooks(books.map(book => ({ ...book, isChecked: false })));
  };

  // 선택된 책들을 장바구니에 추가하는 함수
  const handleAddSelectedToCart = () => {
    const selectedBooks = books.filter(book => book.isChecked);

    if (selectedBooks.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }

    console.log('장바구니에 추가할 책들:', selectedBooks);
    // 여기에 장바구니 추가 API 호출 로직 구현
    alert(`${selectedBooks.length}개의 상품을 장바구니에 담았습니다.`);

    // 선택 상태 초기화
    setBooks(books.map(book => ({ ...book, isChecked: false })));
  };

  // 카테고리 탭 변경 핸들러
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 초기화
    // TODO: 카테고리에 따른 데이터 필터링 로직 구현 필요
    console.log(`카테고리 변경: ${categoryId}`);

    // 실제 구현에서는 API 호출 또는 필터링 로직 추가 필요
  };

  return (
    <PageContainer>
      {/* 카테고리 탭 영역 - 통합검색, 국내도서, 외국도서 */}
      <CategoryTabsStyled>
        {categoryTabs.map(tab => (
          <div
            key={tab.id}
            className={`category-tab ${selectedCategory === tab.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(tab.id)}
          >
            <span className="label">{tab.label}</span>
            <span className="count">({tab.count})</span>
          </div>
        ))}
      </CategoryTabsStyled>

      <div className="search-content-wrapper" style={{ display: 'flex' }}>
        <FilterSidebar />
        <div className="search-results-main-content">
          <ResultHeaderStyled>
            <div className="result-count">
              {searchKeyword && <strong className="keyword">{searchKeyword}</strong>}
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

          {/* (임시) API 호출 디버깅 정보 */}
          <ApiDebugInfo
            searchKeyword={searchKeyword}
            totalResults={totalResults}
            loading={loading}
            error={error}
          />

          {loading ? (
            <div className="loading-indicator">로딩 중...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : books.length === 0 ? (
            <div className="no-results" style={{
              padding: '30px',
              textAlign: 'center',
              fontSize: '18px',
              color: '#666'
            }}>
              <p>검색 결과가 없습니다.</p>
              {searchKeyword && (
                <p>
                  <strong>'{searchKeyword}'</strong>에 대한 검색 결과가 없습니다.<br />
                  다른 검색어로 다시 시도해보세요.
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
                totalItems={books.length}
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
