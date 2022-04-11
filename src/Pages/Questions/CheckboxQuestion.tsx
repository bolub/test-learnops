import { Checkbox, FormItem } from '@getsynapse/design-system';
import { checkboxOption, intakeQuestionWrapper } from 'utils/customTypes';
import { useMemo } from 'react';

const CheckboxQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  const optionsData = useMemo(
    () => question.data.value.items.filter((data: checkboxOption) => data.item),
    [question.data.value.items]
  );

  return (
    <>
      {question.data.label?.trim() && optionsData.length && (
        <FormItem
          label={question.data.label}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <div>
            {optionsData.map((option: checkboxOption, index: number) => {
              return (
                <Checkbox
                  key={option.index}
                  label={option.item}
                  className='pr-10'
                  onChange={(event) => {
                    const selectedValue = event.target.checked;
                    handler(
                      question,
                      selectedValue,
                      `data.value.items[${index}].checked`
                    );
                  }}
                  defaultChecked={optionsData[index].checked}
                  disabled={disabled}
                />
              );
            })}
          </div>
        </FormItem>
      )}
    </>
  );
};

export default CheckboxQuestion;
