import { Fragment } from 'react';
import { Typography, FormItem, TextArea } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import Divider from 'Atoms/Divider';
import CustomQuestions from './CustomQuestions/CustomQuestions';
import { REQUEST_SECTIONS } from 'utils/constants';
import { FormQuestionsProps } from './FormDesign';

const FormRequestDetails = ({
  formQuestions,
  setFormQuestions,
}: FormQuestionsProps) => (
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
    <Divider />
    <CustomQuestions
      formQuestions={formQuestions}
      section={REQUEST_SECTIONS.REQUEST_DETAILS}
      setFormQuestions={setFormQuestions}
    />
  </Fragment>
);

export default FormRequestDetails;
