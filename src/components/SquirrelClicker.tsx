import React from 'react';
import styled from 'styled-components';

const SquirrelContainer = styled.div`
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 350px;   // было 220px, стало больше
  height: 350px;  // было 220px, стало больше
  margin: 32px auto 0 auto;
  &:active {
    transform: scale(0.93);
  }
`;

const SquirrelImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

interface SquirrelClickerProps {
  onClick: () => void;
}

const SquirrelClicker: React.FC<SquirrelClickerProps> = ({ onClick }) => (
  <SquirrelContainer onClick={onClick}>
    <SquirrelImg src="/squirrel.png" alt="Белка" />
  </SquirrelContainer>
);

export default SquirrelClicker; 