import intl from 'react-intl-universal';
import { IconButton, Button, Radio } from '@getsynapse/design-system';
import { QuestionsProps } from '../Question';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { radioOption } from 'utils/customTypes';

export const RadioButtons = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const questionOptions = questionData.data.value.options || [];

  const updateOptions = (items: radioOption[]) => {
    changeQuestionData('data.value.options', items, questionData.id);
  };

  const changeOption = debounce((id: string, text: string) => {
    const items = questionOptions.map((item: radioOption) =>
      item.id === id ? { id: id, text: text } : item
    );
    updateOptions(items);
  }, 500);

  const removeOption = (id: string) => {
    const items = questionOptions.filter((item: radioOption) => item.id !== id);
    updateOptions(items);
  };

  const addOption = () => {
    const optionId = uuidv4();
    const items = [...questionOptions, { id: optionId, text: '' }];
    updateOptions(items);
  };

  return (
    <div className='relative'>
      <ul>
        {questionOptions?.map((option: radioOption) => (
          <li key={option.id} className='py-2 px-4 flex justify-between'>
            <Radio
              name=''
              value=''
              label=''
              inputProps={{ checked: false, onChange: () => {} }}
            />
            <input
              className='bg-transparent focus:outline-none text-sm leading-6 w-full placeholder-neutral-light text-neutral-black focus:bg-primary-lighter'
              onChange={(event) => changeOption(option.id, event.target.value)}
              defaultValue={option.text}
              placeholder={intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.OPTION_PLACEHOLDER'
              )}
            />
            <IconButton
              name='close'
              description={intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.REMOVE_OPTION'
              )}
              onClick={() => removeOption(option.id)}
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

export default RadioButtons;
