import React from 'react';
import classnames from 'classnames';
import lowPriority from 'assets/icons/low-priority.svg';
import mediumPriority from 'assets/icons/medium-priority.svg';
import highPriority from 'assets/icons/high-priority.svg';
import canlendar from 'assets/icons/canlendar.svg';
import { Link } from 'react-router-dom';
import {
  getHealthColumn,
  getStatusColumn,
  getOwnerColumn,
  getValueById,
} from '../helpers/tableColumnsValues';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Project } from 'utils/customTypes';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { selectBussinessTeams } from 'state/Organization/organizationSlice';
import { useSelector } from 'react-redux';
import { DATE, PATHS, PROJECT_PRIORITY } from 'utils/constants';
import { Icon, useElevation, Typography } from '@getsynapse/design-system';

const StageCard: React.FC<{ project: Project; index: any }> = ({
  project,
  index,
}) => {
  const skim = useElevation(1);
  const bussinessTeams = useSelector(selectBussinessTeams);

  const getPriorityIcon = () => {
    switch (project.priority) {
      case PROJECT_PRIORITY.LOW:
        return lowPriority;
      case PROJECT_PRIORITY.MEDIUM:
        return mediumPriority;
      case PROJECT_PRIORITY.HIGH:
        return highPriority;
      default:
        return '';
    }
  };

  const PriorityLabel = () => {
    return (
      <div className='flex items-center'>
        <Icon src={getPriorityIcon()} className={classnames('h-5', 'w-5')} />
        <Typography variant='caption'>
          {intl.get(
            `PROJECT_DETAIL.PRIORITY_OPTIONS.${project.priority.toUpperCase()}`
          )}
        </Typography>
      </div>
    );
  };

  return (
    <Draggable key={project.id} draggableId={project.id} index={index}>
      {(providedDraggable: DraggableProvided) => (
        <Link
          key={project.id}
          to={`${PATHS.PROJECT_PAGE}/${project.id}`}
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
          className={classnames(
            'max-w-card min-h-card flex flex-col bg-neutral-white rounded-sm p-3 justify-between mt-2 cursor-pointer',
            skim
          )}
          data-cy='stage-card'
        >
          <div className='flex'>
            <PriorityLabel />
            <div className='ml-auto'>
              {getHealthColumn(project.health, 'text-xs', 'mr-2')}
            </div>
          </div>
          <div
            className='w-full h-8 text-sm leading-4 line-clamp-2'
            data-cy='stage-card-title'
            data-value={project.title}
          >
            {project.title}
          </div>
          <div className='flex'>
            <div className='text-xs w-1/2 truncate'>
              {getValueById(bussinessTeams, 'title', project.businessUnitId)}
            </div>
            <div className='ml-auto flex items-center text-xs'>
              <Icon src={canlendar} className='h-3 w-3' />
              <span
                className='ml-2'
                data-cy='stage-card-date'
                data-value={project.targetCompletionDate}
              >
                {moment(new Date(project.targetCompletionDate)).format(
                  DATE.MONTH_DATE_YEAR_FORMAT
                )}
              </span>
            </div>
          </div>
          <div className='flex'>
            <div className='w-1/2'>{getStatusColumn(project.status)}</div>
            <div className='ml-auto'>
              {getOwnerColumn(project.owners, 'small', true)}
            </div>
          </div>
        </Link>
      )}
    </Draggable>
  );
};

export default StageCard;
