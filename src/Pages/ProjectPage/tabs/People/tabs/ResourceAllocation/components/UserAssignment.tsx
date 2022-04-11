import React from 'react';
import intl from 'react-intl-universal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Typography, useLink } from '@getsynapse/design-system';
import { ProjectStatus, TaskDetailType } from 'utils/customTypes';
import { getCurrentProjectId } from 'state/Project/projectSlice';

type AssignmentStyle = {
  bgColor: string;
  textColor: string;
  borderColor: string;
  leftBorderColor: string;
};

export const assigmentStyle: Record<ProjectStatus, AssignmentStyle> = {
  new: {
    bgColor: 'bg-success-lighter',
    textColor: 'text-success-dark',
    borderColor: 'border-success-dark',
    leftBorderColor: 'border-success-light',
  },
  in_progress: {
    bgColor: 'bg-teal-lighter',
    textColor: 'text-teal-dark',
    borderColor: 'border-teal-dark',
    leftBorderColor: 'border-teal-light',
  },
  completed: {
    bgColor: 'bg-purple-lighter',
    textColor: 'text-purple-dark',
    borderColor: 'border-purple',
    leftBorderColor: 'border-purple-light',
  },
  on_hold: {
    bgColor: 'bg-neutral-lighter',
    textColor: 'text-neutral-darker',
    borderColor: 'border-neutral-darker',
    leftBorderColor: 'border-neutral-light',
  },
};

export const getAssigmentLabel: (status: ProjectStatus) => string = (
  status
) => {
  const key = `${status}`.toUpperCase();
  return intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.${key}`).defaultMessage('');
};

export const UserAssignment: React.FC<{
  task: TaskDetailType;
  style: AssignmentStyle;
}> = ({ task, style }) => {
  const internalLink = useLink();
  const projectId = useSelector(getCurrentProjectId);
  return (
    <div
      className={`h-8 border-l-4 flex flex-col pl-2 mb-1 last:mb-0 ${style.leftBorderColor}`}
    >
      <Link
        to={`${projectId}/tasks/${task.id}`}
        target='_blank'
        className={classnames('text-xs', internalLink)}
      >
        {task.name}
      </Link>
      <Typography variant='caption' className='text-neutral'>
        {`${intl.get(
          'PEOPLE.RESOURCE_ALLOCATION.TABLE.ASSIGNMENT_ESTIMATED_TIME',
          {
            estimated: task.estimate_hours,
          }
        )} ${
          task.actual_hours || task.actual_hours !== null
            ? ` | ${intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.TABLE.ASSIGNMENT_ACTUAL_TIME',
                { hours: task.actual_hours }
              )}`
            : ''
        }`}
      </Typography>
    </div>
  );
};

export default UserAssignment;
