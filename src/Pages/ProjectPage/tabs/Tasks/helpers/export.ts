import intl from 'react-intl-universal';
import get from 'lodash/get';
import moment from 'moment';
import { Task, objKeyAsString, Task_Status } from 'utils/customTypes';
import {
  DATE,
  TASKS_TABLE_COLUMN_REFERENCE,
  TASK_FIELDS,
} from 'utils/constants';

export const generateCsvHeaders = (columns: string[]) => {
  return columns.map((column) => intl.get(`TASKS.TABLE.HEAD.${column}`));
};

export const getStatusLabel: (status: Task_Status) => string = (status) => {
  const key = `${status}`.toUpperCase();
  return intl
    .get(`TASKS.TASK_DETAIL_PAGE.STATUS_OPTIONS.${key}`)
    .defaultMessage('');
};

export const generateCsvData = (columns: string[], tasks: Task[]) => {
  return tasks.map((task: Task) => {
    let csvRow: objKeyAsString = {};
    type column_key = keyof typeof TASK_FIELDS;
    for (const column of columns) {
      const columnName = column as column_key;
      const columnValue = get(task, TASK_FIELDS[columnName]);
      let formattedValue = columnValue;

      if (columnValue) {
        if (column === TASKS_TABLE_COLUMN_REFERENCE.STATUS) {
          formattedValue = getStatusLabel(columnValue);
        }
        if (column === TASKS_TABLE_COLUMN_REFERENCE.ASSIGNEE_UPDATE) {
          const assigneeNames = [];
          for (const assignee of columnValue) {
            const name = `${get(assignee, 'data.firstName')} ${get(
              assignee,
              'data.lastName'
            )}`;
            if (name) {
              assigneeNames.push(name);
            }
          }
          formattedValue =
            assigneeNames.length > 0 ? assigneeNames.join(', ') : '';
        }
        if (
          column === TASKS_TABLE_COLUMN_REFERENCE.START_DATE ||
          column === TASKS_TABLE_COLUMN_REFERENCE.DUE_DATE
        ) {
          formattedValue = moment(new Date(columnValue)).format(
            DATE.SHORT_FORMAT
          );
        }
      } else {
        if (column === TASKS_TABLE_COLUMN_REFERENCE.DISABLED) {
          formattedValue = false;
        }
      }
      csvRow[intl.get(`TASKS.TABLE.HEAD.${column}`)] = formattedValue;
    }
    return csvRow;
  });
};

export const getCsvFileName = () =>
  `tasks_${moment(new Date()).format(DATE.EXPORT_CSV_FORMAT)}.csv`;
