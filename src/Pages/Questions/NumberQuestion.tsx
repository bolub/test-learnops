import { FormItem, NumericInput } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const NumberQuestion = ({
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
      <NumericInput
        min='0'
        max='10'
        step='1'
        onChange={(event: { target: { value: any } }) =>
          handler(question, event.target.value, 'data.value')
        }
        defaultValue={question.data.value || 0}
        disabled={disabled}
      />
    </FormItem>
  );
};

export default NumberQuestion;
