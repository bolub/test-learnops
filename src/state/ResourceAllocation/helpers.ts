import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import {
  ProjectParticipantAllocation,
  ProjectCollaboratorsAllocations,
  ResourceAllocationSections,
  WeekTimeOffAndHolidays,
} from 'utils/customTypes';
import {
  PROJECT_OWNER,
  RESOURCE_ALLOCATION_TABLE_SECTIONS,
} from 'utils/constants';

export const generateResourceAllocationSections: () => ResourceAllocationSections =
  () =>
    Object.keys(RESOURCE_ALLOCATION_TABLE_SECTIONS).reduce((acc: {}, cur) => {
      const resp = acc as ResourceAllocationSections;
      return {
        ...resp,
        [cur]: {
          id: cur,
          users: {},
        },
      };
    }, {});

export const populateCollaboratorsSection: (
  originalSections: ResourceAllocationSections,
  collaboratorsAllocations: ProjectCollaboratorsAllocations[]
) => ResourceAllocationSections = (
  originalSections,
  collaboratorsAllocations
) => {
  const sections = cloneDeep(originalSections);
  for (const collaboratorsAllocation of collaboratorsAllocations) {
    sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.COLLABORATORS].users = {
      ...sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.COLLABORATORS].users,
      [collaboratorsAllocation.userId]: {
        data: collaboratorsAllocation.collaborator,
        roles: [
          {
            role: collaboratorsAllocation.job_role,
            estimation: {
              start_date: collaboratorsAllocation.start_date,
              end_date: collaboratorsAllocation.end_date,
              estimated_hours: collaboratorsAllocation.estimated_hours,
              userId: collaboratorsAllocation.userId,
              projectLearnOpId: collaboratorsAllocation.projectLearnOpId,
            },
          },
        ],
        assignedProjectTasks: collaboratorsAllocation.assignedProjectTasks,
      },
    };
  }
  return sections;
};

export const populateOwnersAndMembersSections: (
  originalSections: ResourceAllocationSections,
  participants: ProjectParticipantAllocation[]
) => ResourceAllocationSections = (originalSections, participants) => {
  const sections = cloneDeep(originalSections);
  for (const participant of participants) {
    const {
      roles,
      data,
      assignedProjectTasks,
      holidaysAndTimeOffs = [],
    } = participant;
    const timeOffs = holidaysAndTimeOffs.filter(
      (timeOff: WeekTimeOffAndHolidays) =>
        timeOff.weeklyTimeOffForUser > 0 ||
        timeOff.holidaysWithinWeek.length > 0
    );
    for (const role of roles) {
      if (role.role === PROJECT_OWNER) {
        sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.OWNERS].users = {
          ...sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.OWNERS].users,
          [data.id!]: {
            data,
            roles: [
              {
                role: role.role,
                participationId: role.participationId,
                allocations: role.allocations,
              },
            ],
            assignedProjectTasks,
            holidaysAndTimeOffs: timeOffs,
          },
        };
      } else {
        if (
          !has(
            sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.MEMBERS].users,
            data.id!
          )
        ) {
          sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.MEMBERS].users = {
            ...sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.MEMBERS].users,
            [data.id!]: {
              data,
              roles: [
                {
                  role: role.role,
                  participationId: role.participationId,
                  allocations: role.allocations,
                },
              ],
              assignedProjectTasks,
              holidaysAndTimeOffs: timeOffs,
            },
          };
        } else {
          sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.MEMBERS].users[data.id!] =
            {
              ...sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.MEMBERS].users[
                data.id!
              ],
              roles: sections[RESOURCE_ALLOCATION_TABLE_SECTIONS.MEMBERS].users[
                data.id!
              ].roles.concat({
                role: role.role,
                participationId: role.participationId,
                allocations: role.allocations,
              }),
            };
        }
      }
    }
  }
  return sections;
};
