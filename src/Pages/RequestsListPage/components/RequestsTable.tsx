import { useEffect, useState, useMemo } from 'react';
import {
  Table,
  Tag,
  OverflowMenu,
  OverflowMenuItem,
  AvatarGroup,
  Checkbox,
} from '@getsynapse/design-system';
import { get, capitalize } from 'lodash';
import intl from 'react-intl-universal';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';
import { deleteRequest } from 'state/Requests/requestSlice';
import { PATHS, DATE, USER_TYPES, REQUEST_STATUS } from 'utils/constants';
import { AvatarUser, ModalProps, Owner, Request } from 'utils/customTypes';
import { selectUserType } from 'state/User/userSlice';
import RequestsTableHead from './RequestsTableHead';
import UserAvatar from 'Atoms/UserAvatar';
import classnames from 'classnames';
import { formatRequestIdentifier } from 'Pages/helpers';

const mapTagColor = {
  [REQUEST_STATUS.DRAFT]: { color: 'positive' },
  [REQUEST_STATUS.SUBMITTED]: { color: 'warning' },
  [REQUEST_STATUS.APPROVED]: {
    className: 'bg-purple-lighter',
    textClassName: 'text-purple-dark',
  },
  [REQUEST_STATUS.REJECTED]: {
    color: 'danger',
  },
  [REQUEST_STATUS.CANCELED]: {
    className: 'bg-fire-lighter',
    textClassName: 'text-fire-dark',
  },
  [REQUEST_STATUS.PENDING_CANCEL]: {
    className: 'bg-neutral-lighter',
    textClassName: 'text-neutral-dark',
  },
};

type RequestsTableProps = {
  data: Request[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps>>;
  setSelectedRequests: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRequests: string[];
  handleSort: (orderByParam: string, order: 'desc' | 'asc') => void;
};

const RequestsTable = ({
  data,
  setModalOpen,
  setModalProps,
  setSelectedRequests,
  selectedRequests,
  handleSort,
}: RequestsTableProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [requests, setRequests] = useState(data);
  const userType = useSelector(selectUserType);
  const isLDUser = userType === USER_TYPES.L_D;

  useEffect(() => setRequests(data), [data]);

  const openModal = (request: Request) => {
    setModalOpen(true);
    const props = {
      title: intl.get('REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.TITLE'),
      children: intl.get('REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.BODY', {
        requestNo: formatRequestIdentifier(request.requestIdentifier!),
      }),
      closeModal: () => setModalOpen(false),
      size: 'medium',
      actionButtons: [
        {
          children: intl.get(
            'REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.DELETE_BUTTON'
          ),
          color: 'danger',
          onClick: () => deleteSelectedRequest(request),
        },
        {
          children: intl.get(
            'REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.CANCEL_BUTTON'
          ),
          variant: 'tertiary',
          onClick: () => setModalOpen(false),
        },
      ],
    };
    setModalProps(props);
  };

  const deleteSelectedRequest = (request: Request) => {
    setModalOpen(false);
    dispatch(
      setNotificationText(
        intl.get('REQUESTS_LIST_PAGE.NOTIFICATIONS.DELETE_REQUEST', {
          requestNo: formatRequestIdentifier(request.requestIdentifier!),
        })
      )
    );
    dispatch(setNotificationTimeout(4000));
    dispatch(setNotificationVariant('success'));
    dispatch(displayNotification());
    if (request.id) {
      dispatch(deleteRequest(request.id));
    }
  };

  const isRequestTableEmpty = requests.length === 0;

  const isAllRowsSelected = useMemo(() => {
    return requests.length > 0
      ? selectedRequests.length === requests.length
      : false;
  }, [selectedRequests, requests]);

  const changeSelectedRequests = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const allRequestsIds = requests.map((request) => request.id) as string[];
      setSelectedRequests(allRequestsIds);
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRow = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRequests((prevState) => prevState.concat(event.target.value));
    } else {
      setSelectedRequests((prevState) =>
        prevState.filter((requestId) => requestId !== event.target.value)
      );
    }
  };

  return (
    <div className='relative overflow-hidden'>
      <div
        className={classnames('whitespace-nowrap', {
          'max-w-requests overflow-x-auto ml-140': !isRequestTableEmpty,
        })}
      >
        <Table
          canSelectRows={false}
          className='w-full'
          data={{
            headData: {
              headCells: RequestsTableHead({
                handleSort,
                isLDUser,
                isRequestTableEmpty,
                changeSelectedRequests,
                isAllRowsSelected,
              }),
            },
            rows: requests.map((request: Request, index: number) => {
              const submissonDate = request.submittedAt
                ? moment(request.submittedAt).format(DATE.SHORT_FORMAT)
                : intl.get('REQUESTS_LIST_PAGE.NO_DATE');
              const decisionDate = request.decision_date
                ? moment(request.decision_date).format(DATE.SHORT_FORMAT)
                : intl.get('REQUESTS_LIST_PAGE.NO_DATE');
              const ownersAvatars = request.owners
                ? request.owners.map((owner: Owner) => {
                    return {
                      imageSrc: get(owner, 'avatar_url'),
                      initial:
                        get(owner, 'data.firstName', ' ').charAt(0) +
                        get(owner, 'data.lastName', ' ').charAt(0),
                    };
                  })
                : [];
              const isOdd = index % 2;
              const isSelected = selectedRequests.includes(request.id!);
              const rowsClasses = classnames('group-hover:bg-primary-lighter', {
                'bg-primary-lighter': isSelected,
                'bg-neutral-white': !isOdd && !isSelected,
                'bg-neutral-lightest': isOdd && !isSelected,
              });

              return {
                id: request.id,
                className: 'group cursor-pointer',
                onClick: () =>
                  history.push(`${PATHS.REQUEST_PAGE}/${request.id}`),
                cells: [
                  {
                    content: (
                      <div
                        className='w-full h-full flex items-center justify-end'
                        onClick={(event: React.MouseEvent<HTMLInputElement>) =>
                          event.stopPropagation()
                        }
                      >
                        <Checkbox
                          value={request.id}
                          label=''
                          className='justify-end'
                          inputProps={{ className: 'mr-0 mt-0' }}
                          checked={isSelected}
                          onChange={handleSelectRow}
                        />
                      </div>
                    ),
                    className: `w-12 absolute z-5 left-0 flex items-center ${rowsClasses}`,
                  },
                  {
                    content: formatRequestIdentifier(
                      request.requestIdentifier!
                    ),
                    className: `w-28 absolute left-12 z-5 flex items-center ${rowsClasses}`,
                  },
                  {
                    content: (
                      <Link
                        to={`${PATHS.REQUEST_PAGE}/${request.id}`}
                        data-cy={`request__title-${request.id}`}
                      >
                        {request.title}
                      </Link>
                    ),
                    className: `w-64 absolute left-40 z-5 flex items-center ${rowsClasses}`,
                  },
                  {
                    content: (
                      <Tag
                        label={intl.get(
                          `REQUESTS_LIST_PAGE.TABLE.STATUS_LABEL.${get(
                            request,
                            'status',
                            ''
                          ).toUpperCase()}`
                        )}
                        {...mapTagColor[get(request, 'status', '')]}
                      />
                    ),
                    className: `w-36 absolute left-104 z-5 flex items-center ${rowsClasses}`,
                  },
                  {
                    content: request.requester && (
                      <div className='flex items-center'>
                        <UserAvatar user={request.requester as AvatarUser} />
                        <span className='ml-2.5'>
                          {`${get(
                            request.requester,
                            'data.firstName',
                            '-'
                          )} ${get(request.requester, 'data.lastName')}`}
                        </span>
                      </div>
                    ),
                    className: `font-semibold ${rowsClasses}`,
                  },
                  ...(isLDUser
                    ? [
                        {
                          content:
                            request.owners && request.owners.length === 1 ? (
                              <div className='flex items-center'>
                                <AvatarGroup avatars={ownersAvatars} />
                                <span className='ml-2.5'>
                                  {`${get(
                                    request,
                                    'owners[0].data.firstName',
                                    ''
                                  )} ${get(
                                    request,
                                    'owners[0].data.lastName',
                                    ''
                                  )}`}
                                </span>
                              </div>
                            ) : (
                              <AvatarGroup avatars={ownersAvatars} />
                            ),
                          className: `font-semibold ${rowsClasses}`,
                        },
                        {
                          content: get(request, 'businessTeam.title', ''),
                          className: rowsClasses,
                        },
                        {
                          content: capitalize(request.ldPriority),
                          className: rowsClasses,
                        },
                      ]
                    : []),
                  {
                    content: moment(request.createdAt).format(
                      DATE.SHORT_FORMAT
                    ),
                    className: rowsClasses,
                  },
                  {
                    content: submissonDate,
                    className: rowsClasses,
                  },
                  {
                    content: decisionDate,
                    className: rowsClasses,
                  },
                  {
                    content: moment(request.updatedAt).format(
                      DATE.SHORT_FORMAT
                    ),
                    className: rowsClasses,
                  },
                  {
                    content: request.status === 'draft' && (
                      <div
                        className='w-full h-full flex justify-center items-center relative'
                        onClick={(event: React.MouseEvent<HTMLInputElement>) =>
                          event.stopPropagation()
                        }
                      >
                        <OverflowMenu
                          menuListProps={{
                            className: 'absolute right-0 -mr-5 z-10',
                          }}
                        >
                          <OverflowMenuItem
                            data-cy={`request-delete-button-${request.id}`}
                            onSelect={() => openModal(request)}
                          >
                            {intl.get(
                              'REQUESTS_LIST_PAGE.TABLE.ACTIONS.DELETE'
                            )}
                          </OverflowMenuItem>
                        </OverflowMenu>
                      </div>
                    ),
                    className: classnames(
                      'w-20 ',
                      {
                        'absolute right-0 z-5 group-hover:bg-primary-lighter':
                          !isRequestTableEmpty,
                      },
                      rowsClasses
                    ),
                  },
                ],
              };
            }),
          }}
          data-cy='request-table'
        />
      </div>
    </div>
  );
};

export default RequestsTable;
