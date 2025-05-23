import React, { useState } from 'react';
import styled from 'styled-components';
import HelpModal from './HelpModal';

const Bar = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px 0 32px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
`;

const Logo = styled.img`
  height: 40px;
`;

const HelpButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 32px;
  color: #333;
  transition: color 0.2s;
  &:hover {
    color: #ff9800;
  }
`;

const TopBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Bar>
      <Logo src="/logo.png" alt="Логотип" />
      <HelpButton onClick={() => setOpen(true)}>?</HelpButton>
      <HelpModal open={open} onClose={() => setOpen(false)} />
    </Bar>
  );
};

export default TopBar;