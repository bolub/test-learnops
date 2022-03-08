import React from 'react';
import classnames from 'classnames';

const HeadCell: React.FC<{ className?: string; testId?: string }> = ({
  children,
  className = '',
  testId,
}) => (
  <div
    className={classnames('flex', 'items-center', 'justify-between', className)}
    data-cy={testId}
  >
    {children}
  </div>
);

export default HeadCell;
