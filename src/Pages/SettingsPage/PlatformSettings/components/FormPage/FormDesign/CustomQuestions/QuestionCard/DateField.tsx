import intl from 'react-intl-universal';
import { Checkbox, Icon, Input } from '@getsynapse/design-system';
import { QuestionsProps } from '../Question';
import { get, debounce } from 'lodash';
import dateIcon from 'assets/icons/date-icon.svg';

export const DateField = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const isRange = get(questionData, 'data.range');

  const updateStartPlaceholder = debounce((value) => {
    changeQuestionData('data.placeholder', value, questionData.id);
  }, 500);

  const updateEndPlaceholder = debounce((value) => {
    changeQuestionData('data.placeholder2', value, questionData.id);
  }, 500);

  const updateDateRange = (checked: boolean) => {
    changeQuestionData('data.range', checked, questionData.id);
  };

  return (
    <div>
      <div className='flex'>
        <Input
          divProps={{ className: 'w-full' }}
          tailingIcon={
            <Icon src={dateIcon} className='text-neutral-dark text-2xl' />
          }
          defaultValue={get(questionData, 'data.placeholder')}
          placeholder={intl.get(
            'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.PLACEHOLDER'
          )}
          className='text-neutral-light focus:text-neutral-black'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            updateStartPlaceholder(event.target.value)
          }
        />
        {isRange && (
          <Input
            divProps={{ className: 'w-full ml-6' }}
            tailingIcon={
              <Icon src={dateIcon} className='text-neutral-dark text-2xl' />
            }
            defaultValue={get(questionData, 'data.placeholder2')}
            placeholder={intl.get(
              'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.PLACEHOLDER'
            )}
            className='text-neutral-light focus:text-neutral-black'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateEndPlaceholder(event.target.value)
            }
          />
        )}
      </div>
      <Checkbox
        className='mt-2'
        checked={isRange}
        label={intl.get(
          'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.DATE.DATE_RANGE'
        )}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          updateDateRange(event.target.checked)
        }
      />
    </div>
  );
};

export default DateField;
