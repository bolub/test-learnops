import { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  OverflowMenu,
  OverflowMenuItem,
  AvatarGroup,
} from '@getsynapse/design-system';
import get from 'lodash/get';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';
import { deleteRequest } from 'state/Requests/requestSlice';
import { PATHS, DATE, USER_TYPES, REQUEST_STATUS } from 'utils/constants';
import {
  AvatarUser,
  ModalProps,
  objKeyAsString,
  Owner,
  Request,
} from 'utils/customTypes';
import { selectUserType } from 'state/User/userSlice';
import { useAppSelector } from 'state/hooks';
import RequestsTableHead from './RequestsTableHead';
import UserAvatar from 'Atoms/UserAvatar';

const mapTagColor: objKeyAsString = {
  [REQUEST_STATUS.DRAFT]: { color: 'positive' },
  [REQUEST_STATUS.SUBMITTED]: { color: 'warning' },
  [REQUEST_STATUS.APPROVED]: {
    className: 'bg-purple-lighter text-purple-dark',
  },
  [REQUEST_STATUS.REJECTED]: {
    color: 'danger',
  },
  [REQUEST_STATUS.CANCELED]: {
    className: 'bg-fire-lighter text-fire-dark',
  },
  [REQUEST_STATUS.PENDING_CANCEL]: {
    className: 'bg-neutral-lighter text-neutral-dark',
  },
};

type RequestsTableProps = {
  data: Request[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps>>;
  setSelectedRequests: React.Dispatch<React.SetStateAction<string[]>>;
  handleSort: (orderByParam: string, order: 'desc' | 'asc') => void;
};

const RequestsTable = ({
  data,
  setModalOpen,
  setModalProps,
  setSelectedRequests,
  handleSort,
}: RequestsTableProps) => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState(data);
  const userType = useAppSelector(selectUserType);
  const isLDUser = userType === USER_TYPES.L_D;
  const isBusinessUser = userType === USER_TYPES.BUSINESS;

  useEffect(() => setRequests(data), [data]);

  const openModal = (request: Request) => {
    setModalOpen(true);
    const props = {
      title: intl.get('REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.TITLE'),
      children: intl.get('REQUESTS_LIST_PAGE.MODAL.DELETE_REQUEST.BODY', {
        requestNo: request.requestIdentifier,
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
          requestNo: request.requestIdentifier,
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

  return (
    <Table
      onSelectRows={(selectedRequests: string[]) =>
        setSelectedRequests(selectedRequests)
      }
      className='w-full'
      data={{
        headData: {
          headCells: RequestsTableHead({
            handleSort,
            isLDUser,
            isBusinessUser,
          }),
        },
        rows: requests.map((request: Request) => {
          let submissonDate = intl.get('REQUESTS_LIST_PAGE.NO_DATE');
          let updateDate = intl.get('REQUESTS_LIST_PAGE.NO_DATE');
          if (request.submittedAt) {
            submissonDate = moment(
              new Date(
                request.submittedAt.replace(/-/g, '/').replace(/T.+/, '')
              )
            ).format(DATE.SHORT_FORMAT);
          }
          if (request.updatedAt) {
            updateDate = moment(
              new Date(request.updatedAt.replace(/-/g, '/').replace(/T.+/, ''))
            ).format(DATE.SHORT_FORMAT);
          }

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

          return {
            id: request.id,
            cells: [
              {
                content: request.requestIdentifier,
              },
              ...(isLDUser
                ? [
                    {
                      content:
                        request.owners && request.owners.length === 1 ? (
                          <div className='flex'>
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
                      className: 'font-semibold',
                    },
                  ]
                : []),
              {
                content: request.requester && (
                  <div className='flex'>
                    <UserAvatar user={request.requester as AvatarUser} />
                    <span className='ml-2.5'>
                      {`${get(request.requester, 'data.firstName', '-')} ${get(
                        request.requester,
                        'data.lastName'
                      )}`}
                    </span>
                  </div>
                ),
                className: 'font-semibold',
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
              },
              ...(isLDUser
                ? [
                    {
                      content: get(request, 'businessTeam.title', ''),
                    },
                  ]
                : []),
              {
                content: submissonDate,
              },
              ...(isBusinessUser
                ? [
                    {
                      content: updateDate,
                    },
                  ]
                : []),
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
              },
              {
                content: request.status === 'draft' && (
                  <OverflowMenu>
                    <OverflowMenuItem
                      data-cy={`request-delete-button-${request.id}`}
                      onSelect={() => openModal(request)}
                    >
                      {intl.get('REQUESTS_LIST_PAGE.TABLE.ACTIONS.DELETE')}
                    </OverflowMenuItem>
                  </OverflowMenu>
                ),
              },
            ],
          };
        }),
      }}
      data-cy='request-table'
    />
  );
};

export default RequestsTable;
