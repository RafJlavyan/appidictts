import React from "react";
import styled from "styled-components";
import { Spacing } from "@/styles/proportions";

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MyModal: React.FC<MyModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalWrapper>
  );
};

export default MyModal;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  width: 50%;
  background-color: white;
  border-radius: 8px;
  padding: ${Spacing.small.padding};
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: ${Spacing.small.margin};
  }
  p {
    width: 70%;
    margin: ${Spacing.medium.margin} auto;
  }
`;
