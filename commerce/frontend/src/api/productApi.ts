import { apiRequest } from './client';
import { ProductApiItem, mapProductApiToBookItem } from '../types/apiTypes';
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
    const response = await apiRequest.get<ProductApiItem[]>(PRODUCT_API.GET_ALL);

    // API 응답이 성공적이고 데이터가 있는 경우
    if (response.data.code === 200 && response.data.data) {
      // ProductApiItem을 BookItem으로 변환
      return response.data.data.map((product: ProductApiItem, index: number) =>
        mapProductApiToBookItem(product, index)
      );
    }

    // 응답이 성공적이지 않거나 데이터가 없는 경우 빈 배열 반환
    console.error('상품 데이터를 가져오는데 실패했습니다:', response.data.msg);
    return [];
  } catch (error) {
    console.error('상품 API 호출 중 오류 발생:', error);
    return [];
  }
};

/**
 * ID(ISBN)로 특정 상품을 가져오는 함수
 */
export const getProductById = async (id: string): Promise<BookItem | null> => {
  try {
    console.log(`ISBN(${id})으로 도서 정보 조회 중...`);

    // 백엔드 API가 아직 구현 중이므로, 모든 상품을 가져와서 ID(ISBN)로 필터링
    const allProducts = await getAllProducts();
    const foundProduct = allProducts.find(product => product.id === id);

    if (foundProduct) {
      console.log(`ISBN(${id})에 해당하는 도서를 찾았습니다:`, foundProduct.title);
      return foundProduct;
    }

    // 나중에 백엔드 API가 구현되면 아래 코드로 교체
    // const response = await apiRequest.get<ProductApiItem>(PRODUCT_API.GET_BY_ID(id));
    // if (response.data.code === 200 && response.data.data) {
    //   return mapProductApiToBookItem(response.data.data, 0);
    // }

    console.warn(`ISBN(${id})에 해당하는 도서를 찾지 못했습니다.`);
    return null;
  } catch (error) {
    console.error(`ISBN(${id}) 도서 정보 조회 중 오류 발생:`, error);
    return null;
  }
};

/**
 * 검색어로 상품을 검색하는 함수
 */
export const searchProducts = async (keyword: string): Promise<BookItem[]> => {
  try {
    // 백엔드 API 엔드포인트가 변경되었을 수 있으므로 임시 대안으로 전체 상품을 가져와서 클라이언트에서 필터링
    console.log(`검색 API 호출 시도: ${PRODUCT_API.SEARCH}?keyword=${keyword}`);

    try {
      // 먼저 검색 API를 시도
      const response = await apiRequest.get<ProductApiItem[]>(PRODUCT_API.SEARCH, {
        params: { keyword }
      });

      // API 응답이 성공적이고 데이터가 있는 경우
      if (response.data.code === 200 && response.data.data) {
        // ProductApiItem을 BookItem으로 변환
        return response.data.data.map((product: ProductApiItem, index: number) =>
          mapProductApiToBookItem(product, index)
        );
      }

      // 응답이 성공적이지 않거나 데이터가 없는 경우 빈 배열 반환
      console.error('검색 결과를 가져오는데 실패했습니다:', response.data.msg);
      return [];
    } catch {
      // 오류 메시지를 간단하게 표시
      console.log('검색 API가 구현되지 않았습니다. 전체 상품 목록에서 필터링합니다.');

      // 검색 API가 실패하면 전체 상품 목록을 가져와서 클라이언트에서 필터링
      const allProductsResponse = await apiRequest.get<ProductApiItem[]>(PRODUCT_API.GET_ALL);

      if (allProductsResponse.data.code === 200 && allProductsResponse.data.data) {
        // 전체 상품 목록에서 검색어로 필터링
        const filteredProducts = allProductsResponse.data.data.filter((product: ProductApiItem) =>
          product.title.toLowerCase().includes(keyword.toLowerCase()) ||
          product.author.toLowerCase().includes(keyword.toLowerCase()) ||
          product.publisher.toLowerCase().includes(keyword.toLowerCase())
        );

        return filteredProducts.map((product: ProductApiItem, index: number) =>
          mapProductApiToBookItem(product, index)
        );
      }

      return [];
    }
  } catch (error) {
    console.error('상품 검색 API 호출 중 오류 발생:', error);
    return [];
  }
};
