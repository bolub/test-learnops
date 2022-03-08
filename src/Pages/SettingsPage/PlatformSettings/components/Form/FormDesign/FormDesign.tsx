import { Fragment } from 'react';
import {
  Typography,
  Tabs,
  FormItem,
  TextArea,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import FormGeneralInfo from './FormGeneralInfo';
import FormInternalOnly from './FormInternalOnly';
import { Form, FormOption } from 'utils/customTypes';

type FormDesignProps = {
  formObj: Form;
  handleChangeField: (
    value: string | string[] | boolean,
    pathToUpdate: string
  ) => void;
  businessTeamOptions: FormOption[];
};

const FormDesign = ({
  formObj,
  handleChangeField,
  businessTeamOptions,
}: FormDesignProps) => {
  return (
    <div className='h-screen'>
      <Typography variant='h5' className='mt-8 text-neutral-black'>
        {intl.get('SETTINGS_PAGE.FORMS.DESIGN.TITLE')}
      </Typography>
      <Typography variant='caption' className='mb-4 text-neutral'>
        {intl.get('SETTINGS_PAGE.FORMS.DESIGN.SUBTITLE')}
      </Typography>

      <Tabs
        className='bg-neutral-white pt-4'
        tabListProps={{ className: 'shadow-header' }}
        data={[
          {
            label: intl.get('SETTINGS_PAGE.FORMS.DESIGN.GENERAL_INFO'),
            content: (
              <FormGeneralInfo
                formObj={formObj}
                handleChangeField={handleChangeField}
                businessTeamOptions={businessTeamOptions}
              />
            ),
          },
          {
            label: intl.get('REQUEST_PAGE.TABS.REQUEST'),
            content: (
              <Fragment>
                <Typography variant='h5' className='mt-8 text-neutral-black'>
                  {intl.get('SETTINGS_PAGE.FORMS.DESIGN.DEFAULT_FIELDS')}
                </Typography>
                <form className='grid grid-cols-2 gap-x-20 gap-y-6 pt-6'>
                  <FormItem
                    label={intl.get(
                      'REQUEST_PAGE.REQUEST_DETAILS.FIELDS.REQUEST_DESCRIPTION'
                    )}
                  >
                    <TextArea
                      disabled
                      value={''}
                      onChange={() => {}}
                      textAreaProps={{
                        'data-testid': 'team-description_input',
                        className: 'h-30',
                        placeholder: intl.get(
                          'SETTINGS_PAGE.FORMS.DESIGN.ENTER_DESCRIPTION'
                        ),
                      }}
                    />
                  </FormItem>
                </form>
              </Fragment>
            ),
          },
          {
            label: intl.get('REQUEST_PAGE.L_D_SECTION.TITLE'),
            content: <FormInternalOnly />,
          },
        ]}
        defaultIndex={0}
        type='subHeader'
        disabled={false}
      />
    </div>
  );
};

export default FormDesign;
