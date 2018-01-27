import React from 'react';
import { Grid, Jumbotron } from 'react-bootstrap';

import SpecializationTile from './SpecializationTile';

const jumbotronStyle = {
  padding: '25px 10% 25px 10%',
  backgroundColor: 'white',
};

const h2Style = {
  marginTop: 0,
};

const Specializations = ({ specializations }) => {
  if (!specializations || specializations.length === 0) {
    return <div />;
  }

  return (
    <Jumbotron style={jumbotronStyle}>
      <h2 style={h2Style}>Matches</h2>
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
