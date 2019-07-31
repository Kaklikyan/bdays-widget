import React from 'react';
import styled from 'styled-components';

// assets
import giftSrc from '../assets/images/gift.png';

export const HeadPanel = () => {
  return (
    <Self>
      <ImgWrapper>
        <GiftImg src={giftSrc} /> 
      </ImgWrapper>
    </Self>
  )
}

const Self = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

const ImgWrapper = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 4px solid #d90022;
`;

const GiftImg = styled.img`
  width: 100px;
  height: 100px;
  margin: 0 auto;
`;
