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
    justify-content: flex-end;
    padding: 20px 0px 15px 0;
    margin-bottom: 30px;
`;

export const PageTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    font-size: 26px;
    font-weight: 700;
    color: #000;
`;


// 1-1. 주문 상품 섹션
const SectionStyle = styled.section`
    width: 65%;
    margin: 0 auto;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    margin-bottom: 30px;
`;

export const OrderSection = styled(SectionStyle)``;

// 주문 상품 헤더
export const OrderInfo = styled.div`
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

export const PaymentInfo = styled(OrderInfo)`
    margin-top: 20px;
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

export const Button = styled.div`
    margin: 0 auto;
    width: 200px;
    height: 50px;
`;