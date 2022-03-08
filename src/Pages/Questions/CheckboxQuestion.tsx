import { Checkbox, FormItem } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const CheckboxQuestion = ({
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
      <div className='flex'>
        {question.data.value.items.map((checkboxData: any, index: number) => {
          return (
            <Checkbox
              key={checkboxData.index}
              label={checkboxData.item}
              className='pr-10'
              onChange={(event: { target: { checked: any } }) => {
                const selectedValue = event.target.checked;
                handler(
                  question,
                  selectedValue,
                  `data.value.items[${index}].checked`
                );
              }}
              defaultChecked={question.data.value.items[index].checked}
              disabled={disabled}
            />
          );
        })}
      </div>
    </FormItem>
  );
};

export default CheckboxQuestion;
