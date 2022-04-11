import intl from 'react-intl-universal';
import { Toggle, Typography } from '@getsynapse/design-system';
import { get, debounce } from 'lodash';
import { QuestionsProps } from '../Question';

export const ToggleField = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const toggleDefault = get(questionData, 'data.toggleDefault');
  const toggleText = {
    onText: get(questionData, 'data.onText'),
    offText: get(questionData, 'data.offText'),
  };

  const updateToggleCheck = (checked: boolean) => {
    changeQuestionData('data.toggleDefault', checked, questionData.id);
  };

  const changeToggleText = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      changeQuestionData(
        toggleDefault ? 'data.onText' : 'data.offText',
        event.target.value,
        questionData.id
      );
    },
    500
  );

  return (
    <>
      <div className='flex items-center mb-2'>
        <Toggle
          id={`toggle-${questionData.id}`}
          checked={toggleDefault}
          onChange={(event) => updateToggleCheck(event.target.checked)}
        />
        <input
          className='bg-transparent focus:outline-none text-sm leading-4 w-full text-neutral-black leading-6 placeholder-neutral-light focus:bg-primary-lighter'
          onChange={changeToggleText}
          defaultValue={toggleDefault ? toggleText.onText : toggleText.offText}
          placeholder={intl.get(
            'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.TOGGLE.VALUE'
          )}
          key={toggleDefault}
        />
      </div>
      <Typography className='text-neutral-black' variant='caption'>
        {intl.get(
          'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.TOGGLE.HELP_TEXT'
        )}
      </Typography>
    </>
  );
};

export default ToggleField;
