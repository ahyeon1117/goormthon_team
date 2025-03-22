import React from 'react';
import { ApiDebugInfoStyled } from './ApiDebugInfo.styled';

interface ApiDebugInfoProps {
  searchKeyword: string;
  totalResults: number;
  loading: boolean;
  error: string | null;
}

const ApiDebugInfo: React.FC<ApiDebugInfoProps> = ({
  searchKeyword,
  totalResults,
  loading,
  error
}) => {
  return (
    <ApiDebugInfoStyled>
      <h3>API 호출 정보</h3>
      <p>
        <strong>검색어:</strong> {searchKeyword || "(없음)"}
      </p>
      <p>
        <strong>API 엔드포인트:</strong>{" "}
        {searchKeyword
          ? `/api/v1/products/search?keyword=${searchKeyword}`
          : "/api/v1/products"}
      </p>
      <p>
        <strong>결과 수:</strong> {totalResults}
      </p>
      <p>
        <strong>로딩 상태:</strong> {loading ? "로딩 중..." : "완료"}
      </p>
      {error && (
        <p className="error">
          <strong>오류:</strong> {error}
        </p>
      )}
    </ApiDebugInfoStyled>
  );
};

export default ApiDebugInfo;
