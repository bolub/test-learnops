import { FormItem, Datepicker } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';
import get from 'lodash/get';
import { useMemo } from 'react';

const DateQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  const canSelectRange = get(question, 'data.range');

  const date = useMemo(() => {
    if (canSelectRange) {
      return {
        startDate:
          question.data.value.startDate &&
          new Date(question.data.value.startDate),
        endDate:
          question.data.value.endDate && new Date(question.data.value.endDate),
      };
    } else {
      return {
        startDate: question.data.value && new Date(question.data.value),
      };
    }
  }, [canSelectRange, question.data.value]);

  const changeDate = (event: any) => {
    if (canSelectRange) {
      handler(
        question,
        { startDate: event.startDate, endDate: event.endDate },
        'data.value'
      );
    } else {
      handler(question, event.startDate, 'data.value');
    }
  };

  return (
    <>
      {question.data.label?.trim() && (
        <FormItem
          label={question.data.label}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <Datepicker
            className='w-full'
            canSelectRange={canSelectRange}
            onPickDate={changeDate}
            startDate={date.startDate}
            endDate={date.endDate}
            startPlaceHolder={get(question, 'data.placeholder')}
            endPlaceHolder={get(question, 'data.placeholder2')}
            disabled={disabled}
            startDateLabelProps={{
              required: question.data.isRequired,
            }}
            endDateLabelProps={{
              required: canSelectRange && question.data.isRequired,
            }}
          />
        </FormItem>
      )}
    </>
  );
};

export default DateQuestion;
