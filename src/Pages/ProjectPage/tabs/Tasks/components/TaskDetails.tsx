import intl from 'react-intl-universal';
import {
  Typography,
  FormItem,
  TextField,
  Dropdown,
  TextArea,
  Datepicker,
  UsersPicker,
  NumericInput,
} from '@getsynapse/design-system';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import {
  getAvailableUsersForTaskAssignees,
  getFormattedTaskAssignees,
} from 'state/SingleTask/singleTaskSlice';
import { useMemo } from 'react';
import { TASK_FIELDS, TASK_STATUS, TASK_TYPES } from 'utils/constants';
import {
  objKeyAsString,
  Option,
  rangeDate,
  TaskDetailType,
  UserOption,
} from 'utils/customTypes';

type TaskDetailsProps = {
  requiredFieldsErrors: objKeyAsString;
  setData: (item: string, value: string | string[]) => void;
  data: TaskDetailType;
  isViewOnly?: boolean;
  canUpdateTask?: boolean;
};

const TaskDetails = ({
  requiredFieldsErrors,
  setData,
  data,
  isViewOnly = false,
  canUpdateTask = false,
}: TaskDetailsProps) => {
  const availableUsers = useSelector(getAvailableUsersForTaskAssignees);
  const selectedUsers = useSelector(getFormattedTaskAssignees);

  const statusOptions = useMemo(
    () =>
      Object.keys(TASK_STATUS).map((key) => ({
        label: intl.get(`TASKS.TASK_DETAIL_PAGE.STATUS_OPTIONS.${key}`),
        value: TASK_STATUS[key],
      })),
    []
  );

  const TaskTypesOptions = TASK_TYPES.map((category) => ({
    label: category,
    value: category,
  }));

  const updateOwners = (owners: UserOption[]) => {
    const ownersIds = owners.map((owner) => owner.value);
    setData(TASK_FIELDS.ASSIGNEE_UPDATE, ownersIds);
  };

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
  return (
    <div className='mt-8 border-b border-neutral-lighter pb-4'>
      <Typography variant='h5'>
        {intl.get('TASKS.TASK_DETAIL_PAGE.TITLE')}
      </Typography>

      <div className='flex w-full gap-x-10% px-px mt-8'>
        <div className='grid gap-y-4 w-2/4'>
          <FormItem
            label={intl.get('TASKS.TASK_DETAIL_PAGE.TASK_TITLE_LABEL')}
            helpText={
              requiredFieldsErrors?.name &&
              intl.get('TASKS.TASK_DETAIL_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.name ? 'error' : 'default',
            }}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.name ? 'error' : 'default',
            }}
          >
            <TextField
              value={data.name}
              variant='text'
              placeholder={intl.get(
                'TASKS.TASK_DETAIL_PAGE.TASK_TITLE_PLACEHOLDER'
              )}
              data-cy='task-title-input'
              disabled={isViewOnly}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setData(TASK_FIELDS.NAME, event.target.value)
              }
            />
          </FormItem>

          <FormItem>
            <Datepicker
              disabled={isViewOnly}
              className='w-full'
              canSelectRange
              startDate={data.start_date && new Date(data.start_date)}
              startDateLabel={intl.get(
                'TASKS.TASK_DETAIL_PAGE.START_DATE_LABEL'
              )}
              startDateLabelProps={{
                required: true,
                state: requiredFieldsErrors?.start_date ? 'error' : 'default',
              }}
              startDateError={
                requiredFieldsErrors?.start_date
                  ? intl.get('TASKS.TASK_DETAIL_PAGE.MISSING_INFO_ERROR')
                  : ''
              }
              endDate={data.due_date && new Date(data.due_date)}
              endDateLabel={intl.get('TASKS.TASK_DETAIL_PAGE.DUE_DATE_LABEL')}
              endDateError={
                requiredFieldsErrors?.due_date
                  ? intl.get('TASKS.TASK_DETAIL_PAGE.MISSING_INFO_ERROR')
                  : ''
              }
              endDateLabelProps={{
                required: true,
                state: requiredFieldsErrors?.due_date ? 'error' : 'default',
              }}
              size='large'
              onPickDate={(date: rangeDate) => {
                setData(TASK_FIELDS.START_DATE, date.startDate as string);
                setData(TASK_FIELDS.DUE_DATE, date.endDate as string);
              }}
              data-cy='task-date-input'
            />
          </FormItem>

          <FormItem
            label={intl.get('TASKS.TASK_DETAIL_PAGE.TASK_TYPE')}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.type ? 'error' : 'default',
            }}
            helpText={
              requiredFieldsErrors?.type &&
              intl.get('TASKS.TASK_DETAIL_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.type ? 'error' : 'default',
            }}
          >
            <Dropdown
              disabled={isViewOnly}
              onChange={(option: Option) =>
                setData(TASK_FIELDS.TASK_TYPE, option.value)
              }
              options={TaskTypesOptions}
              values={getInitialValueForDropDown(
                TaskTypesOptions,
                data['type']
              )}
              state={requiredFieldsErrors?.type ? 'error' : 'default'}
              triggerProps={{
                'data-cy': 'task-type',
                placeholder: intl.get(
                  'TASKS.ADD_TASK_MODAL.TASK_TYPE_PLACEHOLDER'
                ),
              }}
            />
          </FormItem>

          <FormItem
            component='div'
            label={intl.get('TASKS.TASK_DETAIL_PAGE.ESTIMATED_TIME_LABEL')}
            className='pb-px'
          >
            <div className='flex items-center'>
              <NumericInput
                disabled={isViewOnly}
                value={data.estimate_hours}
                placeholder={intl.get(
                  'TASKS.TASK_DETAIL_PAGE.ESTIMATED_TIME_PLACEHOLDER'
                )}
                divProps={{ className: 'w-11/12' }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setData(TASK_FIELDS.ESTIMATED_HOURS, event.target.value);
                }}
                data-cy='task-estimated-time-input'
              />
              <span className='pl-4'>
                {intl.get('TASKS.TASK_DETAIL_PAGE.HOURS_LABEL')}
              </span>
            </div>
          </FormItem>
        </div>

        <div className='w-2/4 grid gap-y-4'>
          <FormItem
            label={intl.get('TASKS.TASK_DETAIL_PAGE.TASK_DESCRIPTION_LABEL')}
          >
            <TextArea
              disabled={isViewOnly}
              value={data.description}
              textAreaProps={{
                placeholder: intl.get(
                  'TASKS.TASK_DETAIL_PAGE.TASK_DESCRIPTION_PLACEHOLDER'
                ),
                className: classNames('max-h-32', {}),
                'data-cy': 'task-description-input',
              }}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setData(TASK_FIELDS.DESCRIPTION, event.target.value)
              }
            />
          </FormItem>

          <FormItem
            label={intl.get('TASKS.TASK_DETAIL_PAGE.TASK_ASSIGNEE')}
            disabled={isViewOnly}
            helpText={
              requiredFieldsErrors?.assignedUsers &&
              intl.get('TASKS.TASK_DETAIL_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.assignedUsers ? 'error' : 'default',
            }}
          >
            <UsersPicker
              disabled={isViewOnly}
              triggerText={intl.get(
                'TASKS.ADD_TASK_MODAL.TASK_ASSIGNEE_PLACEHOLDER'
              )}
              usersList={availableUsers}
              selectedUsersList={selectedUsers}
              onChange={updateOwners}
              triggerProps={{
                'data-cy': 'task-users-picker',
              }}
            />
          </FormItem>

          <div
            className={classNames({
              'grid grid-cols-6 gap-6': data.status === TASK_STATUS.COMPLETED,
            })}
          >
            <FormItem
              label={intl.get('TASKS.TASK_DETAIL_PAGE.STATUS')}
              component='div'
              className={classNames({
                'col-span-6 sm:col-span-3':
                  data.status === TASK_STATUS.COMPLETED,
              })}
            >
              <Dropdown
                placeholder={intl.get(
                  'TASKS.TASK_DETAIL_PAGE.STATUS_PLACEHOLDER'
                )}
                options={statusOptions}
                disabled={
                  data.status === TASK_STATUS.ON_HOLD
                    ? !canUpdateTask
                    : isViewOnly
                }
                values={getInitialValueForDropDown(
                  statusOptions,
                  data['status']
                )}
                triggerProps={{ 'data-cy': 'task-status-input' }}
                onChange={(option: Option) =>
                  setData(TASK_FIELDS.STATUS, option.value)
                }
              />
            </FormItem>
            {data.status === TASK_STATUS.COMPLETED && (
              <FormItem
                component='div'
                label={intl.get('TASKS.TASK_DETAIL_PAGE.ACTUAL_HOURS')}
                className='pb-px col-span-6 sm:col-span-3'
              >
                <div className='flex items-center'>
                  <NumericInput
                    value={data.actual_hours}
                    data-cy='task-actual-hours'
                    placeholder={intl.get(
                      'TASKS.TASK_DETAIL_PAGE.ACTUAL_HOURS_PLACEHOLDER'
                    )}
                    divProps={{ className: 'w-11/12' }}
                    disabled={isViewOnly}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setData(TASK_FIELDS.ACTUAL_HOURS, event.target.value);
                    }}
                  />
                  <span className='pl-4'>
                    {intl.get('TASKS.TASK_DETAIL_PAGE.HOURS_LABEL')}
                  </span>
                </div>
              </FormItem>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
