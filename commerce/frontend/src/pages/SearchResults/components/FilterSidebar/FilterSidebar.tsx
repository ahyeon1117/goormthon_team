import React, { useState } from 'react';
import {
  SidebarContainer,
  SearchBox,
  FilterSection,
  FilterTitle,
  FilterList,
  FilterItem,
  Checkbox
} from './FilterSidebar.styled.ts';

const FilterSidebar: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  // 필터 카테고리 및 옵션 데이터
  const filterCategories = [
    {
      id: 'condition',
      title: '검색 조건',
      options: [
        { id: 'title', label: '제목명', checked: false },
        { id: 'author', label: '저자', checked: false },
        { id: 'publisher', label: '출판사', checked: false }
      ]
    },
    {
      id: 'category',
      title: '분야별 조회',
      options: [
        { id: 'novel', label: '소설/에세이/시', checked: false },
        { id: 'humanities', label: '인문/역사', checked: false },
        { id: 'society', label: '정치/사회', checked: false },
        { id: 'art', label: '예술', checked: false },
        { id: 'education', label: '종교', checked: false },
        { id: 'science', label: '경제/자기계발', checked: false },
        { id: 'politics', label: '정치/사회', checked: false },
        { id: 'children', label: '소설서/자격증', checked: false },
        { id: 'computer', label: '사전', checked: false },
        { id: 'travel', label: '건강/여행/요리', checked: false },
        { id: 'science2', label: '경제/자기계발', checked: false },
        { id: 'novel2', label: '소설/에세이/시', checked: false }
      ]
    }
  ];

  const [filters, setFilters] = useState(filterCategories);

  const handleFilterChange = (categoryId: string, optionId: string) => {
    setFilters(filters.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          options: category.options.map(option => {
            if (option.id === optionId) {
              return { ...option, checked: !option.checked };
            }
            return option;
          })
        };
      }
      return category;
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 로직 구현
    console.log('Searching for:', searchKeyword);
  };

  return (
    <SidebarContainer>
      <FilterSection>
        <FilterTitle>결과 내 재검색</FilterTitle>
        <SearchBox onSubmit={handleSearch}>
          <input
            type="text"
            className="search-keyword-input"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type="submit" className="search-submit-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#555" stroke="#555" strokeWidth="0.5"/>
            </svg>
          </button>
        </SearchBox>
      </FilterSection>

      {filters.map(category => (
        <FilterSection key={category.id}>
          <FilterTitle>{category.title}</FilterTitle>
          <FilterList>
            {category.options.map(option => (
              <FilterItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`${category.id}-${option.id}`}
                  checked={option.checked}
                  onChange={() => handleFilterChange(category.id, option.id)}
                />
                <label htmlFor={`${category.id}-${option.id}`}>{option.label}</label>
              </FilterItem>
            ))}
          </FilterList>
        </FilterSection>
      ))}
    </SidebarContainer>
  );
};

export default FilterSidebar;
