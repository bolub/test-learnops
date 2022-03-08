import { useState, useEffect, useMemo } from 'react';
import { FormItem, Datepicker, Icon } from '@getsynapse/design-system';
import informationIcon from 'assets/icons/information.svg';
import intl from 'react-intl-universal';
import moment from 'moment';
import { objKeyAsString, NewProject } from 'utils/customTypes';
import { NEW_PROJECT_FORM_FIELDS } from 'utils/constants';

type TimelineDatesProps = {
  startDate: string | null;
  targetCompletionDate: string | null;
  requiredFieldsErrors: objKeyAsString;
  handleFormFieldChange: (fieldName: string, fieldValue: Object) => void;
  originalData?: NewProject;
  isOnUpdatingPage: boolean;
  disabled?: boolean;
};

const TimelineDates = ({
  startDate,
  targetCompletionDate,
  requiredFieldsErrors,
  handleFormFieldChange,
  originalData,
  isOnUpdatingPage,
  disabled,
}: TimelineDatesProps) => {
  const [dateFieldsWarnings, setDateFieldsWarnings] = useState({
    startDate: false,
    endDate: false,
  });

  useEffect(() => {
    if (originalData?.targetCompletionDate && originalData?.startDate) {
      const isStartDateSame = moment(startDate).isSame(originalData?.startDate);
      const isEndDateSame = moment(targetCompletionDate).isSame(
        originalData?.targetCompletionDate
      );
      if (isStartDateSame) {
        dateFieldsWarnings.startDate &&
          setDateFieldsWarnings((prevData) => ({
            ...prevData,
            startDate: false,
          }));
      } else {
        !dateFieldsWarnings.startDate &&
          setDateFieldsWarnings((prevData) => ({
            ...prevData,
            startDate: true,
          }));
      }
      if (isEndDateSame) {
        dateFieldsWarnings.endDate &&
          setDateFieldsWarnings((prevData) => ({
            ...prevData,
            endDate: false,
          }));
      } else {
        !dateFieldsWarnings.endDate &&
          setDateFieldsWarnings((prevData) => ({ ...prevData, endDate: true }));
      }
    }
  }, [startDate, originalData, targetCompletionDate, dateFieldsWarnings]);

  const shouldShowDatesWarning = useMemo(() => {
    return (
      isOnUpdatingPage &&
      (dateFieldsWarnings?.startDate || dateFieldsWarnings?.endDate)
    );
  }, [dateFieldsWarnings, isOnUpdatingPage]);

  return (
    <FormItem>
      <Datepicker
        className='w-full'
        canSelectRange
        startDate={startDate && new Date(startDate)}
        endDate={targetCompletionDate && new Date(targetCompletionDate)}
        startDateLabel={intl.get('PROJECT_DETAIL.START_DATE')}
        startDateLabelProps={{
          required: true,
          state: requiredFieldsErrors?.startDate ? 'error' : 'default',
        }}
        startDateError={
          requiredFieldsErrors?.startDate
            ? intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
            : ''
        }
        endDateLabel={intl.get('PROJECT_DETAIL.END_DATE')}
        endDateError={
          requiredFieldsErrors?.targetCompletionDate
            ? intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
            : ''
        }
        endDateLabelProps={{
          required: true,
          state: requiredFieldsErrors?.targetCompletionDate
            ? 'error'
            : 'default',
        }}
        size='large'
        onPickDate={(date: Object) =>
          handleFormFieldChange(NEW_PROJECT_FORM_FIELDS.START_DATE, date)
        }
        data-cy='project-date-input'
        startDateWarning={dateFieldsWarnings.startDate}
        endDateWarning={dateFieldsWarnings.endDate}
        disabled={disabled}
      />
      {shouldShowDatesWarning && (
        <div className='w-full h-12 bg-warning-lighter rounded-sm mt-2 text-warning-dark flex items-center pl-4'>
          <Icon src={informationIcon} />
          <span className='ml-2'>
            {intl.get('PROJECT_DETAIL.TIMELINE_WARNING')}
          </span>
        </div>
      )}
    </FormItem>
  );
};

export default TimelineDates;
