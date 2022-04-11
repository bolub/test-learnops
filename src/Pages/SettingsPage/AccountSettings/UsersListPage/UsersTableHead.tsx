import { useState } from 'react';
import { IconButton } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import upArrow from 'assets/icons/up-arrow.svg';
import downArrow from 'assets/icons/down-arrow.svg';
import { ActiveHeadType } from 'utils/customTypes';

type UsersTableHeadProps = {
  handleSort: (orderByParam: string[], order: 'desc' | 'asc') => void;
};

const UsersTableHead = ({ handleSort }: UsersTableHeadProps) => {
  const [activeHead, setActiveHead] = useState<ActiveHeadType>({
    orderBy: '',
    order: 'asc',
  });

  const headCellsClassNames = 'py-3 font-semibold';

  return [
    {
      content: <></>,
      className: 'w-4',
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['data.firstName', 'data.lastName']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.USER_NAME')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': activeHead.orderBy === 'data.firstName',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['type']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.USER_TYPE')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': activeHead.orderBy === 'type',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['team']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.TEAM')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': activeHead.orderBy === 'team',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['data.jobTitle']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.JOB_TITLE')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': activeHead.orderBy === 'data.jobTitle',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['data.employmentType']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.EMPLOYMENT_TYPE')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': activeHead.orderBy === 'data.employmentType',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['country_iso_3166_1_alpha_2_code', 'data.province']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.LOCATION')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter':
          activeHead.orderBy === 'country_iso_3166_1_alpha_2_code',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['data.rateHour']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.HOURLY_RATE')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': activeHead.orderBy === 'data.rateHour',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName={['status']}
          title={intl.get('USERS_PAGE.TABLE.HEAD.ACCOUNT_STATUS')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': activeHead.orderBy === 'status',
      }),
    },
  ];
};

export default UsersTableHead;

type TableHeadProps = {
  handleSort: (orderByParam: string[], order: 'desc' | 'asc') => void;
  title: string;
  columnName: string[];
  orderBy: string;
  order: 'asc' | 'desc';
  setActiveHead: React.Dispatch<React.SetStateAction<ActiveHeadType>>;
};
const TableHead = ({
  handleSort,
  title,
  columnName,
  orderBy,
  order,
  setActiveHead,
}: TableHeadProps) => {
  const isActive = orderBy === columnName[0];
  const isAsc = order === 'asc';
  const isDesc = order === 'desc';

  return (
    <div className={classnames('flex', 'items-center', 'relative')}>
      <div className={classnames('flex', 'flex-col', 'absolute', 'right-0')}>
        <IconButton
          description={intl.get('REQUESTS_LIST_PAGE.TABLE.SORT.ASC')}
          onClick={() => {
            handleSort(columnName, 'asc');
            setActiveHead({ orderBy: columnName[0], order: 'asc' });
          }}
          hasASize={false}
          src={upArrow}
          className='mb-0.75'
          iconClassname={classnames('w-1.5 h-1', {
            'text-primary-dark': isActive && isAsc,
          })}
        />
        <IconButton
          description={intl.get('REQUESTS_LIST_PAGE.TABLE.SORT.DESC')}
          onClick={() => {
            handleSort(columnName, 'desc');
            setActiveHead({ orderBy: columnName[0], order: 'desc' });
          }}
          hasASize={false}
          src={downArrow}
          iconClassname={classnames('w-1.5 h-1', {
            'text-primary-dark': isActive && isDesc,
          })}
        />
      </div>
      {title}
    </div>
  );
};
