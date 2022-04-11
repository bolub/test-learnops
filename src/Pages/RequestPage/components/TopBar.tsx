import React, { useState, useMemo } from 'react';
import { Button, useElevation } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import get from 'lodash/get';
import ProjectCreationModal from 'Pages/RequestPage/components/ProjectCreationModal';
import LinkProjectsToRequestModal from './LinkProjectsToRequestModal';
import { selectUserId } from 'state/User/userSlice';
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
import CancelRequestModal from './CancelRequestModal';
import DeclineRequestModal from './DeclineRequestModal';
import moment from 'moment';
import MoreActions from 'Organisms/MoreActions/MoreActions';
import kanbanCard from 'assets/icons/kanban-card.svg';
import { formatRequestIdentifier } from 'Pages/helpers';

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

  const userId = useSelector(selectUserId);
  const isForm = useSelector(selectIsActiveRequestAForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpenCancelModal, setIsOpenCancelModal] = useState<boolean>(false);
  const [isOpenDeclineModal, setIsOpenDeclineModal] = useState<boolean>(false);
  const [isLinkRequestModalOpen, setIsLinkRequestModalOpen] = useState(false);

  const requestOwners = useMemo(
    () => get(requestData, 'owners', []).map((owner: RequestOwner) => owner.id),
    [requestData]
  );

  const requestIdentifier = useMemo(
    () => formatRequestIdentifier(requestData.requestIdentifier!),
    [requestData]
  );

  const canCreateProject = useMemo<boolean>(
    () => requestOwners.includes(userId) && requestData.status === 'approved',
    [requestData.status, requestOwners, userId]
  );

  const canComment = useMemo<boolean>(
    () => requestOwners.includes(userId) || requestData.requester_id === userId,
    [requestData.requester_id, requestOwners, userId]
  );

  const canLinkProjects = useMemo<boolean>(
    () => requestOwners.includes(userId) && requestData.status === 'approved',
    [requestData.status, requestOwners, userId]
  );

  const canCancel = useMemo<boolean>(
    () =>
      requestData.requester_id === userId &&
      (requestData.status === REQUEST_STATUS.SUBMITTED ||
        requestData.status === REQUEST_STATUS.APPROVED),
    [requestData.requester_id, requestData.status, userId]
  );

  const moreActionsOptions: MoreActionsOption[] = useMemo(() => {
    const options: MoreActionsOption[] = [
      {
        value: REQUEST_ACTIONS.DOWNLOAD_REQUEST,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.DOWNLOAD_REQUEST'),
        iconName: 'cloud-download',
        dataCy: 'download_pdf-button',
      },
    ];

    if (canCancel) {
      options.push({
        value: REQUEST_ACTIONS.CANCEL_REQUEST,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.CANCEL_REQUEST'),
        iconName: 'remove-circle',
        dataCy: 'cancel-request-button',
      });
    }

    if (canCreateProject) {
      options.push({
        value: REQUEST_ACTIONS.CREATE_PROJECT,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.CREATE_PROJECT'),
        iconName: 'kanban-card',
        iconSrc: kanbanCard,
        dataCy: 'request-create-project_button',
      });
    }

    if (canLinkProjects) {
      options.push({
        value: REQUEST_ACTIONS.LINK_PROJECT,
        label: intl.get('REQUEST_PAGE.TOP_BAR.MORE.LINK_PROJECT'),
        iconName: 'link-outline',
        dataCy: 'request-link-project-button',
      });
    }

    return options;
  }, [canCancel, canCreateProject, canLinkProjects]);

  const downloadRequests = async () => {
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
          requestNo: requestIdentifier,
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
          requestNo: requestIdentifier,
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
            requestNo: requestIdentifier,
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
        {canComment && (
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
        )}
        <MoreActions
          options={moreActionsOptions}
          onSelectOption={handleMoreActions}
        />
      </div>
    </React.Fragment>
  );
};

export default TopBar;
