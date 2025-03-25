// ErrorModal.js
import * as S from "./ErroModal.styled";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal = ({ message, onClose }: ErrorModalProps) => {
  return (
    <S.ModalBackdrop>
      <S.ModalContainer>
        <S.ModalMessage>{message}</S.ModalMessage>
        <S.ModalButton onClick={onClose}>확인</S.ModalButton>
      </S.ModalContainer>
    </S.ModalBackdrop>
  );
};

export default ErrorModal;
