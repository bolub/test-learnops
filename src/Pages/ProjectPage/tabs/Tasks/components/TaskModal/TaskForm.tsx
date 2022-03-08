import intl from 'react-intl-universal';
import { ChangeEvent, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLDUsers,
  selectLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import { Option, UserOption, Task } from 'utils/customTypes';
import { TASK_FIELDS, TASK_TYPES } from 'utils/constants';
import isEmpty from 'lodash/isEmpty';
import {
  Datepicker,
  Dropdown,
  FormItem,
  NumericInput,
  TextArea,
  TextField,
  Typography,
  UsersPicker,
} from '@getsynapse/design-system';

const TaskForm: React.FC<{
  canCreateTask: boolean;
  duplicateTaskCheck: boolean;
  taskData: Task;
  projectId: string;
  setTaskFields: React.Dispatch<React.SetStateAction<any>>;
  setCanCreateTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  canCreateTask,
  duplicateTaskCheck,
  taskData,
  projectId,
  setCanCreateTask,
  setTaskFields = () => {},
}) => {
  const dispatch = useDispatch();
  const ldUsersSelector = useSelector(selectLDUsers);

  useEffect(() => {
    dispatch(getLDUsers());
  }, [dispatch]);

  const ldUsers = useMemo(
    () =>
      ldUsersSelector.map((user) => {
        return {
          label: `${user.data.firstName} ${user.data.lastName}`,
          avatar: {
            imageSrc: user.avatar_url,
            initial: `${user.data.firstName.charAt(
              0
            )}${user.data.lastName.charAt(0)}`,
          },
          value: user.id,
        };
      }),
    [ldUsersSelector]
  );

  const getInitialValueForDropDown = (
    options: Option[],
    values: string[] | string | undefined
  ) => {
    if (!values) {
      return [];
    }
    return options.filter(
      (option) => values === option.value || values.includes(option.value)
    );
  };

  const [fieldsValues, setFieldsValues] = useState({
    name: duplicateTaskCheck
      ? intl.get('TASKS.TABLE.COPY_OF_PLACEHOLDER').concat(' ', taskData?.name)
      : taskData?.name,
    type: taskData?.type,
    description: taskData?.description,
    start_date: '',
    due_date: '',
    estimate_hours: taskData?.estimate_hours || 0,
    project_id: projectId,
    assignedUserIds: [],
  });

  useEffect(() => {
    setFieldsValues((prevData) => ({
      ...prevData,
      name: duplicateTaskCheck
        ? intl
            .get('TASKS.TABLE.COPY_OF_PLACEHOLDER')
            .concat(' ', taskData?.name)
        : taskData?.name,
      type: taskData.type,
      description: taskData.description,
      estimate_hours: taskData?.estimate_hours || 0,
    }));
  }, [setFieldsValues, taskData, duplicateTaskCheck]);

  const updateValue = (newValue: any) => {
    setFieldsValues((prevData) => ({ ...prevData, ...newValue }));
  };

  const checkEmpty = (value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return isEmpty(value);
    }
    return value == null || value === '';
  };

  const TaskTypesOptions = TASK_TYPES.map((category) => ({
    label: category,
    value: category,
  }));

  const handlePickOwners = (owners: UserOption[]) => {
    const ownersIds = owners.map((owner) => owner.value);
    updateValue({ [TASK_FIELDS.ASSIGNEE_ADD]: ownersIds });
  };

  useEffect(() => {
    const { description, estimate_hours, ...toCheck } = fieldsValues;
    if (!Object.values(toCheck).some((value) => checkEmpty(value))) {
      !canCreateTask && setCanCreateTask(true);
    } else {
      canCreateTask && setCanCreateTask(false);
    }
  }, [canCreateTask, fieldsValues, setCanCreateTask]);

  useEffect(() => {
    setTaskFields(fieldsValues);
  }, [setTaskFields, fieldsValues]);

  return (
    <div className='flex flex-col'>
      <Typography>{intl.get('TASKS.ADD_TASK_MODAL.SUBTITLE')}</Typography>

      <div className='mt-4 flex w-full gap-x-10 px-px'>
        <div className='grid gap-y-4 w-2/4'>
          <FormItem
            labelPurops={{ required: true }}
            label={intl.get('TASKS.ADD_TASK_MODAL.TASK_TITLE')}
          >
            <TextField
              defaultValue={fieldsValues.name}
              onChange={(e: any) =>
                updateValue({ [TASK_FIELDS.NAME]: e.target.value })
              }
              placeholder={intl.get(
                'TASKS.ADD_TASK_MODAL.TASK_TITLE_PLACEHOLDER'
              )}
              className='w-full'
              data-cy='task_title-name'
            />
          </FormItem>

          <FormItem
            label={intl.get('TASKS.ADD_TASK_MODAL.TASK_TYPE')}
            labelProps={{ required: true }}
          >
            <Dropdown
              values={getInitialValueForDropDown(
                TaskTypesOptions,
                taskData ? taskData?.type : ''
              )}
              onChange={(option: Option) =>
                updateValue({ [TASK_FIELDS.TASK_TYPE]: option.value })
              }
              options={TaskTypesOptions}
              triggerProps={{
                'data-cy': 'task_type',
                placeholder: intl.get(
                  'TASKS.ADD_TASK_MODAL.TASK_TYPE_PLACEHOLDER'
                ),
              }}
            />
          </FormItem>

          <FormItem>
            <Datepicker
              className='flex justify-evenly w-full'
              canSelectRange={true}
              startDateLabel={intl.get('TASKS.ADD_TASK_MODAL.START_DATE')}
              size='large'
              onPickDate={(dates: any) =>
                updateValue({
                  [TASK_FIELDS.START_DATE]: dates.startDate,
                  [TASK_FIELDS.DUE_DATE]: dates.endDate,
                })
              }
              endDateLabel={intl.get('TASKS.ADD_TASK_MODAL.END_DATE')}
              data-cy='task-input_date'
              startDateLabelProps={{
                required: true,
              }}
              endDateLabelProps={{
                required: true,
              }}
            />
          </FormItem>

          <FormItem
            component='div'
            label={intl.get('TASKS.ADD_TASK_MODAL.ESTIMATED_TIME')}
            className='pb-px'
          >
            <div className='flex items-center'>
              <NumericInput
                data-cy='estimated_time'
                placeholder={intl.get(
                  'TASKS.ADD_TASK_MODAL.ESTIMATED_TIME_PLACEHOLDER'
                )}
                divProps={{ className: 'w-11/12' }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  updateValue({
                    [TASK_FIELDS.ESTIMATED_HOURS]: event.target.value,
                  });
                }}
                defaultValue={fieldsValues.estimate_hours}
              />
              <span className='pl-4'>hrs</span>
            </div>
          </FormItem>
        </div>

        <div className='w-2/4'>
          <FormItem label={intl.get('TASKS.ADD_TASK_MODAL.TASK_DESCRIPTION')}>
            <TextArea
              textAreaProps={{
                className: 'max-h-30',
                placeholder: intl.get(
                  'TASKS.ADD_TASK_MODAL.TASK_DESCRIPTION_PLACEHOLDER'
                ),
                'data-cy': 'task_description',
                defaultValue: fieldsValues.description,
              }}
              onChange={(e) =>
                updateValue({ [TASK_FIELDS.DESCRIPTION]: e.target.value })
              }
            />
          </FormItem>

          <FormItem
            label={intl.get('TASKS.ADD_TASK_MODAL.TASK_ASSIGNEE')}
            className='text-primary-light font-medium mt-4'
            labelProps={{ required: true }}
          >
            <UsersPicker
              triggerText={intl.get(
                'TASKS.ADD_TASK_MODAL.TASK_ASSIGNEE_PLACEHOLDER'
              )}
              usersList={ldUsers}
              triggerProps={{
                'data-cy': 'user_picker',
              }}
              onChange={handlePickOwners}
            />
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
