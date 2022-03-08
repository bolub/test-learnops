import React from 'react';
import classnames from 'classnames';
import { ProcessStage, Project } from 'utils/customTypes';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { Typography } from '@getsynapse/design-system';
import StageCard from './StageCard';

type StageProps = ProcessStage & {
  isBoardEmpty?: boolean;
};

const Stage: React.FC<StageProps> = ({
  color,
  name,
  isBoardEmpty,
  cards,
  colorOnDrag,
  borderColorOnDrag,
  id,
}) => {
  return (
    <Droppable droppableId={id}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div
          className={classnames('flex flex-col flex-shrink-0 w-68 h-full', {
            [`border border-dashed rounded-t-lg ${borderColorOnDrag}`]:
              snapshot.isDraggingOver,
          })}
          data-cy={`stage-${id}`}
        >
          <div className={`py-1 px-3 rounded-t-lg ${color}`}>
            <Typography variant='body' className='font-semibold'>
              {name}
            </Typography>
          </div>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={classnames(
              'flex flex-col h-full p-2 pt-0 border overflow-y-auto',
              {
                'bg-neutral-white border-neutral-lighter opacity-30':
                  isBoardEmpty && !snapshot.isDraggingOver,
              },
              {
                'bg-neutral-lightest_2 border-neutral-lighter_2':
                  !isBoardEmpty && !snapshot.isDraggingOver,
              },
              {
                [`border-none ${colorOnDrag}`]: snapshot.isDraggingOver,
              }
            )}
          >
            {cards.map((project: Project, index: Number) => (
              <StageCard project={project} index={index} key={project.id} />
            ))}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Stage;
