import { Typography, FlyoutMenu } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { isNotEmptyArray } from '../helpers';
import { IntakeQuestions } from '../IntakeQuestions';
import { REQUEST_SECTIONS } from 'utils/constants';
import { Request, RequestQuestion, UpdateReqData } from 'utils/customTypes';
import { createRequestQuestions } from 'state/ActiveRequest/activeRequestSlice';
import upload from 'assets/icons/upload.svg';
import textField from 'assets/icons/textField.svg';
import at from 'assets/icons/at.svg';

const AdditionalDetails = ({
  requestData,
  requestQuestionsData,
  showComment = false,
  setUpdatedReqData = () => {},
  disableFields = false,
  questionIdParam = '',
}: {
  requestData: Request;
  requestQuestionsData: RequestQuestion[];
  showComment?: boolean;
  setUpdatedReqData?: React.Dispatch<React.SetStateAction<UpdateReqData>>;
  disableFields?: boolean;
  questionIdParam?: string;
}) => {
  const dispatch = useDispatch();

  const requestId = requestData.id!;
  const questions =
    isNotEmptyArray(requestQuestionsData) &&
    requestQuestionsData.filter(
      (question: { section: string }) =>
        question && question.section === REQUEST_SECTIONS.ADDITIONAL_DETAILS
    );

  const addQuestion = async (questionType: string) => {
    await dispatch(createRequestQuestions({ requestId, questionType }));
  };

  return (
    <div className='grid gap-y-6 gap-x-20 grid-cols-2 mt-8 mb-12'>
      <div>
        <Typography variant='h5' data-cy='label__additional-details'>
          {intl.get('REQUEST_PAGE.ADDITIONAL_DETAILS.TITLE')}
        </Typography>

        <Typography variant='caption' className='block mb-4 text-neutral-light'>
          {intl.get('REQUEST_PAGE.ADDITIONAL_DETAILS.CAPTION')}
        </Typography>
      </div>

      <div />

      {questions && (
        <IntakeQuestions
          questions={questions}
          requestId={requestId}
          sectionName='additionalSection'
          showComment={showComment}
          setUpdatedReqData={setUpdatedReqData}
          disableFields={disableFields}
          questionIdParam={questionIdParam}
        />
      )}

      {!disableFields && (
        <div className='col-span-2'>
          <Typography variant='h4' className='mt-6'>
            {intl.get('REQUEST_PAGE.ADDITIONAL_DETAILS.FIELDS.ADD_MORE')}
          </Typography>
          <Typography
            variant='caption'
            className='block mb-4 text-neutral-light'
          >
            {intl.get(
              'REQUEST_PAGE.ADDITIONAL_DETAILS.FIELDS.ADD_MORE_CAPTION'
            )}
          </Typography>

          <FlyoutMenu
            options={[
              {
                icon: {
                  description: 'URL',
                  src: at,
                  color: 'default',
                  onClick: () => addQuestion('url'),
                  'data-testid': 'url-trigger',
                },
                label: intl.get(
                  'REQUEST_PAGE.ADDITIONAL_DETAILS.FLY_OUT_MENU.URL'
                ),
              },
              {
                icon: {
                  description: 'Upload File',
                  name: 'fileUpload',
                  src: upload,
                  color: 'default',
                  onClick: () => addQuestion('file'),
                  'data-testid': 'upload-trigger',
                },
                label: intl.get(
                  'REQUEST_PAGE.ADDITIONAL_DETAILS.FLY_OUT_MENU.FILE_UPLOAD'
                ),
              },
              {
                icon: {
                  description: 'Text Field',
                  name: 'text',
                  src: textField,
                  color: 'default',
                  onClick: () => addQuestion('customTextArea'),
                  'data-testid': 'textArea-trigger',
                },
                label: intl.get(
                  'REQUEST_PAGE.ADDITIONAL_DETAILS.FLY_OUT_MENU.TEXT_FIELD'
                ),
              },
            ]}
            label={intl.get('DESIGN_COMPONENTS.FLYOUT_MENU_NAME')}
          />
        </div>
      )}
    </div>
  );
};

export default AdditionalDetails;
