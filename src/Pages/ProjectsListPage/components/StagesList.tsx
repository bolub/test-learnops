import React, { ReactNode } from 'react';
import { ProcessStage } from 'utils/customTypes';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { moveProjectToAnotherStage } from 'state/Projects/projectsSlice';

import { useDispatch } from 'react-redux';

import Stage from './Stage';

const StagesList: React.FC<{
  stages: ProcessStage[];
  emptyComponent?: ReactNode;
}> = ({ stages, emptyComponent }) => {
  const noResultsFound = stages.every(
    (stage: ProcessStage) => stage.cards.length === 0
  );
  const dispatch = useDispatch();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (
      destination?.droppableId &&
      destination.droppableId !== source.droppableId
    ) {
      dispatch(
        moveProjectToAnotherStage({
          projectId: draggableId,
          newStageId: destination.droppableId,
        })
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        data-cy='stages-list'
        className='flex flex-grow h-stage overflow-x-auto space-x-4 mt-8'
      >
        {noResultsFound && emptyComponent}
        {stages.map((stage: ProcessStage) => (
          <Stage
            key={stage.id}
            id={stage.id}
            name={stage.name}
            color={stage.color}
            colorOnDrag={stage.colorOnDrag}
            borderColorOnDrag={stage.borderColorOnDrag}
            cards={stage.cards}
            isBoardEmpty={noResultsFound}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default StagesList;
