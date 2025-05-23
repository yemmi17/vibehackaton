import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  text-align: center;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 24px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
`;

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => (
  <Overlay open={open}>
    <Modal>
      <CloseBtn onClick={onClose}>&times;</CloseBtn>
      <h2>Справка</h2>
      <p>Кликай по белке, чтобы собирать жёлуди!<br/>Чем больше кликов — тем больше жёлудей.</p>
      <p>В будущем появятся улучшения и бонусы!</p>
    </Modal>
  </Overlay>
);

export default HelpModal; 