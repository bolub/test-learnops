import isEmpty from 'lodash/isEmpty';
import {
  requiredFields,
  requiredFieldsErrorsMap,
} from '../../NewProjectPage/helpers/types';
import { objKeyAsString, NewProject } from 'utils/customTypes';
import { NEW_PROJECT_FORM_FIELDS, PROJECT_STATUS } from 'utils/constants';

export const validateRequiredFields = (
  projectData: NewProject,
  isUpdating: boolean = false
) => {
  let canSave = true;
  const shouldValidateActualCompletionField =
    isUpdating && projectData.status === PROJECT_STATUS.COMPLETED;
  const fieldsToValidate = [...requiredFields];
  const errorsMap: objKeyAsString = { ...requiredFieldsErrorsMap };
  if (shouldValidateActualCompletionField) {
    fieldsToValidate.push(NEW_PROJECT_FORM_FIELDS.ACTUAL_COMPLETION_DATE);
    errorsMap[NEW_PROJECT_FORM_FIELDS.ACTUAL_COMPLETION_DATE] = false;
  }
  const dateFields = [
    NEW_PROJECT_FORM_FIELDS.START_DATE,
    NEW_PROJECT_FORM_FIELDS.TARGET_COMPLETION_DATE,
    ...[
      shouldValidateActualCompletionField &&
        NEW_PROJECT_FORM_FIELDS.ACTUAL_COMPLETION_DATE,
    ],
  ];
  fieldsToValidate.forEach((field) => {
    if (!dateFields.includes(field) && isEmpty(projectData[field])) {
      canSave = false;
      errorsMap[field] = true;
    } else {
      if (
        !(projectData[field] instanceof Date) &&
        isEmpty(projectData[field])
      ) {
        canSave = false;
        errorsMap[field] = true;
      }
    }
  });

  return { canSave, errorsMap };
};
