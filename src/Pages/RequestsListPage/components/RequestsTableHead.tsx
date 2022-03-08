import { ReactNode, useState } from 'react';
import { IconButton } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import upArrow from 'assets/icons/up-arrow.svg';
import downArrow from 'assets/icons/down-arrow.svg';

type ActiveHeadType = {
  orderBy: string;
  order: 'desc' | 'asc';
};

type RequestsTableHeadProps = {
  handleSort: (orderByParam: string, order: 'desc' | 'asc') => void;
  isLDUser: boolean;
  isBusinessUser: boolean;
};

const RequestsTableHead = ({
  handleSort,
  isLDUser,
  isBusinessUser,
}: RequestsTableHeadProps) => {
  const [activeHead, setActiveHead] = useState<ActiveHeadType>({
    orderBy: '',
    order: 'asc',
  });

  return [
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName='requestIdentifier'
          title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUEST_NO')}
          data-cy='header__request-number'
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames('pl-8 text-left leading-6', {
        'bg-primary-lighter': activeHead.orderBy === 'requestIdentifier',
      }),
    },
    ...(isLDUser
      ? [
          {
            content: (
              <TableHead
                handleSort={handleSort}
                columnName='owners[0].data.firstName'
                title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.OWNER_NAME')}
                data-cy='header__owners'
                orderBy={activeHead.orderBy}
                order={activeHead.order}
                setActiveHead={setActiveHead}
              />
            ),
            className: classnames('text-left', {
              'bg-primary-lighter':
                activeHead.orderBy === 'owners[0].data.firstName',
            }),
          },
        ]
      : []),
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName='requester.data.firstName'
          title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUESTER_NAME')}
          data-cy='header__requester-name'
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames('text-left', {
        'bg-primary-lighter': activeHead.orderBy === 'requester.data.firstName',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName='title'
          title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUEST_TITLE')}
          data-cy='header__request-title'
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames('text-left pl-0', {
        'bg-primary-lighter': activeHead.orderBy === 'title',
      }),
    },
    ...(isLDUser
      ? [
          {
            content: (
              <TableHead
                handleSort={handleSort}
                columnName='businessTeam.title'
                title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.BUSINESS_UNIT')}
                data-cy='header__business-unit'
                orderBy={activeHead.orderBy}
                order={activeHead.order}
                setActiveHead={setActiveHead}
              />
            ),
            className: classnames('text-left pl-0', {
              'bg-primary-lighter': activeHead.orderBy === 'businessTeam.title',
            }),
          },
        ]
      : []),
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName='submittedAt'
          title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.SUBMISSION_DATE')}
          data-cy='header__submission-date'
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames('text-left', {
        'bg-primary-lighter': activeHead.orderBy === 'submittedAt',
      }),
    },
    ...(isBusinessUser
      ? [
          {
            content: (
              <TableHead
                handleSort={handleSort}
                columnName='updatedAt'
                title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.UPDATE_DATE')}
                data-cy='header__update-date'
                orderBy={activeHead.orderBy}
                order={activeHead.order}
                setActiveHead={setActiveHead}
              />
            ),
            className: classnames('text-left', {
              'bg-primary-lighter': activeHead.orderBy === 'updatedAt',
            }),
          },
        ]
      : []),
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName='status'
          title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.STATUS')}
          data-cy='header__request-status'
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames('text-left', {
        'bg-primary-lighter': activeHead.orderBy === 'status',
      }),
    },
    { content: '' },
  ];
};

export default RequestsTableHead;

type TableHeadProps = {
  handleSort: (orderByParam: string, order: 'desc' | 'asc') => void;
  startChildren?: ReactNode;
  title: string;
  columnName: string;
  orderBy: string;
  order: 'asc' | 'desc';
  setActiveHead: React.Dispatch<React.SetStateAction<ActiveHeadType>>;
};
const TableHead = ({
  handleSort,
  title,
  startChildren,
  columnName,
  orderBy,
  order,
  setActiveHead,
  ...otherProps
}: TableHeadProps) => {
  const isActive = orderBy === columnName;
  const isAsc = order === 'asc';
  const isDesc = order === 'desc';

  return (
    <div className={classnames('flex', 'items-center', 'relative')}>
      {startChildren}
      <div
        className={classnames('flex', 'flex-col', 'absolute', 'right-0')}
        {...otherProps}
      >
        <IconButton
          description={intl.get('REQUESTS_LIST_PAGE.TABLE.SORT.ASC')}
          onClick={() => {
            handleSort(columnName, 'asc');
            setActiveHead({ orderBy: columnName, order: 'asc' });
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
            setActiveHead({ orderBy: columnName, order: 'desc' });
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
