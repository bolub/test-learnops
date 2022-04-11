import React, { useMemo, useState, ChangeEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import {
  Typography,
  Button,
  FormItem,
  TextField,
  Datepicker,
  Dropdown,
} from '@getsynapse/design-system';
import {
  rangeDateType,
  NewAssignmentFormValues,
  FormOption,
} from 'utils/customTypes';
import { getOriginalProjectData } from 'state/Project/projectSlice';
import ResourceAllocationAPI from 'state/ResourceAllocation/resourceAllocationAPI';

const InlineParticipantForm: React.FC<{
  onCloseForm: () => void;
  availableRolesOptions: FormOption[];
  onAddNewParticipant: (props: NewAssignmentFormValues) => void;
  userId?: string;
}> = ({ onCloseForm, availableRolesOptions, onAddNewParticipant, userId }) => {
  const projectData = useSelector(getOriginalProjectData);
  const [availability, setAvailability] = useState<number>();

  const defaultState = useMemo(
    () => ({
      startDate: '',
      endDate: '',
      job_role: '',
      totalAllocation: 0,
    }),
    []
  );

  const [formValues, setFormValues] =
    useState<NewAssignmentFormValues>(defaultState);

  const currentAvailability = useMemo(() => {
    if (!availability) {
      return false;
    } else {
      return availability - formValues.totalAllocation;
    }
  }, [availability, formValues.totalAllocation]);

  useEffect(() => {
    const resourceAllocationAPI = ResourceAllocationAPI;

    const getUserAvailability = async () => {
      const userAvailability = await resourceAllocationAPI.getUserAvailability({
        timeFrameStartDate: formValues.startDate,
        timeFrameEndDate: formValues.endDate,
        userId: userId || '',
      });
      if (userAvailability) {
        setAvailability(userAvailability);
      } else {
        setAvailability(undefined);
      }
    };

    if (formValues.startDate && formValues.endDate && userId) {
      getUserAvailability();
    }
  }, [formValues.startDate, formValues.endDate, userId]);

  const canSave = useMemo(
    () => formValues.startDate && formValues.endDate && formValues.job_role,
    [formValues]
  );

  const handleSave = () => {
    onAddNewParticipant(formValues);
    onCloseForm();
  };

  return (
    <div className='w-full flex flex-col mt-6 p-1'>
      <Typography variant='body' className='text-neutral-black'>
        {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.NEW_ASSIGNMENT')}
      </Typography>
      <div className='w-full flex rounded shadow-allocation-table mt-2 items-center'>
        <FormItem className='p-2 w-1/4' component='div'>
          <Dropdown
            options={availableRolesOptions}
            placeholder={intl.get(
              'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_ROLE_FIELD_LABEL'
            )}
            onChange={(option: FormOption) =>
              setFormValues((prev: NewAssignmentFormValues) => ({
                ...prev,
                job_role: option.value,
              }))
            }
            triggerProps={{ size: 'sm' }}
          />
        </FormItem>
        <FormItem className='p-2 w-2/6'>
          <Datepicker
            canSelectRange
            triggerClassname='h-8 text-label'
            minDate={projectData.startDate && new Date(projectData.startDate)}
            maxDate={
              projectData.targetCompletionDate &&
              new Date(projectData.targetCompletionDate)
            }
            onPickDate={(date: rangeDateType) => {
              setFormValues((prev: NewAssignmentFormValues) => ({
                ...prev,
                startDate: date.startDate,
                endDate: date.endDate,
              }));
            }}
            startPlaceHolder={intl.get(
              'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_START_DATE_FIELD_LABEL'
            )}
            endPlaceHolder={intl.get(
              'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_END_DATE_FIELD_LABEL'
            )}
          />
        </FormItem>
        <div className='shadow-header flex p-2 w-1/4'>
          <div className='flex flex-col items-center justify-start'>
            <Typography variant='caption' className='text-neutral-black'>
              {intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.AVAILABLE'
              )}
            </Typography>
            {currentAvailability !== false ? (
              <Typography variant='label' className='text-neutral-black'>
                {intl.get(
                  'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.HOURS_AVAILABLE',
                  { hours: currentAvailability }
                )}
              </Typography>
            ) : (
              <span>-</span>
            )}
          </div>
          <div className='flex items-center ml-2'>
            <TextField
              placeholder={intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.TOTAL_ALLOCATION_PLACEHOLDER'
              )}
              height='small'
              type='number'
              inputClassName='no-spinner'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormValues((prev: NewAssignmentFormValues) => ({
                  ...prev,
                  totalAllocation: parseInt(e.target.value) || 0,
                }))
              }
            />
            <Typography variant='label' className='text-neutral-black ml-2'>
              {intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.HOUR_LABEL'
              )}
            </Typography>
          </div>
        </div>
        <div className='flex p-2 items-center align-middle'>
          <Button
            variant='tertiary'
            className='px-2'
            disabled={!canSave}
            onClick={handleSave}
          >
            {intl.get('ADD')}
          </Button>
          <Button variant='tertiary' className='px-2' onClick={onCloseForm}>
            {intl.get('CANCEL')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InlineParticipantForm;
