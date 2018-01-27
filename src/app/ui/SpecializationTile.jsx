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
`;

const SpecializationName = styled.div`
  font-size: 18px;
  width: 80%;
`;

const SpecializationTile = ({ specialization }) => (
  <Col xs={12} sm={6} style={colStyle}>
    <Tile>
      <SpecializationName>
        {specialization.name}
      </SpecializationName>
    </Tile>
  </Col>
);

export default SpecializationTile;
