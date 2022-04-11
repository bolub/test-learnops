import intl from 'react-intl-universal';
import { TEAM_MEMBER_COLUMNS } from 'utils/constants';

const teamHeader = () => ({
  headData: {
    headCells: [
      ...TEAM_MEMBER_COLUMNS.map((column) => {
        return {
          className: 'py-3 px-2',
          content: intl.get(`TEAMS.TABLE.${column.labelKey}`),
        };
      }),
      { className: 'py-3 px-2', content: <span /> },
    ],
  },
});

export default teamHeader;
