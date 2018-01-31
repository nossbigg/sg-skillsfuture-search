import React from 'react';
import { Grid, Jumbotron } from 'react-bootstrap';
import styled from 'styled-components';

import SpecializationTile from './SpecializationTile';

const MINIMUM_SPECIALIZATIONS_TO_SHOW = 20;
const SEE_MORE_BUTTON_STEP = 20;

const jumbotronStyle = {
  padding: '35px 10%',
  backgroundColor: '#efefef',
  margin: '0',
};

const h2Style = {
  margin: '0 0 5px 0',
  fontFamily: 'Comfortaa, cursive',
};

const h3Style = {
  margin: '0 0 10px 0',
  fontSize: '14px',
  color: '#696969',
  fontFamily: 'Comfortaa, cursive',
};

const ShowMoreButtonContainer = styled.div`
  width: 100%;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShowButton = styled.div`
  width: 150px;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
  cursor: pointer;
  text-align: center;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const addOneToCountIfNotEvenAndDoesNotExceedMaxLength = (countToShow, maxLength) => {
  if (countToShow % 2 === 0) {
    return countToShow;
  }

  if (countToShow + 1 <= maxLength) {
    return countToShow + 1;
  }

  return countToShow;
};

class Specializations extends React.Component {
  constructor({ specializations, showAllSpecializations }) {
    super();
    this.specializations = specializations;
    this.showAllSpecializations = showAllSpecializations;

    this.state = {
      countToShow: Math.min(MINIMUM_SPECIALIZATIONS_TO_SHOW, this.specializations.length),
    };
  }

  componentWillReceiveProps({ specializations }) {
    this.specializations = specializations;

    if (!this.specializations) {
      return;
    }

    this.setState({
      countToShow: Math.min(MINIMUM_SPECIALIZATIONS_TO_SHOW, this.specializations.length),
    });
  }

  onShowMoreButtonClicked() {
    this.setState({
      countToShow:
        Math.min(this.state.countToShow + SEE_MORE_BUTTON_STEP, this.specializations.length),
    });
  }

  onShowAllButtonClicked() {
    this.setState({
      countToShow: this.specializations.length,
    });
  }

  selectSpecializationsToRender() {
    const specializationsToRender = [];

    const numberOfSpecializationsToRender =
      addOneToCountIfNotEvenAndDoesNotExceedMaxLength(
        this.state.countToShow,
        this.specializations.length,
      );

    for (let index = 0; index < numberOfSpecializationsToRender; index += 1) {
      specializationsToRender.push(this.specializations[index]);
    }

    return specializationsToRender;
  }

  renderShowMoreAndShowAllButton() {
    const hasShownAllSpecializations = this.state.countToShow === this.specializations.length;
    if (hasShownAllSpecializations) {
      return null;
    }

    return (
      <ShowMoreButtonContainer>
        <ShowButton onClick={() => this.onShowMoreButtonClicked()} className="showMoreButton">
          Show More
        </ShowButton>
        <ShowButton onClick={() => this.onShowAllButtonClicked()} className="showAllButton">
          Show All
        </ShowButton>
      </ShowMoreButtonContainer>
    );
  }

  render() {
    if (!this.specializations || this.specializations.length === 0) {
      return <div />;
    }

    return (
      <Jumbotron style={jumbotronStyle}>
        <h2 style={h2Style}>Matches</h2>
        <h3 style={h3Style}>Sorted by % covered by SkillsFuture</h3>
        <Grid style={{ padding: 0 }}>
          {
            this.selectSpecializationsToRender().map(specialization =>
              <SpecializationTile key={specialization.id} specialization={specialization} />)
          }
        </Grid>
        {this.renderShowMoreAndShowAllButton()}
      </Jumbotron>
    );
  }
}

export default Specializations;
