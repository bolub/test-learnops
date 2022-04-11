import intl from 'react-intl-universal';
import get from 'lodash/get';
import moment from 'moment';
import {
  Project,
  objKeyAsString,
  BusinessTeam,
  ProjectProcess,
  ProjectCategory,
  ProjectProcessStage,
} from 'utils/customTypes';
import {
  getStatusLabel,
  getProjectRoleColumn,
  getValueById,
  getProjectNumberColumn,
  getResourcingTypeLabel,
  getBudgetSourceLabel,
} from './tableColumnsValues';
import {
  PROJECTS_TABLE_FILTER_OPTIONS,
  PROJECTS_TABLE_COLUMNS,
  PROJECT_HEALTH,
  DATE,
  PROJECT_STATUS,
} from 'utils/constants';

export const generateCsvHeaders = (columns: string[]) => {
  return columns.map((column) =>
    intl.get(`PROJECTS_LIST_PAGE.TABLE.HEAD.${column}`)
  );
};

export const generateCsvData = (
  columns: string[],
  projects: Project[],
  bussinessTeams: BusinessTeam[],
  projectProcesses: ProjectProcess[],
  projectCategories: ProjectCategory[],
  userId?: string
) => {
  type filter_key = keyof typeof PROJECTS_TABLE_FILTER_OPTIONS;
  return projects.map((project: Project) => {
    let csvRow: objKeyAsString = {};

    let matchedStages: ProjectProcessStage[] = [];
    const matchedProcess = projectProcesses.find(
      (process: ProjectProcess) => process.id === project.process_id
    );
    if (matchedProcess) {
      matchedStages = matchedProcess.projectStages;
    }
    const isInProgressOrCompleted =
      project.status === PROJECT_STATUS.IN_PROGRESS ||
      project.status === PROJECT_STATUS.COMPLETED;

    for (const column of columns) {
      const filter = column as filter_key;
      const columnValue = get(
        project,
        PROJECTS_TABLE_FILTER_OPTIONS[filter].value
      );
      let formattedValue = columnValue;

      if (columnValue) {
        switch (column) {
          case PROJECTS_TABLE_COLUMNS.STATUS:
            formattedValue = getStatusLabel(columnValue);
            break;
          case PROJECTS_TABLE_COLUMNS.HEALTH:
            const healthKey = Object.keys(PROJECT_HEALTH).find(
              (key) => PROJECT_HEALTH[key] === columnValue
            );
            formattedValue = isInProgressOrCompleted
              ? intl.get(`PROJECT_DETAIL.HEALTH_OPTIONS.${healthKey}`)
              : '';
            break;
          case PROJECTS_TABLE_COLUMNS.PRIORITY:
            formattedValue = intl.get(
              `PROJECT_DETAIL.PRIORITY_OPTIONS.${columnValue.toUpperCase()}`
            );
            break;
          case PROJECTS_TABLE_COLUMNS.PROJECT_OWNER:
            const ownersNames = [];
            for (const owner of columnValue) {
              const name = `${get(owner, 'data.firstName')} ${get(
                owner,
                'data.lastName'
              )}`;
              if (name) {
                ownersNames.push(name);
              }
            }
            formattedValue =
              ownersNames.length > 0 ? ownersNames.join(', ') : '';
            break;
          case PROJECTS_TABLE_COLUMNS.START_DATE:
          case PROJECTS_TABLE_COLUMNS.TARGET_COMPLETION_DATE:
          case PROJECTS_TABLE_COLUMNS.ACTUAL_COMPLETION_DATE:
            formattedValue = moment(new Date(columnValue)).format(
              DATE.SHORT_FORMAT
            );
            break;
          case PROJECTS_TABLE_COLUMNS.PROJECT_NUMBER:
            formattedValue = getProjectNumberColumn(columnValue);
            break;
          case PROJECTS_TABLE_COLUMNS.RESOURCING_TYPE:
            formattedValue = getResourcingTypeLabel(columnValue);
            break;
          case PROJECTS_TABLE_COLUMNS.BUGGET_SOURCE:
            formattedValue = getBudgetSourceLabel(columnValue);
            break;
          default:
            break;
        }
      } else {
        switch (column) {
          case PROJECTS_TABLE_COLUMNS.PROJECT_ROLE:
            formattedValue = getProjectRoleColumn(userId, project);
            break;
          case PROJECTS_TABLE_COLUMNS.BUSINESS_UNIT:
            formattedValue = getValueById(
              bussinessTeams,
              'title',
              project.businessUnitId
            );
            break;
          case PROJECTS_TABLE_COLUMNS.PROJECT_CATEGORY:
            formattedValue = getValueById(
              projectCategories,
              'categoryName',
              project.category_id
            );
            break;
          case PROJECTS_TABLE_COLUMNS.PROCESS_STAGE:
            formattedValue = getValueById(
              projectProcesses,
              'processName',
              project.process_id!
            );
            break;
          case PROJECTS_TABLE_COLUMNS.PROJECT_STAGE:
            formattedValue = getValueById(
              matchedStages,
              'stageName',
              project.stage_id!
            );
            break;
          default:
            break;
        }
      }
      csvRow[intl.get(`PROJECTS_LIST_PAGE.TABLE.HEAD.${column}`)] =
        formattedValue;
    }
    return csvRow;
  });
};

export const getCsvFileName = () =>
  `projects_${moment(new Date()).format(DATE.EXPORT_CSV_FORMAT)}.csv`;
