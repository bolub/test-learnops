import { ChangeEvent } from 'react';
import { FormItem, Toggle } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';
import get from 'lodash/get';

const ToggleQuestion = ({
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
          <Toggle
            id={`toggle-${question.id}`}
            onText={get(question, 'data.onText')}
            offText={get(question, 'data.offText')}
            checked={
              question.data.value !== ''
                ? question.data.value
                : get(question, 'data.toggleDefault')
            }
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handler(question, event.target.checked, 'data.value')
            }
            disabled={disabled}
          />
        </FormItem>
      )}
    </>
  );
};

export default ToggleQuestion;
