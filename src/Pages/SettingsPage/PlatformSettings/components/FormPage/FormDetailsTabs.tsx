import { useCallback } from 'react';
import { Tabs } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import FormSummary from './FormSummary';
import FormDesign from './FormDesign/FormDesign';
import {
  Form,
  UserAvatars,
  FormOption,
  RequestQuestion,
} from 'utils/customTypes';

type FormDetailsProps = {
  formObj: Form;
  handleChangeField: (
    value: string | string[] | boolean,
    pathToUpdate: string
  ) => void;
  ldUsers: UserAvatars[];
  requestTypeOptions: FormOption[];
  onTabChange?: (currentIndex: number) => void;
  currentTab?: number;
  formQuestions: RequestQuestion[];
  setFormQuestions: React.Dispatch<React.SetStateAction<RequestQuestion[]>>;
  errors?: {
    title: boolean;
    description: boolean;
    requestType: boolean;
  };
};

const FormDetailsTabs = ({
  formObj,
  handleChangeField,
  ldUsers,
  requestTypeOptions,
  onTabChange = () => {},
  currentTab = 0,
  formQuestions,
  setFormQuestions,
  errors,
}: FormDetailsProps) => {
  const handleTabChange = useCallback(
    (index: number) => {
      onTabChange(index);
    },
    [onTabChange]
  );

  return (
    <Tabs
      data={[
        {
          label: intl.get('SETTINGS_PAGE.FORMS.SUMMARY.TITLE'),
          content: (
            <FormSummary
              formObj={formObj}
              handleChangeField={handleChangeField}
              ldUsers={ldUsers}
              requestTypeOptions={requestTypeOptions}
              errors={errors}
            />
          ),
        },
        {
          label: intl.get('SETTINGS_PAGE.FORMS.DESIGN.TITLE'),
          content: (
            <FormDesign
              formQuestions={formQuestions}
              setFormQuestions={setFormQuestions}
            />
          ),
        },
      ]}
      index={currentTab}
      onChange={handleTabChange}
      type='tab'
    />
  );
};

export default FormDetailsTabs;
