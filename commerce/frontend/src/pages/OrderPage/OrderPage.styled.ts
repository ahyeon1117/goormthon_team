import styled from 'styled-components';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

// 주문 페이지 컨테이너
export const OrderPageContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    margin-bottom: 100px;
`;

// 주문페이지 헤더
export const OrderPageHeader = styled.header`
    display: flex;
    justify-content: space-between;
    // padding: 30px 0;
    padding: 20px 0px 15px 0;

    > div:first-child {
        font-size: 26px;
        font-weight: 700;
        color: #000;
    }
`;

// 주문 메인
export const OrderMain = styled.main`
    display: flex;
    gap: 30px;
`;

// 1. 주문 정보 섹션
export const OrderSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 30px;
    flex: 1;
    
    // 노트북 크기 이상에서만 넓이 고정
    @media screen and (min-width: 1500px) {
        flex: none;
        width: 870px; // 1200(컨테이너) - 30(갭) - 300(사이드바)
    }
`;

// 1-1. 주문 상품 섹션
const SectionStyle = styled.section`
    display: flex;
    flex-direction: column;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
`;

export const ItemSection = styled(SectionStyle)``;

// 주문 상품 헤더
export const ItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;

    span {
        font-size: 18px;
        font-weight: 700;
        color: #000;
    }

    span:first-child {
        margin-right: 8px;
    }

    span:nth-child(2) {
        color: #E896FF;
    }
`;

// 섹션 펼치기 아이콘
export const ArrowUpIcon = styled(IoIosArrowUp)`
    width: 24px;
    height: 24px;
    color: #707070;
    cursor: pointer;
`;

// 섹션 접기 아이콘
export const ArrowDownIcon = styled(IoIosArrowDown)`
    width: 24px;
    height: 24px;
    color: #707070;
    cursor: pointer;
`;

// 1-2. 결제수단 섹션
export const PaymentMethodSection = styled(SectionStyle)``;

// 결제수단 헤더
export const PaymentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
    font-size: 18px;
    color: #000;

    > div:first-child {
        font-size: 18px;
        font-weight: 700;
        color: #000;
    }
`;

// 결제수단 목록
export const PaymentMethods = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PaymentMethod = styled.div<{ selected: boolean }>`
    padding: 25px;
    color: #5F5F5F;
    cursor: pointer;
    border: ${({ selected }) => selected ? '2.5px solid #E078CA' : '1px solid #E0E0E0'};
    
    /* 마지막 항목 */
    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    
    &:hover {
        background-color: #F9F9F9;
    }
`;

// 2. 주문 정보 사이드바
export const OrderSidebar = styled.aside`
    // transition: all 0.3s ease;
    width: 300px;

    // 사이드 바 고정 시
    &.fixed {
        margin-top: 20px;

        // 노트북 화면
        @media screen and (min-width: 1500px) {
            position: fixed;
            top: 70px;
            right: calc((100% - 1215px) / 2);
        }

        // 큰 모니터
        @media screen and (min-width: 1520px) {
            position: fixed;
            top: 70px;
            right: calc((100% - 1200px) / 2);
        }
    }
`;

// 주문 합계 섹션
export const OrderSummarySection = styled.section`
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    padding: 25px;

    > div:first-child {
        font-size: 18px;
        font-weight: 700;
        color: #000;
        border-bottom: 1px solid #D9D9D9;
        padding-bottom: 15px;
    }
`;

// 주문 합계 정보
export const OrderSummaryInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 18px 0;
    border-bottom: 1px solid #D9D9D9;
    font-size: 14px;
`;

export const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span:first-child {
        color: #5F5F5F;
    }

    > span:last-child {
        color: #000;
    }
`;

// 총 주문 금액
export const TotalPrice = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0;
    font-size: 14px;

    > span:first-child {
        color: #000;
        font-weight: 700;
        font-size: 15px;
    }

    > span:last-child {
        color: #E896FF;
        font-weight: 700;
        font-size: 18px;
    }
`;

// 주문 버튼
export const OrderButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 42px;
    background-color: #E896FF;
    color: #FFF;
    font-size: 16px;
    border-radius: 5px;
    border: none;

    &:hover {
        background-color: #D485E8;
    }

    &:focus {
        outline: none;
    }
`;