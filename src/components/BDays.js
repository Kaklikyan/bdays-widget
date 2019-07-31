import React, {PureComponent} from 'react';
import styled from 'styled-components';
import moment from 'moment';

// utils
import {
  getPrevData,
  getCurrentData,
  getNextData,
  determineIsDesktop
} from '../utils/functions';

import {
  textColorRed,
  textColorDarkGrey,
  textColorPaleGrey,
  noBdaysFoundMsg,
  siteUrl
} from '../utils/constants';

// components
import {HeadPanel} from './HeadPanel';

export default class BDays extends PureComponent {
  state = {
    bdays: [],
    slicedBdays: [],
    activeTab: 'current',
    isLoading: true,
    currentElementsCount: 0
  }

  slicingCount = determineIsDesktop() ? 6 : 3;

  componentDidMount = async () => {
    const bdays = await getCurrentData(this.state.currentLastElementKey);
    this.sliceBdays(bdays);
  }

  sliceBdays = async bdays => {
    const {currentElementsCount} = this.state;
    const slidingFinish = currentElementsCount + this.slicingCount;
    const slicedBdays = bdays.slice(currentElementsCount, slidingFinish);

    return this.setState({
      isLoading: false,
      bdays,
      slicedBdays,
      currentElementsCount: slicedBdays.length
    });
  }

  handleTabChange = tab => () =>  {
    if (this.state.activeTab === tab) return;
    this.setState({
      activeTab: tab,
      isLoading: true,
      currentElementsCount: 0
    }, async () => {
      let bdays = [];
      switch (tab) {
        case 'prev':
          bdays = await getPrevData();
          break;
        case 'current': 
          bdays = await getCurrentData();
          break;
        case 'next': 
          bdays = await getNextData();
          break;
        default:
          return;
      }
      this.sliceBdays(bdays);
    });
  }

  handleShowMoreButton = () => {
    const { 
      bdays,
      slicedBdays,
      currentElementsCount
    } = this.state;

    const slidingFinish = currentElementsCount + this.slicingCount;
    const sliced = bdays.slice(currentElementsCount, slidingFinish);
    const slicedBdaysNew = slicedBdays.concat(sliced);
    this.setState({
      slicedBdays: slicedBdaysNew,
      currentElementsCount: slicedBdaysNew.length
    });
  }

  get showContent () {
    const {slicedBdays} = this.state
    const isDesktop = determineIsDesktop();
    let row = [];
    let content = [];

    for (let i in slicedBdays) {
      const bday = slicedBdays[i];
      const bdayCard = (
        <BdayCard key={`bday_${i}`}>
          <Avatar src={siteUrl + bday.avatarUrl} />
          <BdayInfo>
            <InfoNameWrapper>
              <InfoName>{bday.name}</InfoName>
              <InfoDescription>{bday.jobTitle}</InfoDescription>
            </InfoNameWrapper>
            <InfoDate>{moment(bday.birthday).format("DD MMMM")}</InfoDate>
          </BdayInfo>
        </BdayCard>
      );

      if (isDesktop) {
        row.length < 2 && row.push(bdayCard);
  
        if (row.length === 2 || (row.length < 2 && !slicedBdays[+i + 1])) {
          const filledRow = (
            <BdayRow key={`row_${i}`}>
              {row.map(item => item)}
            </BdayRow>
          );
          content.push(filledRow)
          row = [];
        }
      } else {
        const filledRow = (
          <BdayRow key={`row_${i}`}>
            {bdayCard}
          </BdayRow>
        );
        content.push(filledRow)
      }
    }
    return content;
  }

  render() {
    const {
      bdays,
      slicedBdays,
      activeTab,
      isLoading
    } = this.state;

    return (
      <>
        <HeadPanel />
        <Self>
          <Title>День рождения</Title>
          <TabsWrapper>
            <Tab onClick={this.handleTabChange('prev')} isActive={activeTab === 'prev'}>
              НЕДАВНИЕ
              <TabSubText>
                даты
              </TabSubText>
            </Tab>
            <Tab onClick={this.handleTabChange('current')} isActive={activeTab === 'current'}>
              Сегодня
            </Tab>
            <Tab onClick={this.handleTabChange('next')} isActive={activeTab === 'next'}>
              БЛИЖАЙШИЕ
              <TabSubText>
                даты
              </TabSubText>
            </Tab>
          </TabsWrapper>
          {isLoading ? <LoadingText>Loading...</LoadingText> : (
            <>
              <MainContent>
                  {!!bdays.length ? this.showContent : <NoBdays>{noBdaysFoundMsg}</NoBdays>}
              </MainContent>
              {bdays.length !== slicedBdays.length && (
                <ButtonWrapper>
                  <ShowMoreButton onClick={this.handleShowMoreButton}>
                    показать еще <span className='arrow'></span>
                  </ShowMoreButton>
                </ButtonWrapper>
              )}
            </>
          )}
        </Self>
      </>
    )
  }
}

const Self = styled.div`
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px 0;
`;

const Title = styled.h1`
  font-family: 'VodafoneBold';
  color: ${textColorRed};
  margin-top: 0;
  text-align: center;
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  -ms-flex-pack: distribute;
  max-width: 1000px;
  margin: 0 auto 50px;
`;

const Tab = styled.div`
  font-size: 20px;
  font-family: ${({isActive}) => isActive ? 'VodafoneBold' : 'Vodafone'};
  color: ${textColorRed};
  cursor: pointer;
`;

const TabSubText = styled.div`
  text-align: center;
  font-size: 16px;
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BdayRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const BdayCard = styled.div`
  display: flex;
  flex: 1;
  @media (max-width: 420px) {
    justify-content: center;
    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      -ms-flex: none;
      width: 350px;
    }
  }
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const BdayInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 30px;
  @media (max-width: 420px) {
    width: 200px;
  }
`;

const InfoName = styled.div`
  font-family: 'Vodafone';
  color: ${textColorDarkGrey};
`;

const InfoDescription = styled.div`
  font-family: 'VodafoneLight';
  font-style: italic;
  color: ${textColorPaleGrey};
  margin-top: 6px;
`;

const InfoNameWrapper = styled.div`

`;

const InfoDate = styled.div`
  font-family: 'Vodafone';
  font-weight: 600;
  color: ${textColorDarkGrey};
`;

const NoBdays = styled.div`
  margin-top: 50px;
  text-align: center;
  font-family: 'VodafoneLight';
`; 

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const ShowMoreButton = styled.div`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  font-family: 'VodafoneLight';
  font-size: 18px;
  color: ${textColorDarkGrey}
  & > .arrow {
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid #333;
    align-self: f;
    margin-top: 6px;
    margin-left: 5px;
  }
`;

const LoadingText = styled.div`
  text-align: center;
`;
