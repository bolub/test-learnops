import { FormItem, Datepicker } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const DateQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  return (
    <FormItem
      label={question.data.label}
      component='div'
      className={className}
      labelProps={{ required: question.data.isRequired }}
    >
      <Datepicker
        onPickDate={(event: any) =>
          handler(question, event.startDate, 'data.value')
        }
        startDate={
          question.data.value.length > 0
            ? new Date(question.data.value)
            : undefined
        }
        disabled={disabled}
      />
    </FormItem>
  );
};

export default DateQuestion;
