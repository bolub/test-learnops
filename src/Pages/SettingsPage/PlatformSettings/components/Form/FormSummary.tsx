import { useMemo, ChangeEvent } from 'react';
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
};

const FormSummary = ({
  formObj,
  handleChangeField,
  ldUsers,
  requestTypeOptions,
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

  const changeOwners = (owners: UserOption[]) => {
    const ownersIds = owners.map((owner) => owner.value);
    handleChangeField(ownersIds, 'owners');
  };

  return (
    <div className='h-screen'>
      <Typography variant='h5' className='mt-8 text-neutral-black'>
        {intl.get('SETTINGS_PAGE.FORMS.SUMMARY.TITLE')}
      </Typography>
      <Typography variant='caption' className='mb-4 text-neutral'>
        {intl.get('SETTINGS_PAGE.FORMS.SUMMARY.SUBTITLE')}
      </Typography>
      <form className='grid grid-cols-2 gap-x-20 gap-y-6 pt-6'>
        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.FORM_TITLE')}
          labelProps={{ required: true }}
        >
          <TextField
            placeholder={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.ENTER', {
              field: intl.get('SETTINGS_PAGE.FORMS.SUMMARY.FORM_TITLE'),
            })}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChangeField(e.target.value, 'title')
            }
            defaultValue={get(formObj, 'title')}
          />
        </FormItem>

        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.DEFAULT_OWNERS')}
        >
          <UsersPicker
            usersList={ldUsers}
            onChange={changeOwners}
            triggerText={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.REQUEST_OWNER')}
            maxLimit={2}
            triggerProps={{
              type: 'button',
            }}
          />
        </FormItem>

        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.REQUEST_TYPE')}
          labelProps={{ required: true }}
        >
          <Dropdown
            onChange={(option: Option) =>
              handleChangeField(option.value, 'request_type')
            }
            options={requestTypeOptions}
            values={formTypeOption}
            triggerProps={{
              'data-testid': 'team-parent_dropdown',
              className: 'h-10',
              placeholder: intl.get(
                'SETTINGS_PAGE.FORMS.SUMMARY.SELECT_REQUEST_TYPE'
              ),
            }}
          />
        </FormItem>

        <FormItem
          label={intl.get('SETTINGS_PAGE.FORMS.SUMMARY.DESCRIPTION')}
          labelProps={{ required: true }}
        >
          <TextArea
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleChangeField(e.target.value, 'form_description')
            }
            textAreaProps={{
              'data-testid': 'team-description_input',
              className: 'h-30',
              placeholder: intl.get(
                'SETTINGS_PAGE.FORMS.SUMMARY.ENTER_DESCRIPTION'
              ),
              defaultValue: get(formObj, 'form_description'),
            }}
          />
        </FormItem>
      </form>
    </div>
  );
};

export default FormSummary;
