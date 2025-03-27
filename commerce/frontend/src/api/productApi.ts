import { apiRequest } from './client';
import { ProductResponse, mapProductApiToBookItem } from '../types/apiTypes';
import { BookItem } from '../types';

// 상품 API 엔드포인트
const PRODUCT_API = {
  GET_ALL: '/api/v1/products',
  GET_BY_ID: (id: string) => `/api/v1/products/${id}`,
  SEARCH: '/api/v1/products/search',
};

/**
 * 모든 상품 목록을 가져오는 함수
 */
export const getAllProducts = async (): Promise<BookItem[]> => {
  try {
    const response = await apiRequest.get<ProductResponse[]>(PRODUCT_API.GET_ALL);
    if (response.data.code === 200 && response.data.data) {
      return response.data.data.map((product: ProductResponse, index: number) =>
        mapProductApiToBookItem(product, index)
      );
    }

    console.error('상품 데이터를 가져오는데 실패했습니다:', response.data.msg);
    return [];
  } catch (error) {
    console.error('상품 API 호출 중 오류 발생:', error);
    return [];
  }
};

/**
 * ID로 개별 상품을 가져오는 함수
 */
export const getProductById = async (id: string): Promise<BookItem | null> => {
  try {
    console.log(`상품 ID(${id})로 도서 정보 조회 중...`);

    const response = await apiRequest.get<ProductResponse>(PRODUCT_API.GET_BY_ID(id));
    if (response.data.code === 200 && response.data.data) {
      return mapProductApiToBookItem(response.data.data, 0);
    }

    console.warn(`ID(${id})에 해당하는 도서를 찾지 못했습니다.`);
    return null;
  } catch (error) {
    console.error(`ID(${id}) 도서 정보 조회 중 오류 발생:`, error);
    return null;
  }
};

/**
 * 검색어로 상품을 검색하는 함수
 */
export const searchProducts = async (keyword: string): Promise<BookItem[]> => {
  try {
    console.log(`검색어 '${keyword}'로 상품 검색 중...`);

    const response = await apiRequest.get<ProductResponse[]>(PRODUCT_API.SEARCH, {
      params: { keyword }
    });
    if (response.data.code === 200 && response.data.data) {
      console.log(`검색 결과: ${response.data.data.length}개의 상품을 찾았습니다.`);
      return response.data.data.map((product: ProductResponse, index: number) =>
        mapProductApiToBookItem(product, index)
      );
    }

    console.error('검색 결과를 가져오는데 실패했습니다:', response.data.msg);
    return [];
  } catch (error) {
    console.error('상품 검색 API 호출 중 오류 발생:', error);
    return [];
  }
};
