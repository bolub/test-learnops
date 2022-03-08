import { Range, FormItem } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const RangeQuestion = ({
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
      <Range
        data-testid='range_questions'
        min={question.data.value.from}
        max={question.data.value.to}
        className='mt-11 mb-11'
        onChange={(event) => handler(question, event, 'data.value.value')}
        defaultValue={question.data.value.value || question.data.value.from}
        disabled={disabled}
      />
    </FormItem>
  );
};

export default RangeQuestion;
