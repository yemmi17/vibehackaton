import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: linear-gradient(90deg, #ff9800 0%, #ffb74d 100%);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  border: none;
  border-radius: 32px;
  padding: 16px 48px;
  margin: 32px auto 0 auto;
  display: block;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255,152,0,0.15);
  transition: background 0.2s, transform 0.1s;
  &:active {
    transform: scale(0.97);
  }
`;

const SpeedUpButton: React.FC = () => (
  <Button>Speed Up!</Button>
);

export default SpeedUpButton;