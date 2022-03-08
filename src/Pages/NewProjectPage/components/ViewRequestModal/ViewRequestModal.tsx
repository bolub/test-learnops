import { useState } from 'react';
import intl from 'react-intl-universal';
import { useSelector } from 'react-redux';
import {
  selectActiveRequest,
  selectActiveRequestQuestions,
} from 'state/ActiveRequest/activeRequestSlice';
import { selectUserType } from 'state/User/userSlice';
import { Tabs } from '@getsynapse/design-system';
import { USER_TYPES } from 'utils/constants';
import BasicDetails from 'Pages/RequestPage/BasicDetailsPage';
import RequestDetails from 'Pages/RequestPage/RequestDetailsPage';
import AdditionalDetails from 'Pages/RequestPage/AdditionalDetailsPage';
import LDOnlyPage from 'Pages/RequestPage/LDOnlyPage';

const ViewRequestModal = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const request = useSelector(selectActiveRequest);
  const requestQuestions = useSelector(selectActiveRequestQuestions);
  const userType = useSelector(selectUserType);

  return (
    <div className='p-1'>
      <Tabs
        index={currentTabIndex}
        onChange={(index: number) => setCurrentTabIndex(index)}
        data={[
          {
            label: intl.get(
              'NEW_PROJECT_PAGE.VIEW_PROJECT_MODAL.BASIC_DETAILS'
            ),
            content: (
              <BasicDetails
                requestData={request}
                requestQuestionsData={requestQuestions}
                disableFields
              />
            ),
          },
          {
            label: intl.get(
              'NEW_PROJECT_PAGE.VIEW_PROJECT_MODAL.REQUEST_DETAILS'
            ),
            content: (
              <RequestDetails
                requestData={request}
                requestQuestionsData={requestQuestions}
                disableFields
              />
            ),
          },
          {
            label: intl.get(
              'NEW_PROJECT_PAGE.VIEW_PROJECT_MODAL.ADDITIONAL_DETAILS'
            ),
            content: (
              <AdditionalDetails
                requestData={request}
                requestQuestionsData={requestQuestions}
                disableFields
              />
            ),
          },
          ...(userType === USER_TYPES.L_D
            ? [
                {
                  label: intl.get(
                    'NEW_PROJECT_PAGE.VIEW_PROJECT_MODAL.LD_ONLY'
                  ),
                  content: (
                    <LDOnlyPage
                      requestData={request}
                      requestQuestionsData={requestQuestions}
                      disableFields
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
};

export default ViewRequestModal;
