import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useElevation, Typography } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import moment from 'moment';
import {
  PATHS,
  REQUEST_REQUIRED_FIELDS,
  REQUEST_STATUS,
  REQUEST_SECTIONS,
  REQUEST_PROPERTIES,
} from 'utils/constants';
import {
  RequestPageTabs,
  UpdateReqData,
  RequestRequiredFields,
  RequestRequiredErrors,
  RequestQuestion,
} from 'utils/customTypes';
import { exists } from 'Pages/helpers';
import { getForms, selectHasForms } from 'state/Forms/formSlice';
import {
  editRequest,
  getRequest,
  getRequestQuestions,
  resetActiveRequest,
  selectActiveRequest,
  selectActiveRequestQuestions,
  selectActiveRequestSliceStatus,
  updateRequestQuestions,
  updateOwners,
  selectIsActiveRequestAForm,
} from 'state/ActiveRequest/activeRequestSlice';
import {
  selectOrganizationId,
  selectUserId,
  selectUserType,
} from 'state/User/userSlice';
import DetailsPage from './DetailsPage';
import FooterButtons from './components/FooterButtons/FooterButtons';
import RequestPageSidebar from 'Organisms/RequestPageSidebar/RequestPageSidebar';
import Loader from 'Molecules/Loader/Loader';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import { USER_TYPES } from 'utils/constants';
import { values } from 'lodash';
import { formatRequestIdentifier } from 'Pages/helpers';

export const RequestContext = createContext<{
  areBasicAndRequestDisabled: boolean;
  isAdditionalDisabled: boolean;
  isLDDisabled: boolean;
  isSubmitUpdateDisabled: boolean;
}>({
  areBasicAndRequestDisabled: true,
  isAdditionalDisabled: true,
  isLDDisabled: true,
  isSubmitUpdateDisabled: true,
});

const RequestPage = () => {
  const footerElevation = useElevation(2);
  const { requestId } = useParams<{ requestId: string }>();
  const dispatch = useDispatch();
  const hasForms = useSelector(selectHasForms);
  const organizationId = useSelector(selectOrganizationId);
  const requestSliceStatus = useSelector(selectActiveRequestSliceStatus);
  const requestData = useSelector(selectActiveRequest);
  const requestQuestionsData = useSelector(selectActiveRequestQuestions);
  const history = useHistory();
  const [updatedReqData, setUpdatedReqData] = useState<UpdateReqData>({
    requestAttributes: {},
    requestQuestions: {},
  });
  const [owners, setOwners] = useState<string[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<RequestPageTabs>(0);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [errors, setErrors] = useState<RequestRequiredErrors>({
    [REQUEST_REQUIRED_FIELDS.TITLE]: false,
    [REQUEST_REQUIRED_FIELDS.LD_PRIORITY]: false,
  });
  const [questionIdParam, setQuestionIdParam] = useState<string>('');
  const [propertyNameParam, setPropertNameParam] = useState<string>('');
  const requestDataStatus = (requestData && requestData.status) || '';
  const showError = useCallback(
    (field: RequestRequiredFields) => {
      dispatch(
        setNotificationText(intl.get('REQUEST_PAGE.NOTIFICATIONS.MISSING_INFO'))
      );
      dispatch(setNotificationTimeout(4000));
      dispatch(setNotificationVariant('error'));
      dispatch(displayNotification());
      setHasErrors(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: true,
      }));
    },
    [dispatch]
  );

  const isForm = useSelector(selectIsActiveRequestAForm);
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);

  const requestIdentifier = useMemo(
    () => formatRequestIdentifier(get(requestData, 'requestIdentifier')!),
    [requestData]
  );

  const isOwner = useMemo(() => {
    if (!isEmpty(requestData.owners)) {
      return requestData.owners!.some((owner) => owner.id === userId);
    } else {
      return false;
    }
  }, [requestData, userId]);

  const questionsWithoutLd = useMemo(
    () => requestQuestionsData.filter((que) => que.section !== 'ldDetails'),
    [requestQuestionsData]
  );

  const questionsOnlyLd = useMemo(
    () => requestQuestionsData.filter((que) => que.section === 'ldDetails'),
    [requestQuestionsData]
  );

  const filteredRequestQuestions =
    userType === USER_TYPES.L_D &&
    requestData.status === REQUEST_STATUS.SUBMITTED
      ? questionsOnlyLd
      : questionsWithoutLd;

  useEffect(() => {
    setUpdatedReqData((prev) => ({
      ...prev,
      requestQuestions: filteredRequestQuestions.reduce(
        (reqQuestions, questionData) => ({
          ...reqQuestions,
          [questionData.id]: questionData,
        }),
        {}
      ),
    }));
  }, [filteredRequestQuestions]);

  const isSubmitUpdateDisabled = useMemo<boolean>(() => {
    const answeredQuestions = values(updatedReqData.requestQuestions).filter(
      (questionData: RequestQuestion) => {
        if (!questionData?.data?.isRequired) return true;

        if (questionData?.type === 'radio') {
          return (
            exists(questionData?.data?.value?.value) &&
            questionData?.data?.value?.value !== ''
          );
        }

        if (questionData?.type === 'checkbox') {
          const checkedItems = questionData?.data?.value?.items?.filter(
            (item: any) => {
              return item?.checked;
            }
          );
          return checkedItems.length > 0;
        }

        if (questionData?.type === 'dropdown') {
          return (
            exists(questionData?.data?.value?.value) &&
            questionData?.data?.value?.value?.value !== ''
          );
        }
        return questionData?.data?.value !== '';
      }
    );

    return answeredQuestions.length !== filteredRequestQuestions.length;
  }, [updatedReqData, filteredRequestQuestions]);

  const isRequester = useMemo<boolean>(
    () => requestData.requester_id === userId,
    [requestData.requester_id, userId]
  );

  const isDraftOrSubmitted = useMemo<boolean>(
    () =>
      requestData.status === REQUEST_STATUS.DRAFT ||
      requestData.status === REQUEST_STATUS.SUBMITTED,
    [requestData.status]
  );

  const isCancelStage = useMemo(
    () =>
      requestData.status === REQUEST_STATUS.CANCELED ||
      requestData.status === REQUEST_STATUS.PENDING_CANCEL,
    [requestData.status]
  );

  const isDeclined = useMemo<boolean>(
    () => requestData.status === REQUEST_STATUS.REJECTED,
    [requestData.status]
  );

  const areBasicAndRequestDisabled = useMemo<boolean>(() => {
    if (!isForm && (isOwner || isRequester) && isDraftOrSubmitted) {
      return false;
    }

    return true;
  }, [isDraftOrSubmitted, isForm, isOwner, isRequester]);

  const isAdditionalDisabled = useMemo<boolean>(() => {
    if (!isForm && (isOwner || isRequester) && !isCancelStage && !isDeclined) {
      return false;
    }

    return true;
  }, [isCancelStage, isDeclined, isForm, isOwner, isRequester]);

  const isLDDisabled = useMemo<boolean>(() => {
    if (!isForm && isOwner && !isCancelStage && !isDeclined) {
      return false;
    }

    return true;
  }, [isCancelStage, isDeclined, isForm, isOwner]);

  const changeHasErrors = (error: boolean) => {
    setHasErrors(error);
  };
  const checkRequestTitle = () => {
    const updatedTitle = updatedReqData.requestAttributes.title;
    const originalTitle = requestData.title;

    if (isNil(updatedTitle)) {
      if (isEmpty(originalTitle)) {
        showError(REQUEST_REQUIRED_FIELDS.TITLE);
        return false;
      }
    } else if (isEmpty(updatedTitle)) {
      showError(REQUEST_REQUIRED_FIELDS.TITLE);
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    const reqAttributesToUpdate = updatedReqData.requestAttributes;
    const reqQuestionsToUpdate = updatedReqData.requestQuestions;
    if (!checkRequestTitle()) {
      return;
    }
    await dispatch(
      editRequest({
        request: { ...requestData, ...reqAttributesToUpdate },
        updateData: { status: 'submitted' },
      })
    );
    await dispatch(
      updateRequestQuestions({
        requestId,
        updateData: reqQuestionsToUpdate,
      })
    );
    history.push(PATHS.REQUESTS_LIST_PAGE);
    dispatch(setNotificationVariant('success'));
    dispatch(setNotificationTimeout(4000));
    dispatch(
      setNotificationText(
        intl.get('REQUEST_PAGE.NOTIFICATIONS.REQUEST_SUBMIT', {
          requestNo: requestIdentifier,
        })
      )
    );
    dispatch(displayNotification());
  };

  const onUpdate = async () => {
    const reqAttributesToUpdate = updatedReqData.requestAttributes;
    const reqQuestionsToUpdate = updatedReqData.requestQuestions;
    if (!checkRequestTitle()) {
      return;
    }
    if (!isEmpty(owners)) {
      await dispatch(updateOwners({ requestId, ownersIds: owners }));
      setOwners([]);
    }
    await dispatch(
      editRequest({
        request: { ...requestData, ...reqAttributesToUpdate },
        updateData: {},
      })
    );
    await dispatch(
      updateRequestQuestions({
        requestId,
        updateData: reqQuestionsToUpdate,
      })
    );
    dispatch(setNotificationVariant('success'));
    dispatch(setNotificationTimeout(4000));
    dispatch(
      setNotificationText(
        intl.get('REQUEST_PAGE.NOTIFICATIONS.MODIFICATION_SUCCESS', {
          requestNo: requestIdentifier,
        })
      )
    );
    dispatch(displayNotification());
    history.push(PATHS.REQUESTS_LIST_PAGE);
  };

  useEffect(() => {
    if (organizationId) {
      dispatch(getForms({ organizationId, published: true }));
    }
  }, [organizationId, dispatch, hasForms]);

  useEffect(() => {
    if (requestId) {
      dispatch(getRequest(requestId));
      dispatch(getRequestQuestions(requestId));
    }
    return () => {
      dispatch(resetActiveRequest());
    };
  }, [requestId, dispatch]);

  useEffect(() => {
    if (requestSliceStatus === 'failed') {
      history.push(PATHS.REQUESTS_LIST_PAGE);
    }
  }, [requestSliceStatus, history]);

  useEffect(() => {
    const questionId = new URLSearchParams(window.location.search).get(
      'questionId'
    );
    const propertyName = new URLSearchParams(window.location.search).get(
      'propertyName'
    );

    if (questionId && isEmpty(questionIdParam)) {
      setQuestionIdParam(questionId);
      const question = requestQuestionsData.find(
        (question) => question.id === questionId
      );
      switch (question?.section) {
        case REQUEST_SECTIONS.REQUEST_DETAILS:
          setActiveTabIndex(1);
          break;
        case REQUEST_SECTIONS.ADDITIONAL_DETAILS:
          setActiveTabIndex(2);
          break;
        case REQUEST_SECTIONS.LD_DETAILS:
          setActiveTabIndex(3);
          break;
        default:
          setActiveTabIndex(0);
      }
    } else if (propertyName && isEmpty(propertyNameParam)) {
      setPropertNameParam(propertyName);
      switch (propertyName) {
        case REQUEST_PROPERTIES.COMPLIANCE:
        case REQUEST_PROPERTIES.REQUEST_DESC:
          setActiveTabIndex(1);
          break;
        case REQUEST_PROPERTIES.LD_PRIORITY:
        case REQUEST_PROPERTIES.EFFORT:
        case REQUEST_PROPERTIES.COST:
        case REQUEST_PROPERTIES.ADDITONAL_INFORMATION:
          setActiveTabIndex(3);
          break;
        default:
          setActiveTabIndex(0);
      }
    }
  }, [propertyNameParam, questionIdParam, requestQuestionsData]);

  return (
    <RequestContext.Provider
      value={{
        areBasicAndRequestDisabled,
        isAdditionalDisabled,
        isLDDisabled,
        isSubmitUpdateDisabled,
      }}
    >
      <div className='h-full flex flex-col'>
        <PageTitle
          titleComponent={
            requestData.title
              ? requestData.title
              : intl.get('REQUEST_PAGE.TITLE')
          }
          headerChildren={
            requestData.status === REQUEST_STATUS.SUBMITTED && (
              <Typography
                variant='label'
                className='text-neutral-black'
                data-cy='request-title'
              >
                {intl.get('REQUEST_PAGE.SUBMITTED_ON', {
                  date: moment(requestData.submittedAt).format('M-D-YYYY'),
                  user: `${get(requestData, 'requester.data.firstName')} ${get(
                    requestData,
                    'requester.data.lastName'
                  )}`,
                })}
              </Typography>
            )
          }
          dataCy='request-title'
        />
        <main
          id='request-tabs-container'
          className='mt-4 mx-6 flex-grow overflow-y-auto flex space-x-4'
        >
          {(requestDataStatus === REQUEST_STATUS.DRAFT ||
            requestDataStatus === '') && (
            <RequestPageSidebar requestId={requestId} />
          )}

          <div
            data-cy='request-details-overflow'
            className='flex-grow bg-neutral-white h-full overflow-y-auto'
          >
            {requestSliceStatus !== 'loading' && exists(requestData) && (
              <DetailsPage
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
                requestData={requestData}
                requestQuestionsData={requestQuestionsData}
                setUpdatedReqData={setUpdatedReqData}
                errors={errors}
                setErrors={changeHasErrors}
                setOwners={setOwners}
                questionIdParam={questionIdParam}
                propertyNameParam={propertyNameParam}
                requestDataStatus={requestDataStatus}
              />
            )}
            {requestSliceStatus === 'loading' && !exists(requestData) && (
              <Loader />
            )}
          </div>
        </main>
        <div
          className={classnames(
            'h-12 z-5 px-8',
            'flex-shrink-0',
            'bg-neutral-white',
            'flex items-center',
            'w-full justify-between',
            footerElevation
          )}
        >
          <FooterButtons
            activeTabIndex={activeTabIndex}
            setActiveTabIndex={setActiveTabIndex}
            onSubmit={onSubmit}
            onUpdate={onUpdate}
            requestDataStatus={requestDataStatus}
            hasErrors={hasErrors}
          />
        </div>
      </div>
    </RequestContext.Provider>
  );
};

export default RequestPage;
