import intl from 'react-intl-universal';
import {
  Dropdown,
  FormLabel,
  TextArea,
  Typography,
} from '@getsynapse/design-system';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';
import {
  deletePropertiesComment,
  updatePropertiesComment,
  postPropertiesComment,
} from 'state/RequestComments/requestCommentsSlice';
import { exists } from '../helpers';
import { IntakeQuestions } from '../IntakeQuestions';
import classnames from 'classnames';
import { REQUEST_PROPERTIES, REQUEST_SECTIONS } from 'utils/constants';
import {
  newPropertyCommentType,
  PropertyCommentType,
  Request,
  RequestQuestion,
  UpdateReqData,
} from 'utils/customTypes';
import Comments from 'Organisms/Comments/Comments';
import getPropertyComments from 'Hooks/getPropertyComments';

const RequestDetails = ({
  requestData,
  requestQuestionsData,
  showComment = false,
  propertiesComments = {},
  disableFields = false,
  setUpdatedReqData = () => {},
  questionIdParam = '',
  propertyNameParam = '',
}: {
  requestQuestionsData: RequestQuestion[];
  requestData: Request;
  showComment?: boolean;
  setUpdatedReqData?: React.Dispatch<React.SetStateAction<UpdateReqData>>;
  propertiesComments?: {
    [key: string]: PropertyCommentType[];
  };
  disableFields?: boolean;
  questionIdParam?: string;
  propertyNameParam?: string;
}) => {
  const dispatch = useDispatch();
  const requestId = requestData.id!;

  const questions =
    exists(requestQuestionsData) &&
    requestQuestionsData.filter(
      (question: { section: string }) =>
        question && question.section === REQUEST_SECTIONS.REQUEST_DETAILS
    );

  const onChangeDescription = debounce((value: string) => {
    setUpdatedReqData((prevState: UpdateReqData) => {
      return {
        ...prevState,
        requestAttributes: {
          ...prevState.requestAttributes,
          description: value,
        },
      };
    });
  }, 500);

  const onChangeCompliance = (value: boolean) => {
    setUpdatedReqData((prevState: UpdateReqData) => ({
      ...prevState,
      requestAttributes: {
        ...prevState.requestAttributes,
        compliance: value,
      },
    }));
  };

  const onDeleteComment = (commentId: string, propertykey: string) => {
    dispatch(deletePropertiesComment({ commentId, propertykey }));
  };

  const onEditComment = ({
    commentId,
    content,
  }: {
    commentId: string;
    content: string;
  }) => {
    dispatch(updatePropertiesComment({ commentId, message: content }));
  };

  const onCreateComment = (content: string, propertykey: string) => {
    const newMessage: newPropertyCommentType = {
      message: content,
      isBaseComment: false,
      requestId: requestId,
      requestProperty: propertykey,
      userId: '',
    };
    dispatch(postPropertiesComment(newMessage));
  };

  return (
    <div>
      <Typography variant='h5' className='mt-8'>
        {intl.get('REQUEST_PAGE.REQUEST_DETAILS.TITLE')}
      </Typography>
      <Typography variant='caption' className='block mb-4 text-neutral-light'>
        {intl.get('REQUEST_PAGE.REQUEST_DETAILS.CAPTION')}
      </Typography>

      <div className='flex flex-col'>
        <div className='grid gap-y-6 gap-x-14 grid-cols-2'>
          <div>
            <div className={classnames('flex', 'justify-between')}>
              <Typography
                variant='label'
                weight='medium'
                data-cy='label__request-description'
                className='mb-1.5'
              >
                {intl.get(
                  'REQUEST_PAGE.REQUEST_DETAILS.FIELDS.REQUEST_DESCRIPTION'
                )}
              </Typography>
              {showComment && (
                <Comments
                  comments={getPropertyComments(
                    propertiesComments,
                    REQUEST_PROPERTIES.REQUEST_DESC
                  )}
                  onEdit={onEditComment}
                  onDelete={(commentId: string) =>
                    onDeleteComment(commentId, REQUEST_PROPERTIES.REQUEST_DESC)
                  }
                  onCreate={(content) =>
                    onCreateComment(content, REQUEST_PROPERTIES.REQUEST_DESC)
                  }
                  isPopupOpen={
                    propertyNameParam === REQUEST_PROPERTIES.REQUEST_DESC
                  }
                />
              )}
            </div>
            <TextArea
              textAreaProps={{
                placeholder: intl.get(
                  'REQUEST_PAGE.REQUEST_DETAILS.FIELDS.REQUEST_DESCRIPTION_PLACEHOLDER'
                ),
                defaultValue: requestData.description,
                'data-testid': 'field__request-description',
              }}
              onChange={(e) => onChangeDescription(e.target.value)}
              disabled={disableFields}
            />
          </div>

          <div>
            <div className='flex justify-between'>
              <FormLabel>
                {intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.PRIORITY')}
              </FormLabel>

              {showComment && (
                <Comments
                  comments={getPropertyComments(
                    propertiesComments,
                    REQUEST_PROPERTIES.COMPLIANCE
                  )}
                  onEdit={onEditComment}
                  onDelete={(commentId: string) =>
                    onDeleteComment(commentId, REQUEST_PROPERTIES.COMPLIANCE)
                  }
                  onCreate={(content) =>
                    onCreateComment(content, REQUEST_PROPERTIES.COMPLIANCE)
                  }
                  isPopupOpen={
                    propertyNameParam === REQUEST_PROPERTIES.COMPLIANCE
                  }
                />
              )}
            </div>

            <Dropdown
              options={[
                { label: intl.get('YES'), value: true },
                { label: intl.get('NO'), value: false },
              ]}
              disabled={disableFields}
              onChange={(option: { label: string; value: boolean }) =>
                onChangeCompliance(option.value)
              }
              values={[
                {
                  label: requestData.compliance
                    ? intl.get('YES')
                    : intl.get('NO'),
                  value: requestData.compliance,
                },
              ]}
            />
          </div>
        </div>

        <div className='grid gap-y-6 gap-x-14 grid-cols-2'>
          {questions && (
            <IntakeQuestions
              questions={questions}
              requestId={requestId}
              showComment={showComment}
              setUpdatedReqData={setUpdatedReqData}
              disableFields={disableFields}
              questionIdParam={questionIdParam}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
