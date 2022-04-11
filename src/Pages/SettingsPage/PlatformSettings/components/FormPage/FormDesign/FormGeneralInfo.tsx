import { Fragment } from 'react';
import {
  Typography,
  FormItem,
  TextField,
  Dropdown,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { FormQuestionsProps } from './FormDesign';
import Divider from 'Atoms/Divider';
import CustomQuestions from './CustomQuestions/CustomQuestions';
import { REQUEST_SECTIONS } from 'utils/constants';

const FormGeneralInfo = ({
  formQuestions,
  setFormQuestions,
}: FormQuestionsProps) => (
  <Fragment>
    <Typography variant='h5' className='mt-8 text-neutral-black'>
      {intl.get('SETTINGS_PAGE.FORMS.DESIGN.DEFAULT_FIELDS')}
    </Typography>
    <form className='grid grid-cols-2 gap-x-20 gap-y-6 pt-6'>
      <div>
        <Typography
          variant='body2'
          weight='medium'
          className='text-neutral-black'
        >
          {intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUEST_NUMBER')}
        </Typography>
        <Typography className='mt-3 text-neutral-dark'>
          {intl.get('SETTINGS_PAGE.FORMS.DESIGN.SYSTEM_GENERATED_ID')}
        </Typography>
      </div>

      <FormItem
        label={intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.BUSINESS_UNIT')}
        labelProps={{ required: true }}
      >
        <Dropdown
          disabled
          onChange={() => {}}
          options={[]}
          values={[]}
          triggerProps={{
            className: 'h-10',
            placeholder: intl.get(
              'SETTINGS_PAGE.FORMS.DESIGN.SELECT_BUSINESS_UNIT'
            ),
          }}
        />
      </FormItem>

      <FormItem
        label={intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUEST_TITLE')}
        labelProps={{ required: true }}
      >
        <TextField
          disabled
          placeholder={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.ENTER', {
            field: intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUEST_TITLE'),
          })}
        />
      </FormItem>

      <FormItem
        label={intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUESTER_NAME')}
        labelProps={{ required: true }}
      >
        <TextField
          disabled
          placeholder={intl.get('SETTINGS_PAGE.FORMS.DESIGN.ENTER_REQUESTER')}
        />
      </FormItem>

      <FormItem
        label={intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.EXECUTIVE_SPONSOR')}
      >
        <TextField
          disabled
          placeholder={intl.get('SETTINGS_PAGE.FORMS.DESIGN.ENTER_SPONSOR')}
        />
      </FormItem>

      <FormItem
        label={intl.get(
          'REQUEST_PAGE.BASIC_DETAILS.FIELDS.COMPLIANCE_REQUIREMENT'
        )}
      >
        <Dropdown
          disabled
          onChange={() => {}}
          options={[]}
          values={[]}
          triggerProps={{
            className: 'h-10',
            placeholder: intl.get(
              'SETTINGS_PAGE.FORMS.DESIGN.SELECT_COMPLIANCE'
            ),
          }}
        />
      </FormItem>

      <FormItem
        label={intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.PRIORITY')}
        labelProps={{ required: true }}
      >
        <Dropdown
          disabled
          onChange={() => {}}
          options={[]}
          values={[]}
          triggerProps={{
            className: 'h-10',
            placeholder: intl.get('SETTINGS_PAGE.FORMS.DESIGN.SELECT_URGENCY'),
          }}
        />
      </FormItem>
    </form>
    <Divider />
    <CustomQuestions
      formQuestions={formQuestions}
      setFormQuestions={setFormQuestions}
      section={REQUEST_SECTIONS.BASIC_DETAILS}
    />
  </Fragment>
);

export default FormGeneralInfo;
