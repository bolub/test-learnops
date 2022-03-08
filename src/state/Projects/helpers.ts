import intl from 'react-intl-universal';
import moment from 'moment';
import {
  filter,
  rangeDate,
  Project,
  Owner,
  ProjectUserRole,
  ProjectOwner,
  ProjectCollaborator,
  ProjectParticipant,
  ProjectProcessStage,
  objKeyAsString,
  ProcessStage,
  FormOption,
} from 'utils/customTypes';
import {
  TABLE_FILTERS_OPERATORS,
  PROJECT_HEALTH,
  PROJECTS_TABLE_FILTER_OPTIONS,
  PROJECT_USER_ROLE,
  COLUMN_OPTION_TYPES,
  STAGE_COLORS,
  STAGE_ON_DRAG_COLORS,
  STAGE_ON_DRAG_BORDER_COLORS,
} from 'utils/constants';

export const formatFilters = (filters: filter[]) =>
  filters.map((filter) => {
    if (filter.type === COLUMN_OPTION_TYPES.DATE) {
      const dateRange = filter.value as rangeDate;
      return {
        ...filter,
        value: {
          startDate: new Date(dateRange.startDate).toDateString(),
          endDate: new Date(dateRange.endDate).toDateString(),
        },
      };
    } else {
      return filter;
    }
  });

const checkColumnMatchProjectUserRole = (
  userRole: ProjectUserRole,
  project: Project,
  userId: string,
  shouldMatch: boolean = true
) => {
  switch (userRole) {
    case PROJECT_USER_ROLE.OWNER:
      return shouldMatch
        ? project.owners.some(
            (owner: ProjectOwner) => owner.project_owners.userId === userId
          )
        : project.owners.every(
            (owner: ProjectOwner) => owner.project_owners.userId !== userId
          );
    case PROJECT_USER_ROLE.COLLABORATOR:
      return shouldMatch
        ? project.collaborators.some(
            (collaborator: ProjectCollaborator) =>
              collaborator.project_collaborators.userId === userId
          )
        : project.collaborators.every(
            (collaborator: ProjectCollaborator) =>
              collaborator.project_collaborators.userId !== userId
          );
    case PROJECT_USER_ROLE.MEMBER:
      return shouldMatch
        ? project.participants.some(
            (participant: ProjectParticipant) =>
              participant.project_participants.userId === userId
          )
        : project.participants.every(
            (participant: ProjectParticipant) =>
              participant.project_participants.userId !== userId
          );
    default:
      return false;
  }
};

const checkColumnContainsValue = (
  column: string | undefined,
  columnData: any,
  value: string,
  shouldContain: boolean = true
) => {
  let formattedValue = value.toLocaleLowerCase();
  let formattedColum = columnData;
  if (column === 'status') {
    formattedColum = intl.get(
      `PROJECT_DETAIL.STATUS_OPTIONS.${columnData.toUpperCase()}`
    );
  }

  if (column === 'health') {
    const health = Object.keys(PROJECT_HEALTH).find(
      (key) => PROJECT_HEALTH[key] === columnData
    );
    formattedColum = intl.get(`PROJECT_DETAIL.HEALTH_OPTIONS.${health}`);
  }

  if (column === 'priority') {
    formattedColum = intl.get(
      `PROJECT_DETAIL.PRIORITY_OPTIONS.${columnData.toUpperCase()}`
    );
  }

  if (column === 'owners') {
    if (shouldContain) {
      return columnData.some((owner: Owner) => {
        const fullname =
          `${owner.data?.firstName} ${owner.data?.lastName}`.toLocaleLowerCase();
        return fullname.includes(formattedValue);
      });
    } else {
      return columnData.every((owner: Owner) => {
        const fullname =
          `${owner.data?.firstName} ${owner.data?.lastName}`.toLocaleLowerCase();
        return !fullname.includes(formattedValue);
      });
    }
  }

  if (column === 'projectNumber') {
    return shouldContain
      ? (formattedColum + '').indexOf(formattedValue) > -1
      : (formattedColum + '').indexOf(formattedValue) === -1;
  }

  return formattedColum
    ? shouldContain
      ? formattedColum.toLowerCase().includes(formattedValue)
      : !formattedColum.toLowerCase().includes(formattedValue)
    : false;
};

export const checkColumnMatchDateFilter = (columnData: any, filter: filter) => {
  const requestDate = moment(
    new Date(columnData.replace(/-/g, '/').replace(/T.+/, ''))
  );
  const rangeDate = filter.value as rangeDate;
  const startDate = new Date(rangeDate.startDate);
  const endDate = new Date(rangeDate.endDate);

  switch (filter.operator) {
    case TABLE_FILTERS_OPERATORS.EQUAL:
      return requestDate.isSame(startDate, 'days');
    case TABLE_FILTERS_OPERATORS.GREATER:
      return requestDate.isAfter(startDate, 'days');
    case TABLE_FILTERS_OPERATORS.GREATER_OR_EQUAL:
      return requestDate.isSameOrAfter(startDate, 'days');
    case TABLE_FILTERS_OPERATORS.LESS:
      return requestDate.isBefore(startDate, 'days');
    case TABLE_FILTERS_OPERATORS.LESS_OR_EQUAL:
      return requestDate.isSameOrBefore(startDate, 'days');
    case TABLE_FILTERS_OPERATORS.BETWEEN:
      return requestDate.isBetween(startDate, endDate, 'days', '[]');
    default:
      return false;
  }
};

export const checkColumnMatchFilter = (columnData: any, filter: filter) => {
  const value =
    filter.type === COLUMN_OPTION_TYPES.OPTIONS
      ? (filter.value as FormOption).value
      : (filter.value as string);
  switch (filter.operator) {
    case TABLE_FILTERS_OPERATORS.CONTAINS:
      return checkColumnContainsValue(filter.column, columnData, value);
    case TABLE_FILTERS_OPERATORS.DOESNT_CONTAIN:
      return checkColumnContainsValue(filter.column, columnData, value, false);
    case TABLE_FILTERS_OPERATORS.EQUAL:
      return isNaN(columnData) || typeof columnData === 'boolean'
        ? columnData === value
        : columnData === +value;
    case TABLE_FILTERS_OPERATORS.NOT_EQUAL:
      return isNaN(columnData) || typeof columnData === 'boolean'
        ? columnData !== value
        : columnData !== +value;
    case TABLE_FILTERS_OPERATORS.GREATER:
      return columnData > +value;
    case TABLE_FILTERS_OPERATORS.GREATER_OR_EQUAL:
      return columnData >= +value;
    case TABLE_FILTERS_OPERATORS.LESS:
      return columnData < +value;
    case TABLE_FILTERS_OPERATORS.LESS_OR_EQUAL:
      return columnData <= +value;
    case TABLE_FILTERS_OPERATORS.BETWEEN:
      return false;
    default:
      return false;
  }
};

const checkProjectMatchAllFilters = (
  project: Project,
  filters: filter[],
  userId?: string
) => {
  let projectMatchAllFilters = false;
  for (const filter of filters) {
    if (filter.column) {
      let columnMatchFilter = false;
      if (
        filter.column === PROJECTS_TABLE_FILTER_OPTIONS.PROJECT_ROLE.value &&
        userId
      ) {
        columnMatchFilter = checkColumnMatchProjectUserRole(
          filter.value as string,
          project,
          userId,
          filter.operator === TABLE_FILTERS_OPERATORS.EQUAL
        );
      }
      type key = keyof Project;
      const columnData = project[filter.column as key];
      if (columnData) {
        columnMatchFilter =
          filter.type === COLUMN_OPTION_TYPES.DATE
            ? checkColumnMatchDateFilter(columnData, filter)
            : checkColumnMatchFilter(columnData, filter);
      }
      if (filter.logic !== undefined) {
        projectMatchAllFilters =
          filter.logic === 'AND'
            ? projectMatchAllFilters && columnMatchFilter
            : projectMatchAllFilters || columnMatchFilter;
      } else {
        projectMatchAllFilters = columnMatchFilter;
      }
    }
  }
  return projectMatchAllFilters;
};

export const filterProjects: (
  projects: Project[],
  search: string,
  filters: filter[],
  userId?: string
) => Project[] = (projects, search, filters, userId) => {
  let filteredProjectsList = projects;
  const filtersActive = filters.length > 0;
  const searchActive = search;
  if (filtersActive || searchActive) {
    filteredProjectsList = projects.filter((project: Project) => {
      let projectMatchSearch = false;
      let projectMatchFilters = false;
      if (filtersActive) {
        projectMatchFilters = checkProjectMatchAllFilters(
          project,
          filters,
          userId
        );
      }
      if (searchActive) {
        projectMatchSearch =
          project.title
            ?.toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) || projectMatchSearch;
      }

      if (searchActive && filtersActive) {
        return projectMatchSearch && projectMatchFilters;
      } else if (searchActive && !filtersActive) {
        return projectMatchSearch;
      } else if (!searchActive && filtersActive) {
        return projectMatchFilters;
      } else {
        return false;
      }
    });
  }
  return filteredProjectsList;
};

export const groupProjectsByStage: (
  stages: ProjectProcessStage[],
  projects: Project[]
) => ProcessStage[] = (stages, projects) => {
  const stagesList: objKeyAsString = {};
  let index = 0;
  for (const stage of stages) {
    stagesList[stage.id] = {
      id: stage.id,
      name: stage.stageName,
      color: STAGE_COLORS[index],
      colorOnDrag: STAGE_ON_DRAG_COLORS[index],
      borderColorOnDrag: STAGE_ON_DRAG_BORDER_COLORS[index],
      cards: [],
    };
    index = (index + 1) % STAGE_COLORS.length;
  }
  for (const project of projects) {
    if (project.stage_id && stagesList[project?.stage_id]) {
      stagesList[project?.stage_id].cards =
        stagesList[project?.stage_id].cards.concat(project);
    }
  }
  return Object.values(stagesList);
};
