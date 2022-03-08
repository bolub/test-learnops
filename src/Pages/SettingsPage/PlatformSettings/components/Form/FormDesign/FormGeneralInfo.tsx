import { Fragment } from 'react';
import {
  Typography,
  FormItem,
  TextField,
  Dropdown,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { Form, FormOption } from 'utils/customTypes';

type FormGeneralInfoProps = {
  formObj: Form;
  handleChangeField: (
    value: string | string[] | boolean,
    pathToUpdate: string
  ) => void;
  businessTeamOptions: FormOption[];
};
const FormGeneralInfo = ({
  formObj,
  handleChangeField,
  businessTeamOptions,
}: FormGeneralInfoProps) => {
  return (
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
            options={businessTeamOptions}
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
              field: intl.get(
                'REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUEST_TITLE'
              ),
            })}
            onChange={() => {}}
            defaultValue={''}
          />
        </FormItem>

        <FormItem
          label={intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUESTER_NAME')}
          labelProps={{ required: true }}
        >
          <TextField
            disabled
            placeholder={intl.get('SETTINGS_PAGE.FORMS.DESIGN.ENTER_REQUESTER')}
            onChange={() => {}}
            defaultValue={''}
          />
        </FormItem>

        <FormItem
          label={intl.get(
            'REQUEST_PAGE.BASIC_DETAILS.FIELDS.EXECUTIVE_SPONSOR'
          )}
        >
          <TextField
            disabled
            placeholder={intl.get('SETTINGS_PAGE.FORMS.DESIGN.ENTER_SPONSOR')}
            onChange={() => {}}
            defaultValue={''}
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
        >
          <Dropdown
            disabled
            onChange={() => {}}
            options={[]}
            values={[]}
            triggerProps={{
              className: 'h-10',
              placeholder: intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.SELECT_URGENCY'
              ),
            }}
          />
        </FormItem>
      </form>
    </Fragment>
  );
};

export default FormGeneralInfo;
