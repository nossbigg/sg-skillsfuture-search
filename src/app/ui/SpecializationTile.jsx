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
  padding-right: 10%;
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

const SpecializationTile = ({ specialization }) => (
  <Col xs={12} sm={6} md={4} style={colStyle}>
    <Tile>
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
