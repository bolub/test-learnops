import intl from 'react-intl-universal';
import get from 'lodash/get';
import { PROJECT_STATUS, PROJECT_HEALTH } from 'utils/constants';
import {
  ProjectHealth,
  Owner,
  Project,
  ProjectOwner,
  ProjectCollaborator,
  ProjectParticipant,
  AvatarSize,
} from 'utils/customTypes';
import classnames from 'classnames';
import { Tag, AvatarGroup } from '@getsynapse/design-system';
import { isEmpty } from 'lodash';
import UserAvatar from 'Atoms/UserAvatar';

type keys = keyof typeof PROJECT_STATUS;
export type ProjectStatus = typeof PROJECT_STATUS[keys];

export const statusStyle: Record<ProjectStatus, string> = {
  new: 'bg-success-lighter text-success-dark',
  in_planning: 'bg-warning-lighter text-secondary-darker',
  in_progress: 'bg-teal-lighter text-teal-dark',
  completed: 'bg-purple-lighter text-purple-dark',
  on_hold: 'bg-neutral-lighter text-neutral-darker',
  canceled: 'bg-error-lighter text-error-dark',
  closed: 'bg-primary-lighter text-primary-darker',
};

export const getStatusLabel: (status: ProjectStatus) => string = (status) => {
  const key = `${status}`.toUpperCase();
  return intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.${key}`).defaultMessage('');
};

export const getStatusColumn = (status: ProjectStatus) => {
  const tagStyle = statusStyle[status];
  const tagLabel = getStatusLabel(status);
  return <Tag className={`${tagStyle} text-xs`} label={tagLabel} />;
};

export const getOwnerColumn = (
  owners: Owner[],
  size: AvatarSize = 'medium',
  hideName: boolean = false
) => {
  if (owners.length === 1) {
    return (
      <div className='flex items-center justify-items-start'>
        <UserAvatar
          size={size}
          user={{
            avatar_url: owners[0].avatar_url,
            data: {
              firstName: get(owners[0], 'data.firstName'),
              lastName: get(owners[0], 'data.lastName'),
            },
          }}
          className='mr-2.5'
        />
        {!hideName &&
          `${get(owners, '0.data.firstName')} ${get(
            owners,
            '0.data.lastName'
          )}`}
      </div>
    );
  }

  if (owners.length > 1) {
    return (
      <AvatarGroup
        avatars={owners.map((owner) => ({
          size: 'medium',
          imageSrc: owner.avatar_url,
          initial: get(get(owner, 'data.firstName'), '[0]'),
        }))}
      />
    );
  }
};

export const getHealthColumn = (
  health: ProjectHealth,
  className?: string,
  indicatorClassName?: string
) => {
  switch (health) {
    case PROJECT_HEALTH.OFF_TRACK:
      return (
        <div className={classnames('flex items-center', className)}>
          <div
            className={classnames(
              'w-2 h-2 rounded-full bg-error mr-3',
              indicatorClassName
            )}
          />
          {intl.get('PROJECT_DETAIL.HEALTH_OPTIONS.OFF_TRACK')}
        </div>
      );
    case PROJECT_HEALTH.ON_TRACK:
      return (
        <div className={classnames('flex items-center', className)}>
          <div
            className={classnames(
              'w-2 h-2 rounded-full bg-success mr-3',
              indicatorClassName
            )}
          />
          {intl.get('PROJECT_DETAIL.HEALTH_OPTIONS.ON_TRACK')}
        </div>
      );
    case PROJECT_HEALTH.AT_RISK:
      return (
        <div className={classnames('flex items-center', className)}>
          <div
            className={classnames(
              'w-2 h-2 rounded-full bg-warning mr-3',
              indicatorClassName
            )}
          />
          {intl.get('PROJECT_DETAIL.HEALTH_OPTIONS.AT_RISK')}
        </div>
      );
    default:
      return '';
  }
};

export const getProjectRoleColumn = (
  userId: string | undefined,
  project: Project
) => {
  if (!userId || !project) {
    return '';
  }

  const isOwner = project.owners
    ? project.owners.some(
        (owner: ProjectOwner) => owner.project_owners.userId === userId
      )
    : false;

  if (isOwner) {
    return intl.get('PROJECT_DETAIL.USER_ROLE.OWNER');
  }

  const isCollaborator = project.collaborators
    ? project.collaborators.some(
        (collaborator: ProjectCollaborator) =>
          collaborator.project_collaborators.userId === userId
      )
    : false;

  if (isCollaborator) {
    return intl.get('PROJECT_DETAIL.USER_ROLE.COLLABORATOR');
  }

  const isMember = project.participants
    ? project.participants.some(
        (participant: ProjectParticipant) =>
          participant.project_participants.userId === userId
      )
    : false;

  if (isMember) {
    return intl.get('PROJECT_DETAIL.USER_ROLE.MEMBER');
  }
};

export const getValueById = (list: any, name: string, id: string) => {
  if (isEmpty(list) || !id) {
    return '';
  }
  const selectedValue = list.find((option: any) => option.id === id);
  if (selectedValue) {
    return selectedValue[name];
  } else {
    return '';
  }
};
