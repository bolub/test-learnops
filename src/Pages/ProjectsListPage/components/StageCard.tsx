import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { Project, ProjectOwner } from 'utils/customTypes';
import { selectUserId } from 'state/User/userSlice';
import StageCardDetail from './StageCardDetail';

const StageCard: React.FC<{ project: Project; index: any }> = ({
  project,
  index,
}) => {
  const currentUserId = useSelector(selectUserId);
  const isUserOwner = useMemo(() => {
    const foundUser = project.owners.find(
      (owner: ProjectOwner) => owner.project_owners.userId === currentUserId
    );
    return foundUser ? true : false;
  }, [project, currentUserId]);

  return isUserOwner ? (
    <Draggable key={project.id} draggableId={project.id} index={index}>
      {(providedDraggable: DraggableProvided) => (
        <StageCardDetail
          ref={providedDraggable.innerRef}
          project={project}
          draggableProps={providedDraggable.draggableProps}
          dragHandleProps={providedDraggable.dragHandleProps}
        />
      )}
    </Draggable>
  ) : (
    <StageCardDetail project={project} />
  );
};

export default React.memo(StageCard);
