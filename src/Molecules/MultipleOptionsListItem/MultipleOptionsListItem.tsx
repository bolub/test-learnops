import { Checkbox } from '@getsynapse/design-system';
import classnames from 'classnames';

const MultipleOptionListItem: React.FC<{
  label: string;
  isSelected: boolean;
  selectOption: (option: any) => void;
}> = ({ label, isSelected = false, selectOption }) => (
  <Checkbox
    checked={isSelected}
    onChange={selectOption}
    label={label}
    inputProps={{
      className: classnames({
        'group-hover:border-neutral-white': isSelected,
        'group-focus-visible:border-neutral-white': isSelected,
      }),
    }}
    className={classnames({
      'group-hover:text-neutral-white': isSelected,
      'group-focus-visible:text-neutral-white': isSelected,
    })}
  />
);

export default MultipleOptionListItem;
