import { Dispatch, SetStateAction } from 'react';
import { NewProject, Option } from 'utils/customTypes';
import { NEW_PROJECT_FORM_FIELDS } from 'utils/constants';

const handleFieldChange = (
  fieldName: string,
  fieldValue: any,
  setData: Dispatch<SetStateAction<NewProject>>
) => {
  let updatedData = {};
  switch (fieldName) {
    case NEW_PROJECT_FORM_FIELDS.TARGET_LAUNCH_DATE:
      updatedData = {
        [NEW_PROJECT_FORM_FIELDS.TARGET_LAUNCH_DATE]: fieldValue.startDate,
      };
      break;
    case NEW_PROJECT_FORM_FIELDS.ACTUAL_COMPLETION_DATE:
      updatedData = {
        [NEW_PROJECT_FORM_FIELDS.ACTUAL_COMPLETION_DATE]: fieldValue.startDate,
      };
      break;
    case NEW_PROJECT_FORM_FIELDS.START_DATE:
      const { startDate, endDate } = fieldValue;
      updatedData = {
        [NEW_PROJECT_FORM_FIELDS.START_DATE]: startDate,
        [NEW_PROJECT_FORM_FIELDS.TARGET_COMPLETION_DATE]: endDate,
      };
      break;
    case NEW_PROJECT_FORM_FIELDS.TEAMS:
      updatedData = {
        learningTeams: fieldValue.map((option: Option) => option.value),
      };
      break;
    case NEW_PROJECT_FORM_FIELDS.PROCESS:
      updatedData = {
        [fieldName]: fieldValue,
        [NEW_PROJECT_FORM_FIELDS.STAGE]: '',
      };
      break;
    case NEW_PROJECT_FORM_FIELDS.VENDORS:
      updatedData = {
        vendors: fieldValue.map((option: Option) => option.value),
      };
      break;
    default:
      updatedData = {
        [fieldName]: fieldValue,
      };
  }
  setData((prevData) => ({ ...prevData, ...updatedData }));
};

export default handleFieldChange;
