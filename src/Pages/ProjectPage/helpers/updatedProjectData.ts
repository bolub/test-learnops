import { PROJECT_STATUS } from 'utils/constants';
import { NewProject, objKeyAsString } from 'utils/customTypes';
import { isEqual, isEmpty, transform } from 'lodash';

export const getDifference = (newObject: object, baseObject: object) => {
  return transform(newObject, (result: objKeyAsString, value, key) => {
    if (!isEqual(value, baseObject[key])) {
      result[key] = newObject[key];
    }
  });
};

export const removeUnnecessaryStatusData = (
  newProject: objKeyAsString,
  baseProject: NewProject
) => {
  let updatedProject = { ...newProject };
  if (
    newProject.status !== PROJECT_STATUS.ON_HOLD &&
    !isEmpty(baseProject.hold_reason)
  ) {
    updatedProject = { ...updatedProject, hold_reason: '' };
  }

  if (
    newProject.status !== PROJECT_STATUS.COMPLETED &&
    newProject.status !== PROJECT_STATUS.CLOSED &&
    !isEmpty(baseProject.actualDate)
  ) {
    updatedProject = { ...updatedProject, actualDate: null };
  }

  if (
    newProject.status !== PROJECT_STATUS.CANCELED &&
    !isEmpty(baseProject.cancel_reason)
  ) {
    updatedProject = { ...updatedProject, cancel_reason: '' };
  }
  return updatedProject;
};

export const getUpdatedProjectData = (
  newProject: NewProject,
  baseProject: NewProject
) => {
  let updatedProject = { ...newProject };
  if (newProject.status !== baseProject.status) {
    updatedProject = {
      ...updatedProject,
      ...removeUnnecessaryStatusData(newProject, baseProject),
    };
  }
  const updatedProjectData = getDifference(updatedProject, baseProject);
  return { updatedProjectData };
};
