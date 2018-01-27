import React from 'react';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';

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
  background-color: #eee;
  border-radius: 5px;
`;

const SpecializationName = styled.div`
  font-size: 16px;
  // padding-right: 20%;
`;

const SpecializationPartner = styled.div`
  font-size: 12px;
  text-overflow: ellipsis;
  color: #444;
`;

const printPartnerNames = (partnerIds) => {
  const partners = partnerIds.reduce((out, partner) => `${out + partner.name}, `, '');
  return partners.slice(0, -2);
};

const SpecializationPercentageCoveredBySkillsfuture = ({ percentage }) => {
  let percentageToPrint = `${percentage * 100}`;
  // eslint-disable-next-line prefer-destructuring
  percentageToPrint = percentageToPrint.split('.')[0];

  const divStyle = {
    height: '60px',
    float: 'right',
    marginLeft: '10px',
    fontSize: '30px',
    display: 'flex',
    alignItems: 'center',
  };
  return (
    <div style={divStyle}>
      {percentageToPrint}%
    </div>
  );
};

const SpecializationTile = ({ specialization }) => (
  <Col xs={12} sm={6} md={4} style={colStyle}>
    <Tile>
      <SpecializationPercentageCoveredBySkillsfuture
        percentage={specialization.percentageCoveredBySkillsfuture}
      />
      <SpecializationName>
        {specialization.name}
      </SpecializationName>
      <SpecializationPartner>
        {printPartnerNames(specialization.partnerIds)}
      </SpecializationPartner>
    </Tile>
  </Col>
);

export default SpecializationTile;
