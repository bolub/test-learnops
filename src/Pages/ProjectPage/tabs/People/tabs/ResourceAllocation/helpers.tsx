import intl from 'react-intl-universal';
import {
  ResourceAllocationSections,
  ProjectParticipantsAllocations,
  Owner,
  ProjectParticipantRole,
  TaskDetailType,
  WeekTimeOffAndHolidays,
  CollaboratorEstimation,
  ParticipanttAllocation,
} from 'utils/customTypes';
import {
  Section as FormatedSection,
  Column,
  AllocatedUser,
  AllocatedUserColumn,
  Allocation,
  Assignment,
  Estimation,
  AllocatedUserRole,
} from 'Organisms/CapacityAllocationTable/helpers';
import { UserAllocation, TimeOffAllocation } from './components/UserAllocation';
import {
  AllocatedUserDetails,
  AllocatedUserRoles,
  AllocatesUserHours,
} from './components/AllocatedUser';
import {
  UserAssignment,
  getAssigmentLabel,
  assigmentStyle,
} from './components/UserAssignment';

const generateUserColumns: (
  user: Owner,
  roles: ProjectParticipantRole[],
  participantType: string,
  assignedProjectTasks?: TaskDetailType[]
) => AllocatedUserColumn[] = (
  user,
  roles,
  participantType,
  assignedProjectTasks = []
) => {
  const resp: AllocatedUserColumn[] = [
    {
      className: 'w-2/4',
      children: (params) => (
        <AllocatedUserDetails
          params={params!}
          user={user}
          hasAssignments={assignedProjectTasks.length > 0}
          participantType={participantType}
        />
      ),
    },
    {
      className: 'w-1/4',
      children: () => <AllocatedUserRoles roles={roles} />,
    },
    {
      className: 'w-1/4',
      children: () => <AllocatesUserHours roles={roles} />,
    },
  ];
  return resp;
};

const generateRoleAllocations: (
  allocations: ParticipanttAllocation[]
) => Allocation[] = (allocations) => {
  return allocations.map((allocation: ParticipanttAllocation) => ({
    weekStart: new Date(allocation.weekStart),
    weekEnd: new Date(allocation.weekEnd),
    content: <UserAllocation allocation={allocation} />,
  }));
};

const generateRoleEstimation: (
  estimation: CollaboratorEstimation
) => Estimation = (estimation) => {
  return {
    startDate: estimation.start_date,
    endDate: estimation.end_date,
    content: {
      bgColor: 'bg-success-light',
      textColor: 'text-success-dark',
      onClickCallback: () => {},
      userId: estimation.userId,
      label: intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.TABLE.COLLABORATOR_ESTIMATED_TIME',
        { hours: estimation.estimated_hours }
      ),
    },
  };
};

const generateUserRoles: (
  roles: ProjectParticipantRole[]
) => AllocatedUserRole[] = (roles) => {
  const resp: AllocatedUserRole[] = [];
  for (const role of roles) {
    if (role.allocations && role.allocations.length > 0 && !role.estimation) {
      const allocations = generateRoleAllocations(role.allocations);
      resp.push({ allocations });
    } else {
      const estimation = generateRoleEstimation(role.estimation!);
      resp.push({ estimation });
    }
  }
  return resp;
};

const generateUserAssignmentsList: (
  tasks?: TaskDetailType[]
) => Assignment[] = (tasks = []) => {
  return tasks.map((task: TaskDetailType) => {
    const style = assigmentStyle[task.status];
    const name = getAssigmentLabel(task.status);
    return {
      columns: [
        {
          className: 'py-1 pr-2 pl-10',
          content: <UserAssignment task={task} style={style} />,
        },
      ],
      startDate: new Date(task.start_date!),
      endDate: new Date(task.due_date!),
      content: { ...style, name, time: task.estimate_hours },
    };
  });
};

const generateUserTimeOffsList: (
  timeOffs?: WeekTimeOffAndHolidays[]
) => Allocation[] = (timeOffs = []) => {
  return timeOffs.map((timeOff: WeekTimeOffAndHolidays) => {
    return {
      weekStart: new Date(timeOff.weekStart),
      weekEnd: new Date(timeOff.weekEnd),
      content: <TimeOffAllocation timeOff={timeOff} />,
    };
  });
};

const formatSectionUsers: (
  users: ProjectParticipantsAllocations,
  participantType: string
) => AllocatedUser[] = (users, participantType: string) => {
  const resp: AllocatedUser[] = [];
  const usersIds = Object.keys(users);
  for (const userId of usersIds) {
    const { data, roles, assignedProjectTasks, holidaysAndTimeOffs } =
      users[userId];
    resp.push({
      id: userId,
      columns: generateUserColumns(
        data,
        roles,
        participantType,
        assignedProjectTasks
      ),
      roles: generateUserRoles(roles),
      assignments: generateUserAssignmentsList(assignedProjectTasks),
      timeOffs: generateUserTimeOffsList(holidaysAndTimeOffs),
    });
  }
  return resp;
};

export const formatResourceAllocationSections: (
  rawSections: ResourceAllocationSections
) => FormatedSection[] = (rawSections) => {
  const resp: FormatedSection[] = [];
  const sectionKeys = Object.keys(rawSections);
  for (const sectionKey of sectionKeys) {
    const section = rawSections[sectionKey];
    const participantType = sectionKey;
    resp.push({
      id: section.id,
      users: formatSectionUsers(section.users, participantType),
      label: intl.get(`PEOPLE.RESOURCE_ALLOCATION.TABLE.${sectionKey}`, {
        num: 1,
      }),
      emptyMessage: intl.get(
        `PEOPLE.RESOURCE_ALLOCATION.TABLE.EMPTY_${sectionKey}`
      ),
    });
  }
  return resp;
};

export const generateTableHeaders: () => Column[] = () => {
  return [
    {
      content: intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.TABLE.HEADERS.PROJECT_TEAM'
      ),
      className: 'w-2/4 px-3 py-2 text-left text-primary-dark',
    },
    {
      content: intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.TABLE.HEADERS.PROJECT_ROLE'
      ),
      className: 'w-1/4 px-3 py-2 text-left text-primary-dark',
    },
    {
      content: intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.HEADERS.ALLOCATION', {
        isMember: 1,
      }),
      className: 'w-1/4 px-3 py-2 text-left text-primary-dark',
    },
  ];
};
