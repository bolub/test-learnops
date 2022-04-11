import { objKeyAsString } from 'utils/customTypes';

export const taskFields = {
  name: '',
  start_date: '',
  due_date: '',
  type: '',
  assignedUsers: [],
  description: '',
  estimate_hours: '',
  status: '',
  actual_hours: '',
  completion_date: '',
  createdAt: '',
  deletedAt: '',
  data: null,
  disabled: false,
  id: '',
  index: '',
  milestone_id: '',
  organization_id: '',
  parentTask: '',
  parent_id: '',
  project_id: '',
  subTasks: [],
  updatedAt: '',
};

export const taskModalDefaultValues = {
  id: '',
  name: '',
  description: '',
  start_date: '',
  due_date: '',
  status: '',
  completion_date: '',
  estimate_hours: 0,
  actual_hours: '',
  organization_id: '',
  parent_id: '',
  project_id: '',
  createdAt: '',
  type: '',
  assignedUsers: [],
  disabled: false,
};

export const taskModalFields = {
  name: '',
  description: '',
  start_date: '',
  due_date: '',
  estimate_hours: 0,
  project_id: '',
  type: '',
  assignedUsers: [],
};

export const requiredFields = ['name', 'start_date', 'due_date', 'type'];

export const requiredFieldsErrorsMap: objKeyAsString = {
  name: false,
  start_date: false,
  due_date: false,
  type: false,
  assignedUsers: false,
};
