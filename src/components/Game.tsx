import React from 'react';
import styled from 'styled-components';
import { CoinCounter } from './CoinCounter';
import { useGameState } from '../hooks/useGameState';
import SpeedUpButton from './SpeedUpButton';
import TopBar from './TopBar';
import SquirrelClicker from './SquirrelClicker';

const Bg = styled.div`
  min-height: 100vh;
  width: 100vw;
  /* background: linear-gradient(135deg, #e0f7fa 0%, #a5d6a7 100%); */
  background-image: url('/forest-bg.jpg'); /* или .png, если у вас PNG */
  background-size: cover;
  background-position: center;
  position: relative;
  overflow-x: hidden;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Game: React.FC = () => {
  const { gameState, handleClick } = useGameState();
  return (
    <Bg>
      <TopBar />
      <Center>
        <CoinCounter coins={gameState.coins} />
        <SquirrelClicker onClick={handleClick} />
        <SpeedUpButton />
      </Center>
    </Bg>
  );
};

export default Game;