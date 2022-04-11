import React from 'react';
import { Project } from 'utils/customTypes';
import StageCard from './StageCard';

const StageCardsList: React.FC<{ cards: Project[] }> = ({ cards }) => {
  return (
    <React.Fragment>
      {cards.map((project: Project, index: Number) => (
        <StageCard project={project} index={index} key={project.id} />
      ))}
    </React.Fragment>
  );
};

export default React.memo(StageCardsList);
