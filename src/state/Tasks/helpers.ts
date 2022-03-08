import { Task, filter, TaskAssignedUser, FormOption } from 'utils/customTypes';
import {
  COLUMN_OPTION_TYPES,
  TASK_FIELDS,
  TABLE_FILTERS_OPERATORS,
} from 'utils/constants';
import {
  checkColumnMatchDateFilter,
  checkColumnMatchFilter,
} from 'state/Projects/helpers';

const taskIncludesAssigneeUser: (
  user: FormOption,
  task: Task,
  checkForIncluded: boolean
) => boolean = (userId, task, checkForIncluded) => {
  let userIncluded = false;
  const assignees: TaskAssignedUser[] = task.assignedUsers || [];
  for (const assigneedUser of assignees) {
    if (assigneedUser.id === userId.value) {
      userIncluded = true;
      if (checkForIncluded) {
        break;
      }
    }
  }
  return checkForIncluded ? userIncluded : !userIncluded;
};

const taskMatchAllFilters: (task: Task, filters: filter[]) => boolean = (
  task,
  filters
) => {
  let allFiltersMatched = false;
  for (const filter of filters) {
    if (filter.column) {
      let columnMatchFilter = false;
      if (filter.column === TASK_FIELDS.ASSIGNEE_UPDATE) {
        const user = filter.value as FormOption;
        columnMatchFilter = taskIncludesAssigneeUser(
          user,
          task,
          filter.operator === TABLE_FILTERS_OPERATORS.EQUAL
        );
      } else {
        type key = keyof Task;
        const columnData = task[filter.column as key];
        if (columnData) {
          columnMatchFilter =
            filter.type === COLUMN_OPTION_TYPES.DATE
              ? checkColumnMatchDateFilter(columnData, filter)
              : checkColumnMatchFilter(columnData, filter);
        }
      }
      if (filter.logic !== undefined) {
        allFiltersMatched =
          filter.logic === 'AND'
            ? allFiltersMatched && columnMatchFilter
            : allFiltersMatched || columnMatchFilter;
      } else {
        allFiltersMatched = columnMatchFilter;
      }
    }
  }
  return allFiltersMatched;
};

export const getTasksAssigneesList: (tasks: Task[]) => TaskAssignedUser[] = (
  tasks: Task[]
) => {
  const assignees: TaskAssignedUser[] = [];
  const selectedUsersIds: string[] = [];
  for (const task of tasks) {
    const assignedUsers = task.assignedUsers || [];
    for (const user of assignedUsers) {
      if (!selectedUsersIds.includes(user.id)) {
        selectedUsersIds.push(user.id);
        assignees.push(user);
      }
    }
  }
  return assignees;
};

export const filterTasks: (
  tasks: Task[],
  filters: filter[],
  search: string
) => Task[] = (tasks, filters, search) => {
  const filtersActive = filters.length > 0;
  const searchActive = search;

  let filteredTasks = tasks;

  if (filtersActive || searchActive) {
    filteredTasks = tasks.filter((task: Task) => {
      let taskMatchSearch = false;
      let taskMatchFilters = false;

      if (filtersActive) {
        taskMatchFilters = taskMatchAllFilters(task, filters);
      }

      if (searchActive) {
        taskMatchSearch = task.name
          ?.toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());
      }
      if (searchActive && filtersActive) {
        return taskMatchSearch && taskMatchFilters;
      } else if (searchActive && !filtersActive) {
        return taskMatchSearch;
      } else if (!searchActive && filtersActive) {
        return taskMatchFilters;
      } else {
        return false;
      }
    });
  }
  return filteredTasks;
};

export const sortTasks = (arrayToSort: Task[], orderToFollow: string[]) => {
  const arrayToUpdate = [...arrayToSort];

  arrayToUpdate.sort(function (a, b) {
    const A = a['id'],
      B = b['id'];

    if (orderToFollow.indexOf(A) > orderToFollow.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });

  return arrayToUpdate;
};
