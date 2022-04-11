import { Fragment } from 'react';
import { Typography, Tabs } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import FormGeneralInfo from './FormGeneralInfo';
import FormInternalOnly from './FormInternalOnly';
import { RequestQuestion } from 'utils/customTypes';
import FormRequestDetails from './FormRequestDetails';

export type FormQuestionsProps = {
  formQuestions: RequestQuestion[];
  setFormQuestions: React.Dispatch<React.SetStateAction<RequestQuestion[]>>;
};

const FormDesign = ({
  formQuestions,
  setFormQuestions,
}: FormQuestionsProps) => (
  <Fragment>
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
              formQuestions={formQuestions}
              setFormQuestions={setFormQuestions}
            />
          ),
        },
        {
          label: intl.get('REQUEST_PAGE.TABS.REQUEST'),
          content: (
            <FormRequestDetails
              formQuestions={formQuestions}
              setFormQuestions={setFormQuestions}
            />
          ),
        },
        {
          label: intl.get('REQUEST_PAGE.L_D_SECTION.TITLE'),
          content: (
            <FormInternalOnly
              formQuestions={formQuestions}
              setFormQuestions={setFormQuestions}
            />
          ),
        },
      ]}
      defaultIndex={0}
      type='subHeader'
      disabled={false}
    />
  </Fragment>
);

export default FormDesign;
