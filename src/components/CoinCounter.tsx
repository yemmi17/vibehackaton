import React from 'react';
import styled from 'styled-components';

const CounterContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CoinIcon = styled.span`
  font-size: 24px;
`;

const CoinCount = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #f1c40f;
`;

interface CoinCounterProps {
  coins: number;
}

export const CoinCounter: React.FC<CoinCounterProps> = ({ coins }) => {
  return (
    <CounterContainer>
      <CoinIcon>
        <img src="/acorn.png" alt="Жёлудь" style={{ width: 24, height: 24 }} />
      </CoinIcon>
      <CoinCount>{coins}</CoinCount>
    </CounterContainer>
  );
};