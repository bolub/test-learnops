import { Icon } from '@getsynapse/design-system';
import classNames from 'classnames';

interface iconProps {
  name: string;
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
  onClickHandler?: () => void;
  id: string;
  dataCy?: string;
}

const ReorderIcon = ({
  name,
  className,
  isFirst,
  isLast,
  onClickHandler = () => {},
  dataCy,
}: iconProps) => {
  const firstAndLastRowClassNames =
    isFirst || isLast
      ? 'text-neutral-lighter'
      : 'text-neutral-dark hover:text-primary hover:bg-neutral-lightest';

  return (
    <div
      onClick={(event: React.MouseEvent<HTMLInputElement>) => {
        event.stopPropagation();
        onClickHandler();
      }}
      data-cy={dataCy}
      aria-disabled={isFirst || isLast ? true : false}
    >
      <Icon
        name={name}
        className={classNames(
          'p-1 my-auto text-lg rounded-sm',
          firstAndLastRowClassNames,
          className
        )}
      />
    </div>
  );
};

export default ReorderIcon;
