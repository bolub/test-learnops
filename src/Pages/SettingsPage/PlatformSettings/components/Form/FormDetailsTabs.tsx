import { Tabs } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import FormSummary from './FormSummary';
import FormDesign from './FormDesign/FormDesign';
import { Form, UserAvatars, FormOption, Option } from 'utils/customTypes';

type FormDetailsProps = {
  formObj: Form;
  handleChangeField: (
    value: string | string[] | boolean,
    pathToUpdate: string
  ) => void;
  ldUsers: UserAvatars[];
  requestTypeOptions: FormOption[];
  businessTeamOptions: Option[];
};

const FormDetailsTabs = ({
  formObj,
  handleChangeField,
  ldUsers,
  requestTypeOptions,
  businessTeamOptions,
}: FormDetailsProps) => {
  return (
    <Tabs
      className='bg-neutral-white mx-6 my-4 p-3.5'
      data={[
        {
          label: intl.get('SETTINGS_PAGE.FORMS.SUMMARY.TITLE'),
          content: (
            <FormSummary
              formObj={formObj}
              handleChangeField={handleChangeField}
              ldUsers={ldUsers}
              requestTypeOptions={requestTypeOptions}
            />
          ),
        },
        {
          label: intl.get('SETTINGS_PAGE.FORMS.DESIGN.TITLE'),
          content: (
            <FormDesign
              formObj={formObj}
              handleChangeField={handleChangeField}
              businessTeamOptions={businessTeamOptions}
            />
          ),
        },
      ]}
      defaultIndex={0}
      type='tab'
      disabled={false}
    />
  );
};

export default FormDetailsTabs;
