import {
  CapacityEntry,
  UserCapacity,
  UserColumnType,
  SectionUserType,
  ResourceAllocationSectionsType,
} from 'utils/customTypes';

const generateUserColumns = (user: UserCapacity) => {
  let roles: string[] = [];
  user.projects.forEach((project) =>
    project.currentParticipantRoles.forEach((roleItem) =>
      roles.push(roleItem.role)
    )
  );

  const resp: UserColumnType = {
    user: {
      avatar_url: user.data.avatar_url || '',
      data: user.data.data,
      roles: roles.join(', '),
    },
    projects: user.projects.map((project) => ({
      id: project.id,
      title: project.title,
      priority: project.priority,
      health: project.health,
      targetCompletionDate: project.targetCompletionDate,
      roles: project.currentParticipantRoles.reduce((prev, current) => {
        const prevStartDate = new Date(
          new Date(prev.startDate).toLocaleDateString()
        );
        const currentStartDate = new Date(
          new Date(current.startDate).toLocaleDateString()
        );

        const prevEndDate = new Date(
          new Date(prev.endDate).toLocaleDateString()
        );
        const currentEndDate = new Date(
          new Date(current.endDate).toLocaleDateString()
        );
        return {
          role: `${prev.role}, ${current.role}`,
          startDate:
            prevStartDate < currentStartDate
              ? prevStartDate.toLocaleDateString()
              : currentStartDate.toLocaleDateString(),
          endDate:
            prevEndDate > currentEndDate
              ? prevEndDate.toLocaleDateString()
              : currentEndDate.toLocaleDateString(),
        };
      }),
      status: project.status,
      hours: project.totalAllocationForAllRoles,
    })),
  };
  return resp;
};

const generateUserAllocations = (
  allocations: UserCapacity['allocations'],
  defaultCapacity: number
) => {
  return allocations.map((allocation) => ({
    weekStart: new Date(allocation.weekStart),
    weekEnd: new Date(allocation.weekEnd),
    capacity: allocation.capacity,
    defaultCapacity: defaultCapacity,
  }));
};

const generateUserTimeOffsList = (allocations: UserCapacity['allocations']) => {
  const timeOffs = allocations.filter(
    (allocation) => allocation.timeOff.weeklyTimeOffForUser > 0
  );
  return timeOffs.map((allocation) => ({
    weekStart: new Date(allocation.weekStart),
    weekEnd: new Date(allocation.weekEnd),
    capacity: allocation.timeOff.weeklyTimeOffForUser,
  }));
};

const formatSectionUsers = (users: Record<string, UserCapacity>) => {
  const resp: SectionUserType[] = [];
  const usersIds = Object.keys(users);
  for (const userId of usersIds) {
    resp.push({
      id: userId,
      ...generateUserColumns(users[userId]),
      allocations: generateUserAllocations(
        users[userId].allocations,
        users[userId].data.default_capacity
      ),
      timeOffs: generateUserTimeOffsList(users[userId].allocations),
    });
  }
  return resp;
};

export const formatResourceAllocationSections = (
  rawSections: Record<string, CapacityEntry>
) => {
  const resp: ResourceAllocationSectionsType[] = [];
  const sectionKeys = Object.keys(rawSections);
  for (const sectionKey of sectionKeys) {
    const section = rawSections[sectionKey];
    resp.push({
      id: sectionKey,
      label: section.team.name,
      users: formatSectionUsers(section.users),
    });
  }
  return resp;
};
