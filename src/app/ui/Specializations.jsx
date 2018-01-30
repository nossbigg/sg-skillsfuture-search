import React from 'react';
import { Grid, Jumbotron } from 'react-bootstrap';

import SpecializationTile from './SpecializationTile';

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
  color: '#868686',
  fontFamily: 'Comfortaa, cursive',
};

const Specializations = ({ specializations }) => {
  if (!specializations || specializations.length === 0) {
    return <div />;
  }

  return (
    <Jumbotron style={jumbotronStyle}>
      <h2 style={h2Style}>Matches</h2>
      <h3 style={h3Style}>Sorted by % covered by SkillsFuture</h3>
      <Grid style={{ padding: 0 }}>
        {
          specializations.map(specialization =>
            <SpecializationTile key={specialization.id} specialization={specialization} />)
        }
      </Grid>
    </Jumbotron>
  );
};

export default Specializations;
