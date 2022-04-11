import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';
import moment from 'moment';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import { Icon, useElevation, Typography } from '@getsynapse/design-system';
import lowPriority from 'assets/icons/low-priority.svg';
import mediumPriority from 'assets/icons/medium-priority.svg';
import highPriority from 'assets/icons/high-priority.svg';
import canlendar from 'assets/icons/canlendar.svg';
import {
  getStatusColumn,
  getOwnerColumn,
  getValueById,
} from '../helpers/tableColumnsValues';
import HealthLabel from 'Molecules/HealthLabel';
import { Project } from 'utils/customTypes';
import { selectBussinessTeams } from 'state/Organization/organizationSlice';
import { DATE, PATHS, PROJECT_PRIORITY } from 'utils/constants';

type Ref = HTMLAnchorElement;

const PriorityLabel: React.FC<{ project: Project }> = ({ project }) => {
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
  return (
    <div className='flex items-center'>
      <Icon src={getPriorityIcon()} className={classnames('h-5', 'w-5')} />
      <Typography variant='caption'>
        {project.priority &&
          intl.get(
            `PROJECT_DETAIL.PRIORITY_OPTIONS.${project.priority.toUpperCase()}`
          )}
      </Typography>
    </div>
  );
};

const StageCardDetail = React.forwardRef<
  Ref,
  {
    project: Project;
    draggableProps?: DraggableProvidedDraggableProps;
    dragHandleProps?: DraggableProvidedDragHandleProps;
  }
>(({ project, draggableProps = {}, dragHandleProps = {} }, ref) => {
  const skim = useElevation(1);
  const bussinessTeams = useSelector(selectBussinessTeams);

  return (
    <Link
      key={project.id}
      to={`${PATHS.PROJECT_PAGE}/${project.id}`}
      ref={ref}
      {...dragHandleProps}
      {...draggableProps}
      className={classnames(
        'max-w-card min-h-card flex flex-col bg-neutral-white rounded-sm p-3 justify-between mt-2 cursor-pointer',
        skim
      )}
      data-cy='stage-card'
    >
      <div className='flex'>
        {project.priority && <PriorityLabel project={project} />}
        <div className='ml-auto'>
          <HealthLabel
            health={project.health}
            className='text-xs'
            indicatorClassName='mr-2'
          />
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
  );
});

export default StageCardDetail;
