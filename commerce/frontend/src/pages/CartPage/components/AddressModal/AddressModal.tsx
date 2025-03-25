import { useEffect } from "react";

import * as S from "./AddressModal.styled";
// import './modal.css';

interface AddressModalProps {
    onClose: () => void;
    isModalOpen: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({ onClose, isModalOpen }) => {

    // 모달이 열린 경우 스크롤 방지
    useEffect(() => {
        if (isModalOpen) { // 모달이 열리면 html에 생긴 스크롤을 막음
          document.documentElement.style.overflow = 'hidden';
        } else { // 모달이 닫히면 스크롤 활성화
          document.documentElement.style.overflow = '';
        }
      
        return () => { // 컴포넌트가 언마운트될 때 스크롤 활성화
          document.documentElement.style.overflow = '';
        };
      }, [isModalOpen]);

    return (
        <S.ModalOverlay>
            <S.AddressModal>
                <S.ModalHeader>
                    <div>배송지 변경</div>
                    <div onClick={onClose}>
                        <S.closeButton />
                    </div>
                </S.ModalHeader>

                <form action="">
                    <S.RecipientInfo>
                        <div>수령인</div>
                        <input type="text" name="recipient-name" value="" placeholder="이름을 입력해주세요." />
                        <input type="text" name="recipient-phone" value="" placeholder="전화번호를 입력해주세요." />
                    </S.RecipientInfo>
                    <S.AddressInfo>
                        <div>주소</div>
                        <input type="text" name="recipient-address" value="" placeholder="주소를 입력해주세요." />
                    </S.AddressInfo>
                    <S.SaveButton type="submit">저장</S.SaveButton>
                </form>
            </S.AddressModal>
        </S.ModalOverlay>
    )
}

export default AddressModal;