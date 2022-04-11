import intl from 'react-intl-universal';
import {
  Checkbox,
  Icon,
  IconButton,
  Input,
  Button,
} from '@getsynapse/design-system';
import { QuestionsProps } from '../Question';
import { get, debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { dropdownOption } from 'utils/customTypes';

export const Dropdown = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const questionOptions = questionData.data.value.items || [];

  const updateOptions = (items: dropdownOption[]) => {
    changeQuestionData('data.value.items', items, questionData.id);
  };

  const changeOption = debounce((value: string, display: string) => {
    const items = questionOptions.map((item: dropdownOption) =>
      item.value === value ? { value: value, display: display } : item
    );
    updateOptions(items);
  }, 500);

  const removeOption = (value: string) => {
    const items = questionOptions.filter(
      (item: dropdownOption) => item.value !== value
    );
    updateOptions(items);
  };

  const addOption = () => {
    const optionValue = uuidv4();
    const items = [...questionOptions, { value: optionValue, display: '' }];
    updateOptions(items);
  };

  const updatePlaceholder = debounce((value) => {
    changeQuestionData('data.placeholder', value, questionData.id);
  }, 500);

  const updateMultiselect = (checked: boolean) => {
    changeQuestionData('data.multiselect', checked, questionData.id);
  };

  return (
    <div className='relative'>
      <Input
        tailingIcon={<Icon name='caret-down' className='text-neutral-dark' />}
        defaultValue={get(questionData, 'data.placeholder')}
        placeholder={intl.get(
          'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.PLACEHOLDER'
        )}
        className='text-neutral-light focus:text-neutral-black'
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          updatePlaceholder(event.target.value)
        }
      />
      <Checkbox
        className='my-2'
        checked={get(questionData, 'data.multiselect')}
        label={intl.get(
          'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.DROPDOWN.MULTISELECT'
        )}
        onChange={(event) => updateMultiselect(event.target.checked)}
      />
      <ul>
        {questionOptions?.map((option: dropdownOption) => (
          <li
            key={option.value}
            className='py-2 px-4 shadow-header flex justify-between'
          >
            {get(questionData, 'data.multiselect') && (
              <Checkbox label='' checked={false} onChange={() => {}} />
            )}
            <input
              className='bg-transparent focus:outline-none text-sm leading-6 w-full placeholder-neutral-light text-neutral-black focus:bg-primary-lighter'
              onChange={(event) =>
                changeOption(option.value, event.target.value)
              }
              defaultValue={option.display}
              placeholder={intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.OPTION_PLACEHOLDER'
              )}
            />
            <IconButton
              name='close'
              description={intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.REMOVE_OPTION'
              )}
              onClick={() => removeOption(option.value)}
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

export default Dropdown;
