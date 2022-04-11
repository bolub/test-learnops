import { useMemo, ChangeEvent, Fragment } from 'react';
import {
  Typography,
  FormItem,
  TextField,
  UsersPicker,
  TextArea,
  Dropdown,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {
  Form,
  UserAvatars,
  FormOption,
  Option,
  UserOption,
} from 'utils/customTypes';

type FormSummaryProps = {
  formObj: Form;
  handleChangeField: (
    value: string | string[] | boolean,
    pathToUpdate: string
  ) => void;
  ldUsers: UserAvatars[];
  requestTypeOptions: FormOption[];
  errors?: {
    title: boolean;
    description: boolean;
    requestType: boolean;
  };
};

const FormSummary = ({
  formObj,
  handleChangeField,
  ldUsers,
  requestTypeOptions,
  errors = { title: false, description: false, requestType: false },
}: FormSummaryProps) => {
  const formTypeOption = useMemo(() => {
    const requestType = get(formObj, 'request_type');
    if (requestType) {
      const option = requestTypeOptions.find(
        (option) => option.value === get(formObj, 'request_type')
      );
      if (option) {
        return [option];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [formObj, requestTypeOptions]);

  const selectedOwners = useMemo(() => {
    const owners = get(formObj, 'owners', []);
    if (!isEmpty(owners)) {
      const options = ldUsers.filter((option) =>
        owners.find((owner) => (get(owner, 'id') || owner) === option.value)
      );
      return options || [];
    } else {
      return [];
    }
  }, [formObj, ldUsers]);

  const changeOwners = (owners: UserOption[]) => {
    const ownersIds = owners.map((owner) => owner.value);
    handleChangeField(ownersIds, 'owners');
  };

  return (
    <Fragment>
      <Typography variant='h5' className='mt-8 text-neutral-black'>
        {intl.get('SETTINGS_PAGE.FORMS.SUMMARY.TITLE')}
      </Typography>
      <Typography variant='caption' className='mb-4 text-neutral'>
        {intl.get('SETTINGS_PAGE.FORMS.SUMMARY.SUBTITLE')}
      </Typography>
      <form className='grid grid-cols-2 gap-x-20 gap-y-6 pt-6'>
        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.FORM_TITLE')}
          labelProps={{
            required: true,
            state: errors.title ? 'error' : 'default',
          }}
          helpText={
            errors.title &&
            intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
          }
          helpTextProps={{
            state: errors.title ? 'error' : 'default',
          }}
        >
          <TextField
            placeholder={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.ENTER', {
              field: intl.get('SETTINGS_PAGE.FORMS.SUMMARY.FORM_TITLE'),
            })}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChangeField(e.target.value, 'title')
            }
            value={get(formObj, 'title') || ''}
            state={errors.title ? 'error' : 'default'}
            data-cy='form-title_input'
          />
        </FormItem>

        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.DEFAULT_OWNERS')}
        >
          <UsersPicker
            usersList={ldUsers}
            onChange={changeOwners}
            selectedUsersList={selectedOwners}
            triggerText={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.REQUEST_OWNER')}
            maxLimit={5}
            triggerProps={{ type: 'button', 'data-cy': 'form-owner_selector' }}
          />
        </FormItem>

        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.REQUEST_TYPE')}
          labelProps={{
            required: true,
            state: errors.requestType ? 'error' : 'default',
          }}
          helpText={
            errors.requestType &&
            intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
          }
          helpTextProps={{
            state: errors.requestType ? 'error' : 'default',
          }}
        >
          <Dropdown
            onChange={(option: Option) =>
              handleChangeField(option.value, 'request_type')
            }
            options={requestTypeOptions}
            values={formTypeOption}
            triggerProps={{
              className: 'h-10',
              placeholder: intl.get(
                'SETTINGS_PAGE.FORMS.SUMMARY.SELECT_REQUEST_TYPE'
              ),
              state: errors.requestType ? 'error' : 'default',
              'data-cy': 'form-request_type',
            }}
          />
        </FormItem>

        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.DESCRIPTION')}
          labelProps={{
            required: true,
            state: errors.description ? 'error' : 'default',
          }}
          helpText={
            errors.description &&
            intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
          }
          helpTextProps={{
            state: errors.description ? 'error' : 'default',
          }}
        >
          <TextArea
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleChangeField(e.target.value, 'form_description')
            }
            value={get(formObj, 'form_description') || ''}
            textAreaProps={{
              className: 'h-30',
              placeholder: intl.get(
                'SETTINGS_PAGE.FORMS.SUMMARY.ENTER_DESCRIPTION'
              ),
              'data-cy': 'form-description_input',
            }}
            state={errors.description ? 'error' : 'default'}
          />
        </FormItem>
      </form>
    </Fragment>
  );
};

export default FormSummary;
