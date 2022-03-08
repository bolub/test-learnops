import { Dropdown, Icon, useElevation } from '@getsynapse/design-system';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { NEW_PROJECT_FORM_FIELDS, PROJECT_HEALTH } from 'utils/constants';
import { Option } from 'utils/customTypes';

const StatusOption: React.FC<{
  label: string | undefined;
  value: string;
  selectOption: () => void;
}> = ({ label, value, selectOption }) => {
  return (
    <div onClick={selectOption} className='flex items-center'>
      <div
        className={classnames(
          'rounded-full h-2 w-2 flex items-center justify-center',
          healthStyle[value]
        )}
      />
      <div className='ml-3'>{label}</div>
    </div>
  );
};

type keys = keyof typeof PROJECT_HEALTH;
type ProjectHealth = typeof PROJECT_HEALTH[keys];
const healthStyle: Record<ProjectHealth, string> = {
  green: 'bg-success',
  red: 'bg-error',
  orange: 'bg-warning',
};

const StatusTrigger: React.FC<{
  onToggleDropdown: () => void;
  selectedOptions: Option[] | any[];
  disabled: boolean;
  isDropdownExpanded: boolean;
}> = ({ onToggleDropdown, selectedOptions, disabled, isDropdownExpanded }) => {
  const hoverElevation = useElevation(1);
  return (
    <div
      onClick={onToggleDropdown}
      className={classnames(
        'min-h-10 h-10 rounded border text-base py-1 px-4 flex justify-between items-center',
        {
          'border-neutral-lighter text-neutral-light': disabled,
          'bg-neutral-lightest hover:border-neutral-lighter': disabled,
          'focus:ring-0 active:ring-0 focus-visible:ring-0': disabled,
          'focus-visible:outline-none cursor-not-allowed': disabled,
          'ring-primary border-primary': isDropdownExpanded,
        },
        {
          'border-neutral-light hover:border-neutral-dark focus:border-primary active:ring-primary text-neutral-black':
            !disabled && !isDropdownExpanded,
          [`hover:${hoverElevation} focus:border-primary`]: !disabled,
          'focus-visible:outline-none focus:ring-primary': !disabled,
          'focus-visible:ring-primary bg-neutral-white': !disabled,
        }
      )}
    >
      <div className='flex items-center'>
        <div
          className={classnames(
            'rounded-full h-2 w-2 flex items-center justify-center',
            healthStyle[selectedOptions[0].value]
          )}
        />
        <div className='ml-3'>{selectedOptions[0].label}</div>
      </div>
      <Icon
        name={isDropdownExpanded ? 'caret-up-outline' : 'caret-down-outline'}
        className='text-neutral-dark'
      />
    </div>
  );
};

const ProjectHealtPicker: React.FC<{
  onChange: (name: string, value: string) => void;
  options: Option[];
  values?: Option[];
  disabled?: boolean;
}> = ({ onChange = () => {}, options = [], values = [], disabled = false }) => {
  return (
    <Dropdown
      disabled={disabled}
      placeholder={intl.get('PROJECT_DETAIL.HEALTH_PLACEHOLDER')}
      onChange={(option: Option) =>
        onChange(NEW_PROJECT_FORM_FIELDS.HEALTH, option.value)
      }
      options={options}
      values={values}
      renderTrigger={({
        onToggleDropdown,
        selectedOptions,
        disabled,
        isDropdownExpanded,
      }) => (
        <StatusTrigger
          onToggleDropdown={onToggleDropdown}
          selectedOptions={selectedOptions}
          disabled={disabled}
          isDropdownExpanded={isDropdownExpanded}
        />
      )}
      renderOption={(
        option: Option,
        isSelected: boolean,
        selectOption,
        { className, ...otherProps }
      ) => (
        <li
          {...otherProps}
          className={classnames(className, {
            'bg-primary focus-visible:bg-primary text-neutral-white':
              isSelected,
          })}
        >
          <StatusOption
            label={option.label}
            value={option.value}
            selectOption={selectOption}
          />
        </li>
      )}
    />
  );
};

export default ProjectHealtPicker;
