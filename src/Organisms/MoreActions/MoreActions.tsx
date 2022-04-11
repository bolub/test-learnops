import intl from 'react-intl-universal';
import {
  Button,
  Icon,
  List,
  Popup,
  tailwindOverride,
  Tooltip,
  Typography,
} from '@getsynapse/design-system';
import { MoreActionsOption } from 'utils/customTypes';

type MoreActionsProps = {
  options: MoreActionsOption[];
  onSelectOption?: (option: MoreActionsOption) => void;
};

const Option = ({
  close,
  option,
  selectOption,
}: {
  close: () => void;
  option: MoreActionsOption;
  selectOption: () => void;
}) => {
  return (
    <li
      onClick={() => {
        if (option.disabled !== true) {
          selectOption();
          close();
        }
      }}
      className={tailwindOverride(
        'group py-2 px-6 flex justify-start items-center cursor-pointer',
        { 'hover:bg-primary-lighter': !option.disabled },
        {
          'text-neutral-light cursor-not-allowed': option.disabled,
        }
      )}
      data-cy={option.dataCy}
    >
      <Icon
        className={tailwindOverride(
          'mr-2 text-base',
          { 'group-hover:text-primary': !option.disabled },
          option.iconClassName
        )}
        name={option.iconName}
        src={option.iconSrc}
      />
      <Typography
        className={tailwindOverride(
          { 'text-neutral-light': option.disabled },
          {
            'group-hover:text-primary': !option.disabled,
          }
        )}
        variant='body'
      >
        {option.label}
      </Typography>
    </li>
  );
};

const MoreActions: React.FC<MoreActionsProps> = ({
  options,
  onSelectOption = () => {},
}) => {
  return (
    <Popup
      position='bottom-end'
      trigger={({ isOpen }) => (
        <Button variant='tertiary' data-cy='more-actions-button'>
          {intl.get('MORE_ACTIONS')}
          <Icon
            name={isOpen ? 'caret-up' : 'caret-down'}
            className='text-xs pl-2'
          />
        </Button>
      )}
    >
      {({ close }) => (
        <List
          options={options}
          data-cy='more-actions-list'
          renderOption={(
            option: MoreActionsOption,
            isSelected,
            selectOption: () => void
          ) =>
            option.tooltipText ? (
              <Tooltip
                position='bottomLeft'
                contentProps={{
                  className: 'z-10',
                  'data-cy': `more-actions-tooltip-${option.value}`,
                }}
                openMode='hover2'
                trigger={
                  <div>
                    <Option
                      close={close}
                      option={option}
                      selectOption={selectOption}
                    />
                  </div>
                }
              >
                {option.tooltipText}
              </Tooltip>
            ) : (
              <Option
                close={close}
                option={option}
                selectOption={selectOption}
              />
            )
          }
          onSelectOption={onSelectOption}
        />
      )}
    </Popup>
  );
};

export default MoreActions;
