import { FormItem, NumericInput } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';
import get from 'lodash/get';

const NumberQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  return (
    <>
      {question.data.label?.trim() && (
        <FormItem
          label={question.data.label}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <NumericInput
            onChange={(event: { target: { value: any } }) =>
              handler(question, event.target.value, 'data.value')
            }
            defaultValue={question.data.value}
            placeholder={get(question, 'data.placeholder')}
            disabled={disabled}
          />
        </FormItem>
      )}
    </>
  );
};

export default NumberQuestion;
