import { FormItem, TextField } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';
import get from 'lodash/get';

const TextFieldQuestion = ({
  question,
  className,
  handler,
  disabled,
  isEditing,
}: intakeQuestionWrapper) => {
  return (
    <>
      {question.data.label?.trim() && (
        <FormItem
          label={!isEditing ? question.data.label : undefined}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <TextField
            onChange={(event: { target: { value: any } }) =>
              handler(question, event.target.value, 'data.value')
            }
            placeholder={get(question, 'data.placeholder')}
            defaultValue={question.data.value}
            disabled={disabled}
          />
        </FormItem>
      )}
    </>
  );
};
export default TextFieldQuestion;
