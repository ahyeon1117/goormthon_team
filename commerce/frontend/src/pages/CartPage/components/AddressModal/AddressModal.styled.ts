import styled, { css } from "styled-components";
import { IoCloseOutline } from "react-icons/io5";
// 모달 배경
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

// 모달 창
export const AddressModal = styled.div`
    position: relative;
    width: 400px;
    background-color: #FFF;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

// 모달 헤더
export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #D9D9D9;
    padding-bottom: 15px;

    > div {
        font-size: 18px;
        font-weight: 700;
        color: #000;
    }
`;

// 닫기 버튼
export const closeButton = styled(IoCloseOutline)`
    width: 30px;
    height: 30px;
    color: #D9D9D9;
    cursor: pointer;

    &:hover {
        color: #707070;
    }
`;

// 공통 input 스타일
const inputStyle = css`
    height: 40px;
    padding: 0 10px;
    border: 1px solid #D9D9D9;
    border-radius: 5px; 

    &:focus {
        outline: none;
    }
`;

// 수령인 정보
export const RecipientInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 30px 0;

    > div {
        font-size: 16px;
        font-weight: 700;
        color: #000;
    }

    input {
        ${inputStyle}
    }
`;

// 주소 정보
export const AddressInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 40px;

    > div {
        font-size: 16px;
        font-weight: 700;
        color: #000;
    }

    > input {
        ${inputStyle}
    }
`;

// 저장 버튼
export const SaveButton = styled.button`
    width: 100%;
    height: 45px;
    background-color: #E896FF;
    color: #FFF;
    border-radius: 5px;
    border: none;
    &:focus {
        outline: none;
    }
`;