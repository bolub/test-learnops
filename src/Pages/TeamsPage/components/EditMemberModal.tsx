import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import {
  NumericInput,
  Input,
  FormItem,
  Modal,
} from '@getsynapse/design-system';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { JOB_FUNCTIONS, LANGUAGES, UPDATE_MEMBER_FORM } from 'utils/constants';
import { FormOption, Owner } from 'utils/customTypes';
import MultiSelectDropdown from 'Organisms/MultiSelectDropdow/MultiSelectDropdown';
import MemberInfo from './MemberInfo';

type EditMemberModalProps = {
  user: Owner;
  onUserUpdate: (id: string, newUser: Owner) => void;
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
};

const EditMemberModal = ({
  user,
  onUserUpdate,
  isOpen = false,
  setIsOpen,
}: EditMemberModalProps) => {
  const [data, setData] = useState<Owner>();

  const jobFunctionOptions: FormOption[] = useMemo(() => {
    return JOB_FUNCTIONS.map((job) => ({
      value: job,
      label: intl.get(`TEAMS.JOB_FUNCTIONS.${job}`),
    }));
  }, []);

  const defaultJobOptions: FormOption[] = useMemo(() => {
    const userJobs = get(user, 'data.jobFunctions');
    if (userJobs) {
      return jobFunctionOptions.filter((option) => {
        return userJobs.find((jobOption: string) => jobOption === option.value);
      });
    } else {
      return [];
    }
  }, [jobFunctionOptions, user]);

  const langOptions = useMemo(() => {
    return LANGUAGES.map((language) => ({
      value: language,
      label: intl.get(`LANGUAGES.${language}`),
    }));
  }, []);

  const defaultLangOptions: FormOption[] = useMemo(() => {
    const userLang = get(user, 'data.languages');
    if (userLang) {
      return langOptions.filter((option) => {
        return userLang.find(
          (langOption: string) => langOption === option.value
        );
      });
    } else {
      return [];
    }
  }, [langOptions, user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isEmpty(data) && data) {
      onUserUpdate(get(user, 'id', ''), {
        ...user,
        ...data,
        data: { ...user.data, ...data.data },
      });
    }
    setIsOpen(false);
  };

  const handleInputChange = (name: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      data: { ...prevData?.data, [name]: value },
    }));
  };

  const handleDropdownChange = (name: string, options: FormOption[]) => {
    const formattedOptions = options.map((option) => option.value);
    setData((prevData) => ({
      ...prevData,
      data: { ...prevData?.data, [name]: formattedOptions },
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      aria-label='update-team-member'
      data-cy='update-team-member'
      title={`${get(user, 'data.firstName')} ${get(user, 'data.lastName')}`}
      size='large'
      actionButtons={[
        {
          children: intl.get('TEAMS.SAVE'),
          variant: 'primary',
          'data-cy': 'confirm-button',
          type: 'submit',
          form: UPDATE_MEMBER_FORM,
          disabled: isEmpty(data),
        },
        {
          children: intl.get('PROJECT_DETAIL.DELETE_PROJECT.CANCEL'),
          variant: 'tertiary',
          onClick: () => setIsOpen(false),
          'data-cy': 'cancel-button',
        },
      ]}
    >
      <MemberInfo user={user} />
      <form
        className='grid grid-cols-2 gap-x-10 gap-y-4 mt-10'
        onSubmit={handleSubmit}
        id={UPDATE_MEMBER_FORM}
      >
        <FormItem
          component='div'
          label={intl.get('TEAMS.UPDATE_MODAL.WEEKLY_CAPACITY')}
        >
          <div className='flex items-center'>
            <NumericInput
              defaultValue={get(user, 'default_capacity', 0)}
              divProps={{ className: 'w-11/12' }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setData((prevData) => ({
                  ...prevData,
                  default_capacity: Number(event.target.value),
                }));
              }}
            />
            <span className='pl-4'>{intl.get('TEAMS.UPDATE_MODAL.HRS')}</span>
          </div>
        </FormItem>

        <FormItem
          component='div'
          label={intl.get('TEAMS.UPDATE_MODAL.JOB_FUNCTIONS')}
        >
          <MultiSelectDropdown
            onChange={(options: FormOption[]) =>
              handleDropdownChange('jobFunctions', options)
            }
            options={jobFunctionOptions}
            values={defaultJobOptions}
          />
        </FormItem>

        <FormItem
          component='div'
          label={intl.get('TEAMS.UPDATE_MODAL.LANGUAGES')}
        >
          <MultiSelectDropdown
            onChange={(options: FormOption[]) =>
              handleDropdownChange('languages', options)
            }
            options={langOptions}
            values={defaultLangOptions}
          />
        </FormItem>

        <FormItem component='div' label={intl.get('TEAMS.UPDATE_MODAL.SKILLS')}>
          <Input
            defaultValue={get(user, 'data.skills')}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleInputChange('skills', event.target.value)
            }
            data-cy='skills-input'
          />
        </FormItem>
      </form>
    </Modal>
  );
};

export default EditMemberModal;
