import React from 'react';
import SpecializationTile from './SpecializationTile';

const Specializations = ({ specializations }) => {
  if (!specializations || specializations.length === 0) {
    return <div />;
  }

  return (
    <div>
      {
      specializations.map(specialization =>
        <SpecializationTile key={specialization.id} specialization={specialization} />)
      }
    </div>
  );
};

export default Specializations;
