import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SidebarContainer,
  SearchBox,
  FilterSection,
  FilterTitle,
  FilterList,
  FilterItem,
  Checkbox,
} from "./FilterSidebar.styled.ts";

interface FilterSidebarProps {
  onWithinSearch: (searchTerm: string) => void;
  searchConditions: {
    title: boolean;
    author: boolean;
    publisher: boolean;
  };
  onSearchConditionChange: (conditionId: string, checked: boolean) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onWithinSearch,
  searchConditions,
  onSearchConditionChange,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentKeyword = searchParams.get("keyword") || "";

  // 필터 카테고리 및 옵션 데이터를 useState로 초기화
  const [filterCategories, setFilterCategories] = useState([
    {
      id: "condition",
      title: "검색 조건",
      options: [
        { id: "title", label: "제목", checked: searchConditions.title },
        { id: "author", label: "저자", checked: searchConditions.author },
        {
          id: "publisher",
          label: "출판사",
          checked: searchConditions.publisher,
        },
      ],
    },
    {
      id: "category",
      title: "분야별 조회",
      disabled: true, // 분야별 조회 카테고리를 비활성화하기 위한 플래그 추가
      options: [
        { id: "novel", label: "소설/에세이/시", checked: false },
        { id: "humanities", label: "인문/역사", checked: false },
        { id: "society", label: "정치/사회", checked: false },
        { id: "art", label: "예술", checked: false },
        { id: "religion", label: "종교", checked: false },
        { id: "economy", label: "경제/자기계발", checked: false },
        { id: "politics", label: "정치/사회", checked: false },
        { id: "study", label: "수험서/자격증", checked: false },
        { id: "computer", label: "컴퓨터/IT", checked: false },
        { id: "health", label: "건강/여행/요리", checked: false },
        { id: "science", label: "과학", checked: false },
      ],
    },
  ]);

  // searchConditions props가 변경될 때마다 필터 옵션 업데이트
  useEffect(() => {
    console.log("검색 조건 업데이트:", searchConditions);

    setFilterCategories((prevCategories) => {
      const updatedCategories = [...prevCategories]; // 새 배열 생성

      // 검색 조건 카테고리 찾기
      const conditionCategoryIndex = updatedCategories.findIndex(
        (category) => category.id === "condition"
      );

      if (conditionCategoryIndex !== -1) {
        // 검색 조건 카테고리의 옵션들 업데이트
        const updatedOptions = updatedCategories[
          conditionCategoryIndex
        ].options.map((option) => ({
          ...option,
          checked:
            searchConditions[option.id as keyof typeof searchConditions] ||
            false,
        }));

        // 업데이트된 옵션으로 카테고리 업데이트
        updatedCategories[conditionCategoryIndex] = {
          ...updatedCategories[conditionCategoryIndex],
          options: updatedOptions,
        };

        return updatedCategories;
      }

      return prevCategories;
    });
  }, [searchConditions]);

  const handleFilterChange = (categoryId: string, optionId: string) => {
    if (categoryId === "condition") {
      // 검색 조건 변경 시 부모 컴포넌트에 알림
      const category = filterCategories.find((c) => c.id === categoryId);
      const option = category?.options.find((o) => o.id === optionId);

      if (option) {
        console.log("검색 조건 변경:", optionId, !option.checked);
        onSearchConditionChange(optionId, !option.checked);

        // 여기서는 로컬 상태를 변경하지 않고, props로부터 전달받은 searchConditions가
        // 변경되면 위의 useEffect에서 filterCategories를 업데이트합니다.
        return;
      }
    }

    // 다른 카테고리(분야별 조회 등)의 로컬 상태 업데이트
    setFilterCategories(
      filterCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            options: category.options.map((option) => {
              if (option.id === optionId) {
                return { ...option, checked: !option.checked };
              }
              return option;
            }),
          };
        }
        return category;
      })
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchKeyword.trim()) {
      // 결과 내 재검색 실행
      onWithinSearch(searchKeyword);

      // 검색 후 입력창 초기화
      setSearchKeyword("");
    }
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
            placeholder={currentKeyword ? "결과 내 검색" : "검색어 입력"}
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
      </FilterSection>

      {filterCategories.map((category) => (
        <FilterSection key={category.id}>
          <FilterTitle>{category.title}</FilterTitle>
          <FilterList>
            {category.options.map((option) => (
              <FilterItem key={option.id}>
                <Checkbox
                  type="checkbox"
                  id={`${category.id}-${option.id}`}
                  checked={option.checked}
                  onChange={() => handleFilterChange(category.id, option.id)}
                  disabled={category.disabled}
                />
                <label
                  htmlFor={`${category.id}-${option.id}`}
                  style={{
                    color: category.disabled ? "#999" : "inherit",
                    cursor: category.disabled ? "default" : "pointer",
                  }}
                >
                  {option.label}
                </label>
              </FilterItem>
            ))}
          </FilterList>
        </FilterSection>
      ))}
    </SidebarContainer>
  );
};

export default FilterSidebar;
