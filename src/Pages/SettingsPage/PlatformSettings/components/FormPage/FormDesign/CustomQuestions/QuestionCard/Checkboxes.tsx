import intl from 'react-intl-universal';
import { IconButton, Button, Checkbox } from '@getsynapse/design-system';
import { QuestionsProps } from '../Question';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { checkboxOption } from 'utils/customTypes';

export const Checkboxes = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const questionOptions = questionData.data.value.items || [];

  const updateOptions = (items: checkboxOption[]) => {
    changeQuestionData('data.value.items', items, questionData.id);
  };

  const changeOption = debounce((index: string, text: string) => {
    const items = questionOptions.map((item: checkboxOption) =>
      item.index === index ? { index: index, item: text } : item
    );
    updateOptions(items);
  }, 500);

  const removeOption = (index: string) => {
    const items = questionOptions.filter(
      (item: checkboxOption) => item.index !== index
    );
    updateOptions(items);
  };

  const addOption = () => {
    const optionIndex = uuidv4();
    const items = [
      ...questionOptions,
      { index: optionIndex, item: '', checked: false },
    ];
    updateOptions(items);
  };

  return (
    <div className='relative'>
      <ul>
        {questionOptions?.map((option: checkboxOption) => (
          <li key={option.index} className='py-2 px-4 flex justify-between'>
            <Checkbox label='' checked={false} onChange={() => {}} />
            <input
              className='bg-transparent focus:outline-none text-sm leading-6 w-full placeholder-neutral-light text-neutral-black focus:bg-primary-lighter'
              onChange={(event) =>
                changeOption(option.index, event.target.value)
              }
              defaultValue={option.item}
              placeholder={intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.OPTION_PLACEHOLDER'
              )}
            />
            <IconButton
              name='close'
              description={intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.REMOVE_OPTION'
              )}
              onClick={() => removeOption(option.index)}
            />
          </li>
        ))}
      </ul>
      <div className='shadow-header'>
        <Button variant='tertiary' iconName='add-circle' onClick={addOption}>
          {intl.get('SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.ADD_OPTION')}
        </Button>
      </div>
    </div>
  );
};

export default Checkboxes;
