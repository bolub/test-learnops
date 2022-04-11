import { useState, useEffect, useMemo, Fragment, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import isEmpty from 'lodash/isEmpty';
import { Tabs } from '@getsynapse/design-system';
import BasicDetails from './BasicDetailsPage';
import RequestDetails from './RequestDetailsPage';
import AdditonalDetails from './AdditionalDetailsPage';
import LDOnlyPage from './LDOnlyPage';
import TopBar from './components/TopBar';
import {
  getPropertiesComments,
  selectPropertiesComments,
} from 'state/RequestComments/requestCommentsSlice';
import { selectUserId, selectUserType } from 'state/User/userSlice';
import { REQUEST_STATUS, USER_TYPES } from 'utils/constants';
import {
  Request,
  RequestPageTabs,
  RequestQuestion,
  RequestRequiredErrors,
  UpdateReqData,
} from 'utils/customTypes';
import PendingCancellationBanner from './components/PendingCancellationBanner';
import { RequestContext } from './RequestPage';
import classnames from 'classnames';

type Props = {
  activeTabIndex: RequestPageTabs;
  setActiveTabIndex: React.Dispatch<React.SetStateAction<RequestPageTabs>>;
  requestData: Request;
  requestQuestionsData: RequestQuestion[];
  setUpdatedReqData?: React.Dispatch<React.SetStateAction<UpdateReqData>>;
  errors?: RequestRequiredErrors;
  setErrors?: (error: boolean) => void;
  setOwners?: React.Dispatch<React.SetStateAction<string[]>>;
  questionIdParam?: string;
  propertyNameParam?: string;
  requestDataStatus?: string;
};

const DetailsPage = ({
  activeTabIndex,
  setActiveTabIndex,
  requestData,
  requestQuestionsData,
  setUpdatedReqData = () => {},
  errors = {},
  setErrors = () => {},
  setOwners = () => {},
  questionIdParam = '',
  propertyNameParam = '',
  requestDataStatus = '',
}: Props) => {
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(false);
  const propertiesComments = useSelector(selectPropertiesComments);
  const requestId = requestData.id!;
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);
  const [questionId, setQuestionId] = useState(questionIdParam);
  const [propertyName, setPropertyName] = useState(propertyNameParam);

  useEffect(() => {
    dispatch(getPropertiesComments(requestId));
  }, [dispatch, requestId]);

  useEffect(() => {
    if (questionIdParam || propertyNameParam) {
      setQuestionId(questionIdParam);
      setPropertyName(propertyNameParam);
      setShowComment(true);
    } else {
      setQuestionId('');
      setPropertyName('');
      setShowComment(false);
    }
  }, [questionIdParam, propertyNameParam]);

  const isOwner = useMemo(() => {
    if (!isEmpty(requestData.owners)) {
      return requestData.owners!.some((owner) => owner.id === userId);
    } else {
      return false;
    }
  }, [requestData, userId]);

  const showPendingCancellationBanner =
    requestData.status === REQUEST_STATUS.PENDING_CANCEL &&
    requestData.owners?.some((owner) => owner.id === userId);

  const { areBasicAndRequestDisabled, isAdditionalDisabled, isLDDisabled } =
    useContext(RequestContext);

  const tabs = useMemo(() => {
    const availableTabs = [
      {
        label: intl.get('REQUEST_PAGE.TABS.BASIC'),
        content: (
          <Fragment>
            {showPendingCancellationBanner && (
              <PendingCancellationBanner requestData={requestData} />
            )}
            <BasicDetails
              requestData={requestData}
              requestQuestionsData={requestQuestionsData}
              showComment={showComment}
              propertiesComments={propertiesComments}
              setUpdatedReqData={setUpdatedReqData}
              disableFields={areBasicAndRequestDisabled}
              setErrors={setErrors}
              errors={errors}
              setOwners={setOwners}
              questionIdParam={questionId}
              propertyNameParam={propertyName}
            />
          </Fragment>
        ),
      },
      {
        label: intl.get('REQUEST_PAGE.TABS.REQUEST'),
        content: (
          <Fragment>
            {showPendingCancellationBanner && (
              <PendingCancellationBanner requestData={requestData} />
            )}
            <RequestDetails
              requestData={requestData}
              requestQuestionsData={requestQuestionsData}
              showComment={showComment}
              propertiesComments={propertiesComments}
              setUpdatedReqData={setUpdatedReqData}
              disableFields={areBasicAndRequestDisabled}
              questionIdParam={questionIdParam}
              propertyNameParam={propertyNameParam}
            />
          </Fragment>
        ),
      },
    ];
    if (requestData.status !== REQUEST_STATUS.DRAFT) {
      availableTabs.push({
        label: intl.get('REQUEST_PAGE.TABS.ADDITIONAL'),
        content: (
          <Fragment>
            {showPendingCancellationBanner && (
              <PendingCancellationBanner requestData={requestData} />
            )}
            <AdditonalDetails
              requestData={requestData}
              requestQuestionsData={requestQuestionsData}
              showComment={showComment}
              setUpdatedReqData={setUpdatedReqData}
              disableFields={isAdditionalDisabled}
              questionIdParam={questionIdParam}
            />
          </Fragment>
        ),
      });

      if (userType === USER_TYPES.L_D) {
        availableTabs.push({
          label: intl.get('REQUEST_PAGE.TABS.L_D'),
          content: (
            <Fragment>
              {showPendingCancellationBanner && (
                <PendingCancellationBanner requestData={requestData} />
              )}
              <LDOnlyPage
                requestData={requestData}
                requestQuestionsData={requestQuestionsData}
                setUpdatedReqData={setUpdatedReqData}
                showComment={showComment}
                disableFields={isLDDisabled}
                propertiesComments={propertiesComments}
                errors={errors}
                questionIdParam={questionIdParam}
                propertyNameParam={propertyNameParam}
              />
            </Fragment>
          ),
        });
      }
    }

    return availableTabs;
  }, [
    showPendingCancellationBanner,
    requestData,
    requestQuestionsData,
    showComment,
    propertiesComments,
    setUpdatedReqData,
    areBasicAndRequestDisabled,
    setErrors,
    errors,
    setOwners,
    questionId,
    propertyName,
    questionIdParam,
    propertyNameParam,
    isAdditionalDisabled,
    userType,
    isLDDisabled,
  ]);

  const toggleComment = () => {
    setShowComment((prevShowComments) => !prevShowComments);
    setQuestionId('');
    setPropertyName('');
  };

  return (
    <div
      className={classnames({
        'py-12': requestDataStatus === REQUEST_STATUS.DRAFT,
      })}
    >
      {requestDataStatus !== REQUEST_STATUS.DRAFT && (
        <TopBar
          toggleComment={toggleComment}
          showComment={showComment}
          requestData={requestData}
          isOwner={isOwner}
        />
      )}
      <div className='mt-4 mb-3.5 px-4' data-cy='details-tabs'>
        <Tabs
          tabListProps={{ className: 'sticky top-20 bg-neutral-white z-5' }}
          data={tabs}
          index={activeTabIndex}
          onChange={(index) => setActiveTabIndex(index as RequestPageTabs)}
        />
      </div>
    </div>
  );
};

export default DetailsPage;
