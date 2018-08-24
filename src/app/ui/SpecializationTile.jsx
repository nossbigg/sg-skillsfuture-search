import React from 'react';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

const colStyle = {
  padding: '10px',
  height: '100px',
  overflow: 'hidden',
};

const Tile = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SpecializationName = styled.div`
  font-size: 16px;
`;

const SpecializationPartner = styled.div`
  font-size: 12px;
  color: #868686;
`;

const printPartnerNames = (partners) => {
  const partnersLine = partners.reduce(
    (out, partner) => `${out + partner.name}, `,
    '',
  );
  return partnersLine.slice(0, -2);
};

// eslint-disable-next-line react/prop-types
const SpecializationProportionCoveredBySkillsfuture = ({ percentage }) => {
  let percentageToPrint = `${percentage * 100}`;
  // eslint-disable-next-line prefer-destructuring
  percentageToPrint = percentageToPrint.split('.')[0];

  const divStyle = {
    fontSize: '20px',
    height: '100%',
    float: 'right',
    marginLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  return <div style={divStyle}>{percentageToPrint}%</div>;
};

const onTileClick = (specialization, setSpecializationModal) => {
  ReactGA.event({
    category: 'User',
    action: 'Open Specialization Modal',
    label: specialization.slug,
  });
  setSpecializationModal(specialization);
};

const SpecializationTile = ({ specialization, setSpecializationModal }) => (
  <Col xs={12} sm={6} style={colStyle}>
    <Tile onClick={() => onTileClick(specialization, setSpecializationModal)}>
      <SpecializationProportionCoveredBySkillsfuture
        percentage={specialization.percentageCoveredBySkillsfuture}
        courses={specialization.courses}
      />
      <SpecializationName>{specialization.name}</SpecializationName>
      <SpecializationPartner>
        {printPartnerNames(specialization.partnerIds)}
      </SpecializationPartner>
    </Tile>
  </Col>
);

SpecializationTile.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  specialization: PropTypes.object,
  setSpecializationModal: PropTypes.func,
};

SpecializationTile.defaultProps = {
  specialization: {},
  setSpecializationModal: () => {},
};

export default SpecializationTile;
