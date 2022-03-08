import { ChangeEvent } from 'react';
import classnames from 'classnames';
import { FormItem, Input } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const UrlQuestion = ({
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
      <Input
        type='url'
        className={classnames({ 'mt-2': isEditing })}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handler(question, event.target.value, 'data.value')
        }
        defaultValue={question.data.value || ''}
        disabled={disabled}
      />
    </FormItem>
  );
};

export default UrlQuestion;
