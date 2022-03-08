import React, { useState, useMemo } from 'react';
import { Button, useElevation } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import get from 'lodash/get';
import ProjectCreationModal from 'Pages/RequestPage/components/ProjectCreationModal';
import LinkProjectsToRequestModal from './LinkProjectsToRequestModal';
import { selectUserType, selectUserId } from 'state/User/userSlice';
import { useAppSelector } from 'state/hooks';
import { REQUEST_ACTIONS, REQUEST_STATUS, PATHS } from 'utils/constants';
import {
  MoreActionsOption,
  Owner as RequestOwner,
  Request,
} from 'utils/customTypes';
import { downloadRequest } from 'state/Requests/requestSlice';
import {
  editRequest,
  selectActiveRequestSliceStatus,
  selectIsActiveRequestAForm,
} from 'state/ActiveRequest/activeRequestSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import MoreActionsDropdown from './MoreActionsDropdown';
import CancelRequestModal from './CancelRequestModal';
import DeclineRequestModal from './DeclineRequestModal';
import moment from 'moment';

const TopBar = ({
  toggleComment,
  showComment,
  requestData,
  isOwner,
}: {
  toggleComment: any;
  showComment: boolean;
  requestData: Request;
  isOwner: boolean;
}) => {
  const history = useHistory();
  const skimClass = useElevation(2);
  const dispatch = useDispatch();
  const requestId = requestData.id!;
  const handleToggle = () => {
    toggleComment();
  };
  const requestSliceStatus = useSelector(selectActiveRequestSliceStatus);

  const userType = useAppSelector(selectUserType);
  const userId = useAppSelector(selectUserId);
  const isForm = useSelector(selectIsActiveRequestAForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpenCancelModal, setIsOpenCancelModal] = useState<boolean>(false);
  const [isOpenDeclineModal, setIsOpenDeclineModal] = useState<boolean>(false);
  const [isLinkRequestModalOpen, setIsLinkRequestModalOpen] = useState(false);

  const canCreateProject =
    userType === 'ld' && requestData.status === 'approved';

  const requestOwners = useMemo(
    () => get(requestData, 'owners', []).map((owner: RequestOwner) => owner.id),
    [requestData]
  );
  const canLinkProjects =
    requestOwners.includes(userId) && requestData.status === 'approved';

  const downloadRequests = async () => {
    const requestIdentifier = requestData.requestIdentifier;
    const requestTitle = requestData.title;
    const fileName = `Request_${requestIdentifier}_${requestTitle}`;
    if (requestId) {
      dispatch(downloadRequest({ requestId, fileName }));
    }
  };

  const approveRequest = async () => {
    await dispatch(
      editRequest({
        request: requestData,
        updateData: {
          status: REQUEST_STATUS.APPROVED,
          decision_date: moment().format(),
          data: {
            ...requestData.data,
          },
        },
      })
    );
    dispatch(
      setNotificationText(
        intl.get('REQUEST_PAGE.TOP_BAR.APPROVE_SUCCESS_MESSAGE', {
          requestNo: requestData.requestIdentifier,
        })
      )
    );
    dispatch(setNotificationTimeout(4000));
    dispatch(setNotificationVariant('success'));
    dispatch(displayNotification());
  };

  const declineRequest = async (reason: string, message?: string) => {
    await dispatch(
      editRequest({
        request: requestData,
        updateData: {
          status: REQUEST_STATUS.REJECTED,
          decision_date: moment().format(),
          data: {
            ...requestData.data,
            declination: {
              reason,
              details: message,
            },
          },
        },
      })
    );
    dispatch(
      setNotificationText(
        intl.get('REQUEST_PAGE.TOP_BAR.DECLINE_SUCCESS_MESSAGE', {
          requestNo: requestData.requestIdentifier,
        })
      )
    );
    dispatch(setNotificationTimeout(4000));
    dispatch(setNotificationVariant('success'));
    dispatch(displayNotification());
    history.push(PATHS.REQUESTS_LIST_PAGE);
  };

  const onCancelRequest = async (reason: string, message?: string) => {
    await dispatch(
      editRequest({
        request: requestData,
        updateData: {
          status:
            requestData.status === REQUEST_STATUS.SUBMITTED
              ? REQUEST_STATUS.CANCELED
              : REQUEST_STATUS.PENDING_CANCEL,
          data: {
            ...requestData.data,
            cancellation: {
              reason,
              details: message,
            },
          },
        },
      })
    );

    if (requestSliceStatus === 'idle') {
      dispatch(setNotificationVariant('success'));
      dispatch(setNotificationTimeout(4000));
      dispatch(
        setNotificationText(
          intl.get('REQUESTS_LIST_PAGE.NOTIFICATIONS.CANCELLATION_SUCCESS', {
            requestNo: get(requestData, 'requestIdentifier'),
          })
        )
      );
      dispatch(displayNotification());
      history.push(PATHS.REQUESTS_LIST_PAGE);
    }
  };

  const handleMoreActions = (value: MoreActionsOption) => {
    if (value.value === REQUEST_ACTIONS.DOWNLOAD_REQUEST) {
      downloadRequests();
    } else if (value.value === REQUEST_ACTIONS.CANCEL_REQUEST) {
      setIsOpenCancelModal(true);
    } else if (value.value === REQUEST_ACTIONS.CREATE_PROJECT) {
      setModalOpen(true);
    } else if (value.value === REQUEST_ACTIONS.LINK_PROJECT) {
      setIsLinkRequestModalOpen(true);
    }
  };

  return (
    <React.Fragment>
      <ProjectCreationModal
        isOpen={modalOpen}
        setModalOpen={setModalOpen}
        requestId={requestId}
      />
      <CancelRequestModal
        isOpen={isOpenCancelModal}
        setIsOpen={setIsOpenCancelModal}
        onCancelRequest={onCancelRequest}
      />
      <DeclineRequestModal
        isOpen={isOpenDeclineModal}
        setIsOpen={setIsOpenDeclineModal}
        onDeclineRequest={declineRequest}
      />
      <LinkProjectsToRequestModal
        isOpen={isLinkRequestModalOpen}
        closeModal={() => setIsLinkRequestModalOpen(false)}
        requestId={requestId}
      />
      <div
        className={classnames(
          skimClass,
          'bg-neutral-white sticky top-0 z-10 flex flex-row justify-end p-2 space-x-3'
        )}
      >
        {isOwner && (
          <Button
            iconName='checkmark-circle'
            variant='tertiary'
            iconColor='success'
            onClick={approveRequest}
            disabled={requestData.status !== REQUEST_STATUS.SUBMITTED}
            className={classnames({
              'cursor-not-allowed':
                requestData.status !== REQUEST_STATUS.SUBMITTED,
            })}
            data-cy='approve-request_topbar-button'
          >
            {intl.get('REQUEST_PAGE.TOP_BAR.APPROVE')}
          </Button>
        )}
        {isOwner && (
          <Button
            iconName='close-circle'
            variant='tertiary'
            iconColor='error'
            onClick={() => setIsOpenDeclineModal(true)}
            disabled={requestData.status !== REQUEST_STATUS.SUBMITTED}
            className={classnames({
              'cursor-not-allowed':
                requestData.status !== REQUEST_STATUS.SUBMITTED,
            })}
            data-cy='decline-request_topbar-button'
          >
            {intl.get('REQUEST_PAGE.TOP_BAR.DECLINE')}
          </Button>
        )}
        <Button
          iconName='chatbox'
          variant='tertiary'
          onClick={handleToggle}
          className={classnames('z-10', {
            'bg-neutral-lightest text-primary-darker': showComment,
          })}
          data-testid='comments_topbar-button'
          disabled={isForm}
        >
          {intl.get('REQUEST_PAGE.TOP_BAR.COMMENTS')}
        </Button>
        <MoreActionsDropdown
          onChange={handleMoreActions}
          canCancel={
            requestData.requester_id === userId &&
            (requestData.status === REQUEST_STATUS.SUBMITTED ||
              requestData.status === REQUEST_STATUS.APPROVED)
          }
          canCreateProject={canCreateProject}
          canLinkProjects={canLinkProjects}
        />
      </div>
    </React.Fragment>
  );
};

export default TopBar;
