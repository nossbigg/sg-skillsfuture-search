import React from 'react';
import styled from 'styled-components';
import { Grid, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

const PaperStyle = `
  margin: 10px;
  padding: 10px;
  word-wrap: break-word;
`;

const Paper = styled.div`
  ${PaperStyle}
`;

const CourseTile = styled.div`
  ${PaperStyle}
  display: flex;
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
  margin: 5px 0 15px 0;
`;

const SpecializationName = styled.h1`
  margin-top: 0px;
  font-size: 30px;
`;

const Partners = styled.h2`
  font-size: 16px;
  margin: 0;
  color: #868686;
`;

const Button = styled.div`
  padding: 5px 10px;
  margin: 10px 10px 0 0;
  display: inline-block;
  border: 1px solid #4e4e4e;
  border-radius: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  text-align: center;
  color: #4e4e4e;
  cursor: pointer;

  &:hover{
    border: 1px solid black;
    color: black;
  }
`;

const openCourseraSpecializationLink = async (specializationSlug) => {
  ReactGA.event({
    category: 'Outbound Link',
    action: 'Coursera: Specialization',
    label: specializationSlug,
    transport: 'beacon',
  });
  window.open(`https://www.coursera.org/specializations/${specializationSlug}`);
};

const openCourseraCourseLink = async (courseSlug) => {
  ReactGA.event({
    category: 'Outbound Link',
    action: 'Coursera: Course',
    label: courseSlug,
    transport: 'beacon',
  });
  window.open(`https://www.coursera.org/learn/${courseSlug}`);
};

const openSkillsfutureCourseLink = async (courseReferenceNumber, courseSlug) => {
  ReactGA.event({
    category: 'Outbound Link',
    action: 'Skillsfuture: Course',
    label: `${courseReferenceNumber} (${courseSlug})`,
    transport: 'beacon',
  });
  window.open(`https://www.myskillsfuture.sg/content/portal/en/training-exchange/
  course-directory/course-detail.html?courseReferenceNumber=${courseReferenceNumber}`);
};

const renderPercentageAndCourseCoverageProportion = (specialization) => {
  const PercentageCoverage = styled.div`
    font-family: Comfortaa, cursive;
    font-size: 60px;
    letter-spacing: 5px;
    margin-bottom: -10px;
  `;
  let percentageCoverage = `${specialization.percentageCoveredBySkillsfuture * 100}`;
  // eslint-disable-next-line prefer-destructuring
  percentageCoverage = percentageCoverage.split('.')[0];

  const CoursesCovered = styled.div`
    margin-top: 5px;
    color: #868686;
  `;
  const totalCourses = specialization.courses.length;
  const totalCoursesCoveredBySkillsfuture =
    specialization.courses.filter(course => course.skillsfuture).length;

  return (
    <Paper>
      <PercentageCoverage>
        {percentageCoverage}%
      </PercentageCoverage>
  percent covered by SkillsFuture
      <CoursesCovered>
        {totalCoursesCoveredBySkillsfuture} out of {totalCourses} courses covered
      </CoursesCovered>
    </Paper>
  );
};

const renderTitlePanel = (specialization) => {
  const printPartnerNames = (partners) => {
    const partnersLine = partners.reduce((out, partner) => `${out + partner.name}, `, '');
    return partnersLine.slice(0, -2);
  };

  return (
    <Col xs={12} md={5} style={{ padding: 0, flexDirection: 'column' }}>
      <Paper>
        <SpecializationName>
          {specialization.name}
        </SpecializationName>
        <Partners>
          {printPartnerNames(specialization.partnerIds)}
        </Partners>
        <Button
          className="courseraSpecializationButton"
          onClick={() => openCourseraSpecializationLink(specialization.slug)}
        >
          COURSERA SITE
        </Button>
      </Paper>
      {renderPercentageAndCourseCoverageProportion(specialization)}
    </Col>
  );
};

const renderCourseTile = (course, courseNumber) => {
  const CourseNumber = styled.div`
    font-size: 30px;
    color: #868686;
  `;

  const CourseContent = styled.div`
    font-size: 16px;
    width: 100%;
    padding: 5px 10px;
  `;

  const renderCoveredBySkillsfutureStatus = () => {
    const color = course.skillsfuture ? 'green' : 'red';

    return (
      <div style={{ color, fontSize: '14px', marginTop: '5px' }}>
        {
          course.skillsfuture
            ? '✔ Covered by SkillsFuture'
            : '✘ Not covered by SkillsFuture'
        }
      </div>
    );
  };

  const renderCourseraButton = () => (
    <Button onClick={() => openCourseraCourseLink(course.coursera.slug)}>
      COURSERA SITE
    </Button>
  );

  const renderSkillsfutureButton = () => (
    <Button onClick={() =>
      openSkillsfutureCourseLink(course.skillsfuture.courseReferenceNumber, course.coursera.slug)}
    >
      SKILLSFUTURE SITE
    </Button>
  );

  return (
    <CourseTile key={courseNumber}>
      <CourseNumber>
        {`#${courseNumber}`}
      </CourseNumber>
      <CourseContent>
        {`${course.coursera.name}`}
        {renderCoveredBySkillsfutureStatus()}
        <div>
          {renderCourseraButton()}
          {course.skillsfuture
            ? renderSkillsfutureButton()
            : null}
        </div>
      </CourseContent>
    </CourseTile>
  );
};

const renderCoursesPanel = (specialization) => {
  const renderCourses = (courses) => {
    const renderedCourses = [];

    for (let index = 0; index < courses.length; index += 1) {
      renderedCourses.push(renderCourseTile(courses[index], index + 1));
    }

    return renderedCourses;
  };

  return (
    <Col xs={12} md={7} style={{ padding: 0, flexDirection: 'column' }}>
      <Paper>
        <h3 style={{ marginTop: '0' }}>Courses</h3>
        {renderCourses(specialization.courses)}
      </Paper>
    </Col>
  );
};

const renderCloseButton = (closeModal) => {
  const CloseButtonContainer = styled.div`
  padding: 20px;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

  const CloseButtonStyle = {
    fontSize: '30px',
  };

  return (
    <CloseButtonContainer className="closeButtonContainer" onClick={() => closeModal()}>
      <i style={CloseButtonStyle} className="material-icons">clear</i>
    </CloseButtonContainer>
  );
};

const SpecializationModal = ({ specialization, closeModal }) => {
  const ShadowBackground = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  `;

  const Content = styled.div`
    position: absolute;
    margin: 5% 15%;
    width: 70%;
    max-height: 90%;
    overflow-y: auto;
    
    // Small devices (landscape phones, less than 768px)
    @media (max-width: 575px) { 
      margin: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      
      border-radius: 0;
    }
    
    padding: 15px;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
  `;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ShadowBackground onClick={() => closeModal()} />
      <Content>
        <Grid style={{ width: '100%', padding: 0 }}>
          {renderTitlePanel(specialization)}
          {renderCoursesPanel(specialization)}
        </Grid>
        {renderCloseButton(closeModal)}
      </Content>
    </div>
  );
};

SpecializationModal.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  specialization: PropTypes.object,
  closeModal: PropTypes.func,
};

SpecializationModal.defaultProps = {
  specialization: {},
  closeModal: () => {},
};

export default SpecializationModal;
