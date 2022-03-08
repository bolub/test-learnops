import { HTMLAttributes, ReactNode } from 'react';
import { Typography } from '@getsynapse/design-system';
import classnames from 'classnames';

type PageTitleProps = {
  headerChildren?: ReactNode;
  titleComponent: ReactNode;
  dataCy?: string;
} & HTMLAttributes<HTMLDivElement>;

const PageTitle = ({
  headerChildren,
  className,
  titleComponent,
  dataCy,
  ...otherProps
}: PageTitleProps) => {
  return (
    <div
      className={classnames(
        'flex justify-between min-h-14 max-h-14',
        'items-center px-6 py-2 shadow-header',
        className
      )}
      {...otherProps}
    >
      <Typography
        variant='h4'
        weight='medium'
        className='text-neutral-dark'
        data-cy={dataCy}
      >
        {titleComponent}
      </Typography>
      {headerChildren}
    </div>
  );
};

export default PageTitle;
