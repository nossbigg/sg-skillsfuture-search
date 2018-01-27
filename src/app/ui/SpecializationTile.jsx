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
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
  
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

const printPartnerNames = (partnerIds) => {
  const partners = partnerIds.reduce((out, partner) => `${out + partner.name}, `, '');
  return partners.slice(0, -2);
};

const SpecializationProportionCoveredBySkillsfuture = ({ percentage, courses }) => {
  let percentageToPrint = `${percentage * 100}`;
  // eslint-disable-next-line prefer-destructuring
  percentageToPrint = percentageToPrint.split('.')[0];

  const CourseProportionField = styled.div`
    font-size: 10px;
    color: black;
  `;

  const totalCourses = courses.length;
  const totalCoursesCoveredBySkillsfuture = courses.filter(course => course.skillsfuture).length;

  const divStyle = {
    fontSize: '20px',
    height: '60px',
    float: 'right',
    marginLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };
  return (
    <div style={divStyle}>
      <div>
        {percentageToPrint}%
      </div>
      <CourseProportionField>
        {totalCoursesCoveredBySkillsfuture} / {totalCourses}
      </CourseProportionField>
    </div>
  );
};

const openCourseraSpecializationLink = slug =>
  window.open(`https://www.coursera.org/specializations/${slug}`);

const SpecializationTile = ({ specialization }) => (
  <Col xs={12} sm={6} style={colStyle}>
    <Tile onClick={() => openCourseraSpecializationLink(specialization.slug)}>
      <SpecializationProportionCoveredBySkillsfuture
        percentage={specialization.percentageCoveredBySkillsfuture}
        courses={specialization.courses}
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
