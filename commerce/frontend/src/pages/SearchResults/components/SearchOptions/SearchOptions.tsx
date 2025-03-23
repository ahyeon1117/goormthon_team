import React, { useEffect } from "react";
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

interface SearchOptionsProps {
  tags: SearchTag[];
  onRemoveTag: (tagId: string, tagType: string) => void;
}

const SearchOptions: React.FC<SearchOptionsProps> = ({ tags, onRemoveTag }) => {
  // 디버깅용 태그 정보 출력
  useEffect(() => {
    console.log("현재 검색 태그:", tags);
  }, [tags]);

  if (tags.length === 0) {
    return null;
  }

  return (
    <SearchOptionsContainer>
      <SearchTags>
        {tags.map((tag) => (
          <Tag key={tag.id} className={`tag-${tag.type}`}>
            {tag.text}
            {tag.id !== "1" && (
              <button
                className="tag-remove"
                onClick={() => {
                  console.log(
                    `태그 제거: ${tag.id} (${tag.type}) - ${tag.text}`
                  );
                  onRemoveTag(tag.id, tag.type);
                }}
              >
                ×
              </button>
            )}
          </Tag>
        ))}
      </SearchTags>
    </SearchOptionsContainer>
  );
};

export default SearchOptions;
