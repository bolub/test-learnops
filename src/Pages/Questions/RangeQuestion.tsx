import { Range, FormItem } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';
import get from 'lodash/get';

const RangeQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  const questionLabel = get(question, 'data.label')
    ? get(question, 'data.label').trim()
    : undefined;
  const from = get(question, 'data.value.from');
  const to = get(question, 'data.value.to');
  const defaultVal = get(question, 'data.value.value') || from;
  return (
    <>
      {questionLabel && from && to && (
        <FormItem
          label={questionLabel.trim()}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <Range
            data-testid='range_questions'
            min={from}
            max={to}
            className='mt-11 mb-11'
            onChange={(event) => handler(question, event, 'data.value.value')}
            defaultValue={defaultVal || from}
            disabled={disabled}
          />
        </FormItem>
      )}
    </>
  );
};

export default RangeQuestion;
