import classnames from 'classnames';

const TableCell: React.FC<{ className?: string }> = ({
  children,
  className = '',
}) => <div className={classnames('px-2', className)}>{children}</div>;

export default TableCell;
