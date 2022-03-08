import intl from 'react-intl-universal';
import get from 'lodash/get';
import moment from 'moment';
import { Project, objKeyAsString } from 'utils/customTypes';
import { getStatusLabel, getProjectRoleColumn } from './tableColumnsValues';
import {
  PROJECTS_TABLE_FILTER_OPTIONS,
  PROJECTS_TABLE_COLUMNS,
  PROJECT_HEALTH,
  DATE,
} from 'utils/constants';

export const generateCsvHeaders = (columns: string[]) => {
  return columns.map((column) =>
    intl.get(`PROJECTS_LIST_PAGE.TABLE.HEAD.${column}`)
  );
};

export const generateCsvData = (
  columns: string[],
  projects: Project[],
  userId?: string
) => {
  type filter_key = keyof typeof PROJECTS_TABLE_FILTER_OPTIONS;
  return projects.map((project: Project) => {
    let csvRow: objKeyAsString = {};
    for (const column of columns) {
      const filter = column as filter_key;
      const columnValue = get(
        project,
        PROJECTS_TABLE_FILTER_OPTIONS[filter].value
      );
      let formattedValue = columnValue;
      if (columnValue) {
        if (column === PROJECTS_TABLE_COLUMNS.STATUS) {
          formattedValue = getStatusLabel(columnValue);
        }

        if (column === PROJECTS_TABLE_COLUMNS.HEALTH) {
          const healthKey = Object.keys(PROJECT_HEALTH).find(
            (key) => PROJECT_HEALTH[key] === columnValue
          );
          formattedValue = intl.get(
            `PROJECT_DETAIL.HEALTH_OPTIONS.${healthKey}`
          );
        }

        if (column === PROJECTS_TABLE_COLUMNS.PRIORITY) {
          formattedValue = intl.get(
            `PROJECT_DETAIL.PRIORITY_OPTIONS.${columnValue.toUpperCase()}`
          );
        }

        if (column === PROJECTS_TABLE_COLUMNS.PROJECT_OWNER) {
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
          formattedValue = ownersNames.length > 0 ? ownersNames.join(', ') : '';
        }

        if (
          column === PROJECTS_TABLE_COLUMNS.START_DATE ||
          column === PROJECTS_TABLE_COLUMNS.TARGET_COMPLETION_DATE ||
          column === PROJECTS_TABLE_COLUMNS.ACTUAL_COMPLETION_DATE
        ) {
          formattedValue = moment(new Date(columnValue)).format(
            DATE.SHORT_FORMAT
          );
        }
      }
      if (column === PROJECTS_TABLE_COLUMNS.PROJECT_ROLE) {
        formattedValue = getProjectRoleColumn(userId, project);
      }
      csvRow[intl.get(`PROJECTS_LIST_PAGE.TABLE.HEAD.${column}`)] =
        formattedValue;
    }
    return csvRow;
  });
};

export const getCsvFileName = () =>
  `projects_${moment(new Date()).format(DATE.EXPORT_CSV_FORMAT)}.csv`;
