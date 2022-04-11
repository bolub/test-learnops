import { ReactNode, useState } from 'react';
import {
  IconButton,
  Checkbox,
  tailwindOverride,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import upArrow from 'assets/icons/up-arrow.svg';
import downArrow from 'assets/icons/down-arrow.svg';
import { ActiveHeadType } from 'utils/customTypes';

type RequestsTableHeadProps = {
  handleSort: (orderByParam: string, order: 'desc' | 'asc') => void;
  isLDUser: boolean;
  isRequestTableEmpty: boolean;
  changeSelectedRequests: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isAllRowsSelected: boolean;
};

const RequestsTableHead = ({
  handleSort,
  isLDUser,
  isRequestTableEmpty,
  changeSelectedRequests,
  isAllRowsSelected,
}: RequestsTableHeadProps) => {
  const [activeHead, setActiveHead] = useState<ActiveHeadType>({
    orderBy: '',
    order: 'asc',
  });

  return [
    {
      content: (
        <Checkbox
          value=''
          label=''
          onChange={changeSelectedRequests}
          className='justify-end'
          inputProps={{ className: '-mr-px' }}
          checked={isAllRowsSelected}
        />
      ),
      className: classnames('w-12', {
        'absolute left-0 h-10 z-5 bg-primary-lightest': !isRequestTableEmpty,
      }),
    },
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
      className: tailwindOverride(
        'leading-6',
        {
          'absolute w-28 left-12 z-5 bg-primary-lightest h-10':
            !isRequestTableEmpty,
        },
        {
          'bg-primary-lighter': activeHead.orderBy === 'requestIdentifier',
        }
      ),
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
      className: tailwindOverride(
        {
          'absolute w-64 left-40 z-5 bg-primary-lightest h-10 flex items-center':
            !isRequestTableEmpty,
        },
        {
          'bg-primary-lighter': activeHead.orderBy === 'title',
        }
      ),
    },
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
      className: tailwindOverride(
        {
          'absolute w-36 left-104 z-5 bg-primary-lightest h-10 flex items-center':
            !isRequestTableEmpty,
        },
        {
          'bg-primary-lighter': activeHead.orderBy === 'status',
        }
      ),
    },
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
      className: classnames({
        'bg-primary-lighter': activeHead.orderBy === 'requester.data.firstName',
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
            className: classnames({
              'bg-primary-lighter':
                activeHead.orderBy === 'owners[0].data.firstName',
            }),
          },
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
            className: classnames({
              'bg-primary-lighter': activeHead.orderBy === 'businessTeam.title',
            }),
          },
          {
            content: (
              <TableHead
                handleSort={handleSort}
                columnName='ldPriority'
                title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.PRIORITY')}
                orderBy={activeHead.orderBy}
                order={activeHead.order}
                setActiveHead={setActiveHead}
              />
            ),
            className: classnames({
              'bg-primary-lighter': activeHead.orderBy === 'ldPriority',
            }),
          },
        ]
      : []),
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName='createdAt'
          title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.CREATION_DATE')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames({
        'bg-primary-lighter': activeHead.orderBy === 'createdAt',
      }),
    },
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
      className: classnames({
        'bg-primary-lighter': activeHead.orderBy === 'submittedAt',
      }),
    },
    {
      content: (
        <TableHead
          handleSort={handleSort}
          columnName='decision_date'
          title={intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.DECISION_DATE')}
          orderBy={activeHead.orderBy}
          order={activeHead.order}
          setActiveHead={setActiveHead}
        />
      ),
      className: classnames({
        'bg-primary-lighter': activeHead.orderBy === 'decision_date',
      }),
    },
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
      className: classnames({
        'bg-primary-lighter': activeHead.orderBy === 'updatedAt',
      }),
    },
    {
      content: '',
      className: classnames('w-20', {
        'absolute right-0 z-5 bg-primary-lightest h-10': !isRequestTableEmpty,
      }),
    },
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
    <div
      className={classnames(
        'flex',
        'items-center',
        'justify-between',
        'w-full'
      )}
    >
      {title}
      <div className='flex flex-col ml-2' {...otherProps}>
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
    </div>
  );
};
