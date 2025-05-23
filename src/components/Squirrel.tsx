import React from 'react';
import styled from 'styled-components';

const SquirrelContainer = styled.div`
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: #8B4513;
  border-radius: 50%;
  margin: 20px;

  &:active {
    transform: scale(0.95);
  }
`;

const SquirrelText = styled.span`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

interface SquirrelProps {
  onClick: () => void;
}

export const Squirrel: React.FC<SquirrelProps> = ({ onClick }) => {
  return (
    <SquirrelContainer onClick={onClick}>
      <SquirrelText>🐿️</SquirrelText>
    </SquirrelContainer>
  );
};