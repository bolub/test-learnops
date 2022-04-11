import { Typography } from '@getsynapse/design-system';
import TableCell from 'Atoms/TableCell';

const tableSubHeader = (name: string) => {
  return {
    canSelectRows: false,
    cells: [
      {
        content: <TableCell className='shadow-none' />,
      },
      {
        colSpan: 6,
        content: (
          <Typography variant='body2' weight='medium'>
            {name}
          </Typography>
        ),
      },
    ],
  };
};

export default tableSubHeader;
