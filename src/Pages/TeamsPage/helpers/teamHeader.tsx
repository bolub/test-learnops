import intl from 'react-intl-universal';
import { Typography } from '@getsynapse/design-system';
import { TEAM_MEMBER_COLUMNS } from 'utils/constants';

const teamHeader = () => ({
  headData: {
    headCells: TEAM_MEMBER_COLUMNS.map((column) => {
      return {
        className: 'py-3 px-2',
        content: (
          <Typography variant='caption' weight='medium'>
            {intl.get(`TEAMS.TABLE.${column.labelKey}`)}
          </Typography>
        ),
      };
    }),
  },
});

export default teamHeader;
