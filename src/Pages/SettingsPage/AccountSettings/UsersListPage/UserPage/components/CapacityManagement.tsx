import intl from 'react-intl-universal';
import {
  FormItem,
  NumericInput,
  Toggle,
  Typography,
} from '@getsynapse/design-system';
import { AllUsersType, objKeyAsString, HolidaysType } from 'utils/customTypes';
import get from 'lodash/get';
import { ChangeEvent, Fragment } from 'react';
import ViewHolidaysModal from './ViewHolidaysModal';

const CapacityManagement = ({
  user,
  country,
  handleChangeField,
  errors,
  holidays,
}: {
  user?: Partial<AllUsersType>;
  country: string;
  handleChangeField: (
    eventTargetValue: string | boolean | number,
    pathToUpdate: string
  ) => void;
  errors: objKeyAsString;
  holidays?: HolidaysType[];
}) => {
  const weeklyCapacity = get(user, 'default_capacity');
  const publicHolidays = get(user, 'public_holidays_in_capacity_enabled');

  return (
    <div className='grid grid-cols-2 gap-x-20 gap-y-4'>
      <div className='ml-4'>
        <Typography variant='h5' className='mt-8 text-neutral-black'>
          {intl.get('SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.TITLE')}
        </Typography>
        <Typography variant='caption' className='block text-neutral-light'>
          {intl.get('SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.CAPTION')}
        </Typography>
      </div>
      <div />
      <FormItem
        component='div'
        label={intl.get(
          'SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.WEEKLY_CAPACITY'
        )}
        className='ml-4 mt-2'
        labelProps={{
          required: true,
          state: errors.capacity ? 'error' : 'default',
        }}
        helpText={
          errors.capacity &&
          intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
        }
        helpTextProps={{ state: errors.capacity ? 'error' : 'default' }}
      >
        <div className='flex'>
          <NumericInput
            step='1'
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleChangeField(Number(event.target.value), 'default_capacity');
            }}
            defaultValue={weeklyCapacity}
            divProps={{ className: 'w-full' }}
            placeholder={intl.get(
              'SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.WEEKLY_CAPACITY_PLACEHOLDER'
            )}
            state={errors.capacity ? 'error' : 'default'}
            data-cy='weekly-capacity_input'
          />
          <span className='flex-end ml-2 py-2 text-neutral-black'>
            {intl.get('TEAMS.UPDATE_MODAL.HRS')}
          </span>
        </div>
      </FormItem>
      <div>
        {holidays && holidays.length > 0 && (
          <Fragment>
            <Toggle
              className='mt-2'
              label={intl.get(
                'SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.PUBLIC_HOLIDAYS.LABEL'
              )}
              id='holidays-toggle'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeField(
                  e.target.checked,
                  'public_holidays_in_capacity_enabled'
                );
              }}
              checked={publicHolidays}
              onText={intl.get(
                'SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.PUBLIC_HOLIDAYS.ON_TEXT'
              )}
              offText={intl.get(
                'SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.PUBLIC_HOLIDAYS.OFF_TEXT'
              )}
              labelProps={{ className: 'mb-5' }}
              isSmall
            />
            <ViewHolidaysModal country={country} holidays={holidays} />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default CapacityManagement;
