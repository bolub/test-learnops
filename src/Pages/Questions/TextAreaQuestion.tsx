import { FormItem, TextArea } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const TextAreaQuestion = ({
  question,
  className,
  handler,
  disabled,
  isEditing,
}: intakeQuestionWrapper) => {
  return (
    <FormItem
      label={!isEditing ? question.data.label : undefined}
      component='div'
      className={className}
      labelProps={{ required: question.data.isRequired }}
    >
      <TextArea
        onChange={(event: { target: { value: any } }) =>
          handler(question, event.target.value, 'data.value')
        }
        textAreaProps={{
          defaultValue: question.data.value || '',
        }}
        disabled={disabled}
      />
    </FormItem>
  );
};
export default TextAreaQuestion;
