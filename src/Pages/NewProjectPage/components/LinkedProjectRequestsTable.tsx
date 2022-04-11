import React from 'react';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import moment from 'moment';
import { Button, Tag, AvatarGroup, Table } from '@getsynapse/design-system';
import { Request, AvatarUser } from 'utils/customTypes';
import { DATE } from 'utils/constants';
import UserAvatar from 'Atoms/UserAvatar';
import { formatRequestIdentifier } from 'Pages/helpers';

const LinkedProjectRequestsTable: React.FC<{
  requestsList: Request[];
  unLinkRequest: (requestId: string) => void;
  viewRequest: (request: Request) => void;
  disabled?: boolean;
}> = ({ requestsList = [], unLinkRequest, viewRequest, disabled = false }) => {
  const getRequestOwners = (owners: AvatarUser[] = []) => {
    if (owners.length === 1) {
      return (
        <div className='flex items-center'>
          <UserAvatar user={owners[0]} className='mr-2' />
          {`${get(owners, '0.data.firstName')} ${get(
            owners,
            '0.data.lastName'
          )}`}
        </div>
      );
    }
    if (owners.length > 1) {
      return (
        <AvatarGroup
          avatars={owners.map((owner) => ({
            imageSrc: owner.avatar_url,
            initial: get(get(owner, 'data.firstName'), '[0]'),
          }))}
        />
      );
    }
  };

  return (
    <div className='w-full px-1'>
      <Table
        data-cy='linked-requests-table'
        className='w-full px-1 mb-5'
        canSelectRows={false}
        emptyComponent={
          <div className='h-12 flex justify-center items-center text-neutral'>
            {intl.get(
              'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.NO_REQUEST_LINKED'
            )}
          </div>
        }
        data={{
          headData: {
            headCells: [
              {
                content: intl.get(
                  'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.REQUEST_NUMBER'
                ),
              },
              {
                content: intl.get(
                  'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.REQUEST_OWNER'
                ),
              },
              {
                content: intl.get(
                  'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.REQUESTER_NAME'
                ),
              },
              {
                content: intl.get(
                  'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.REQUEST_TITLE'
                ),
              },
              {
                content: intl.get(
                  'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.BUSINESS_UNIT'
                ),
              },
              {
                content: intl.get(
                  'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.SUBMISSION_DATE'
                ),
              },
              {
                content: intl.get(
                  'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.STATUS'
                ),
              },
              {
                content: '',
                className: 'w-36',
              },
            ],
          },
          rows: requestsList.map((request) => ({
            cells: [
              {
                content: formatRequestIdentifier(request?.requestIdentifier!),
              },
              {
                content: getRequestOwners(request?.owners),
              },
              {
                content: `${get(request, 'requester.data.firstName')} ${get(
                  request,
                  'requester.data.lastName'
                )}`,
              },
              {
                content: request?.title,
              },
              {
                content: get(request, 'businessTeam.title'),
              },
              {
                content: moment(request?.submittedAt).format(DATE.SHORT_FORMAT),
              },
              {
                content: (
                  <Tag
                    className='text-xs bg-purple-lighter'
                    textClassName='text-purple-dark'
                    label={intl.get(
                      'REQUESTS_LIST_PAGE.TABLE.STATUS_LABEL.APPROVED'
                    )}
                  />
                ),
              },
              {
                content: (
                  <div className='flex'>
                    <Button
                      className='text-sm text-primary mr-4'
                      variant='tertiary'
                      onClick={() => viewRequest(request)}
                      data-cy={`view-linked-request-${request.id}`}
                    >
                      {intl.get('PROJECT_DETAIL.LINKED_REQUESTS_SECTION.VIEW')}
                    </Button>
                    <Button
                      className='text-sm text-primary'
                      variant='tertiary'
                      onClick={() => unLinkRequest(request.id!)}
                      data-cy='unlink-request'
                      disabled={disabled}
                    >
                      {intl.get(
                        'REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.UNLINK'
                      )}
                    </Button>
                  </div>
                ),
                className: 'w-36',
              },
            ],
          })),
        }}
      />
    </div>
  );
};

export default LinkedProjectRequestsTable;
