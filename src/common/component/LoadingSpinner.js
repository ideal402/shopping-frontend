import React from "react";
import styled, { keyframes } from "styled-components";

const LoadingSpinner = () => {
  return (
    <SpinnerOverlay>
      <Spinner>
        <Bounce className="bounce1" />
        <Bounce className="bounce2" />
      </Spinner>
    </SpinnerOverlay>
  );
};

export default LoadingSpinner;

// 애니메이션 효과 정의
const bounce = keyframes`
  0%, 100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
`;

// 전체 화면을 덮는 오버레이
const SpinnerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

// 스피너 컨테이너
const Spinner = styled.div`
  width: 60px;
  height: 60px;
  position: relative;
`;

// 스피너 애니메이션 요소
const Bounce = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #121D40; /* 사용자가 원하는 색상 */
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${bounce} 2s infinite ease-in-out;

  &:nth-child(2) {
    animation-delay: -1s;
  }
`;
