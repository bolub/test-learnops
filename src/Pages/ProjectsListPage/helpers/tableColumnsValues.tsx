import intl from 'react-intl-universal';
import get from 'lodash/get';
import { PROJECT_STATUS, PROJECT_NUMBER_FORMAT } from 'utils/constants';
import {
  Owner,
  Project,
  ProjectOwner,
  ProjectCollaborator,
  ProjectParticipant,
  AvatarSize,
} from 'utils/customTypes';
import { Tag, AvatarGroup } from '@getsynapse/design-system';
import { isEmpty } from 'lodash';
import UserAvatar from 'Atoms/UserAvatar';

type keys = keyof typeof PROJECT_STATUS;
export type ProjectStatus = typeof PROJECT_STATUS[keys];

export const statusStyle: Record<
  ProjectStatus,
  { className: string; textClassName: string }
> = {
  new: {
    className: 'bg-success-lighter',
    textClassName: 'text-success-dark',
  },
  in_planning: {
    className: 'bg-warning-lighter',
    textClassName: 'text-secondary-darker',
  },
  in_progress: {
    className: 'bg-teal-lighter',
    textClassName: 'text-teal-dark',
  },
  completed: {
    className: 'bg-purple-lighter',
    textClassName: 'text-purple-dark',
  },
  on_hold: {
    className: 'bg-neutral-lighter',
    textClassName: 'text-neutral-darker',
  },
  canceled: {
    className: 'bg-error-lighter',
    textClassName: 'text-error-dark',
  },
  closed: {
    className: 'bg-primary-lighter',
    textClassName: 'text-primary-darker',
  },
};

export const getStatusLabel: (status: ProjectStatus) => string = (status) => {
  const key = `${status}`.toUpperCase();
  return intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.${key}`).defaultMessage('');
};

export const getStatusColumn = (status: ProjectStatus) => {
  const tagStyle = statusStyle[status];
  const tagLabel = getStatusLabel(status);
  return (
    <Tag
      className={`${tagStyle.className} text-xs`}
      textClassName={tagStyle.textClassName}
      label={tagLabel}
    />
  );
};

export const getResourcingTypeLabel = (type: string | undefined) => {
  return type
    ? intl.get(`PROJECT_DETAIL.RESOURCING_TYPE_OPTIONS.${type.toUpperCase()}`)
    : '';
};

export const getBudgetSourceLabel = (type: string | undefined) => {
  return type
    ? intl.get(`PROJECT_DETAIL.BUDGET_SOURCE_OPTIONS.${type.toUpperCase()}`)
    : '';
};

export const getOwnerColumn = (
  owners: Owner[],
  size: AvatarSize = 'small',
  hideName: boolean = false
) => {
  if (owners.length === 1) {
    return (
      <div className='flex items-center'>
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

export const getProjectNumberColumn = (projectNumber: number | undefined) => {
  if (!projectNumber) {
    return '';
  }
  const numberLength = projectNumber.toString().length;
  if (numberLength < 7) {
    return (
      PROJECT_NUMBER_FORMAT.FULL.slice(
        0,
        PROJECT_NUMBER_FORMAT.FULL.length - numberLength
      ) + projectNumber
    );
  } else {
    return PROJECT_NUMBER_FORMAT.BASE + projectNumber;
  }
};
