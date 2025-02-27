import React, { useState } from 'react';
import FilterSidebar from './components/FilterSidebar/FilterSidebar.tsx';
import ProductList from './components/ProductList/ProductList.tsx';
import SortingBar from './components/SortingBar/SortingBar.tsx';
import { PageContainer, ResultHeaderStyled, CategoryTabsStyled } from './SearchResultsPage.styled';
import { BookItem, SortOption } from '../../types';

// 임시 데이터
const mockBooks: BookItem[] = [
  {
    id: '1',
    title: '[국내도서] 자바스크립트 + 리액트 디자인 패턴',
    imageUrl: 'https://image.yes24.com/goods/129374961/L',
    author: '애디 오스마니',
    publisher: '한빛미디어',
    publishDate: '2024년 08월 01일',
    price: 25200,
    rating: 9.06,
    reviewCount: 15,
    isFavored: false,
    isChecked: false
  },
  {
    id: '2',
    title: '[국내도서] 자바스크립트 + 리액트 디자인 패턴',
    imageUrl: 'https://image.yes24.com/goods/129374961/L',
    author: '애디 오스마니',
    publisher: '한빛미디어',
    publishDate: '2024년 08월 01일',
    price: 25200,
    rating: 9.06,
    reviewCount: 15,
    isFavored: false,
    isChecked: false
  },
  {
    id: '3',
    title: '[국내도서] 자바스크립트 + 리액트 디자인 패턴',
    imageUrl: 'https://image.yes24.com/goods/129374961/L',
    author: '애디 오스마니',
    publisher: '한빛미디어',
    publishDate: '2024년 08월 01일',
    price: 25200,
    rating: 9.06,
    reviewCount: 15,
    isFavored: false,
    isChecked: false
  },
  // 추가 도서 데이터...
];

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
  const [books, setBooks] = useState<BookItem[]>(mockBooks);
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [itemsPerPage, setItemsPerPage] = useState<string>('20');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchKeyword = '자바스크립트';

  const totalResults = 800;

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    // 실제 정렬 로직 구현
  };

  const handleItemsPerPageChange = (count: string) => {
    setItemsPerPage(count);
    // 페이지당 아이템 수 변경 로직
  };

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

  // 카테고리 탭 변경 핸들러
  // 추후 실제 기능 구현 필요
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // TODO: 카테고리에 따른 데이터 필터링 로직 구현 필요
    console.log(`카테고리 변경: ${categoryId}`);
  };

  // 선택된 책들을 장바구니에 추가하는 함수
  // 나중에 장바구니 버튼을 추가할 때 사용될 예정
  /*
  const handleAddSelectedToCart = () => {
    const selectedBooks = books.filter(book => book.isChecked);
    console.log('장바구니에 추가할 책들:', selectedBooks);
    // 여기에 장바구니 추가 API 호출 로직 구현
  };
  */

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
              <strong>{searchKeyword}</strong> <strong>검색 결과 총 {totalResults}건</strong>
            </div>
            <SortingBar
              sortOptions={sortOptions}
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
              itemsPerPageOptions={itemsPerPageOptions}
              selectedItemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </ResultHeaderStyled>
          <ProductList
            books={books}
            onToggleFavorite={handleToggleFavorite}
            onToggleCheck={handleToggleCheck}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default SearchResultsPage;
