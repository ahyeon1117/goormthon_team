import React, { useState } from "react";
import {
  SearchOptionsContainer,
  SearchTags,
  Tag,
} from "./SearchOptions.styled";

interface SearchTag {
  id: string;
  type: string;
  text: string;
}

// props가 없는 컴포넌트로 정의
const SearchOptions: React.FC = () => {
  // 검색 태그 상태 (예시 데이터)
  const [searchTags, setSearchTags] = useState<SearchTag[]>([
    { id: "1", type: "search", text: "통합검색" },
    { id: "2", type: "title", text: "제목" },
    { id: "3", type: "author", text: "저자" },
  ]);

  // 태그 제거 핸들러 (실제 로직은 향후 구현 예정)
  const handleRemoveTag = (tagId: string) => {
    setSearchTags(searchTags.filter((tag) => tag.id !== tagId));
  };

  if (searchTags.length === 0) {
    return null;
  }

  return (
    <SearchOptionsContainer>
      <SearchTags>
        {searchTags.map((tag) => (
          <Tag key={tag.id}>
            {tag.text}
            <button
              className="tag-remove"
              onClick={() => handleRemoveTag(tag.id)}
            >
              ×
            </button>
          </Tag>
        ))}
      </SearchTags>
    </SearchOptionsContainer>
  );
};

export default SearchOptions;
