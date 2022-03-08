import { Icon } from '@getsynapse/design-system';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

const RenderLinks = ({
  linkPath,
  iconSrc = '',
  linkText,
  iconName = '',
  isExpanded,
  ariaLabel,
}: {
  linkPath: string;
  iconSrc?: string;
  linkText: string;
  iconName?: string;
  isExpanded: boolean;
  ariaLabel: string;
}) => {
  const iconClassName = 'h-5 w-5 text-neutral-white';

  const linkStyle = {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderLeftColor: 'white',
  };
  return (
    <NavLink
      exact
      to={linkPath}
      activeStyle={linkStyle}
      className={classnames(
        'border-l-4',
        'border-transparent',
        'flex',
        'h-10',
        'items-center',
        'text-center',
        'text-neutral-white',
        'hover:bg-primary-dark',
        'hover:opacity-50',
        'hover:text-neutral-white',
        'rounded',
        'text-sm',
        'leading-6',
        'px-2'
      )}
    >
      <Icon
        src={iconSrc}
        name={iconName}
        className={iconClassName}
        aria-label={ariaLabel}
      />
      <span
        className={classnames(
          'ml-2',
          'transition-opacity',
          'duration-75 ease-in',
          'delay-150 motion-safe',
          {
            'w-0 opacity-0': !isExpanded,
          }
        )}
      >
        {linkText}
      </span>
    </NavLink>
  );
};

export default RenderLinks;
