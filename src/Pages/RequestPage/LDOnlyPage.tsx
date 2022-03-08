import intl from 'react-intl-universal';
import {
  Dropdown,
  FormHelperText,
  FormLabel,
  TextArea,
  Typography,
} from '@getsynapse/design-system';
import set from 'lodash/set';
import {
  newPropertyCommentType,
  PropertyCommentType,
  Request,
  RequestQuestion,
  RequestRequiredErrors,
  UpdateReqData,
} from 'utils/customTypes';
import { useMemo } from 'react';
import IntakeQuestions from 'Pages/IntakeQuestions';
import Comments from 'Organisms/Comments/Comments';
import getPropertyComments from 'Hooks/getPropertyComments';
import {
  deletePropertiesComment,
  postPropertiesComment,
  updatePropertiesComment,
} from 'state/RequestComments/requestCommentsSlice';
import {
  REQUEST_LD_PRIORITY,
  REQUEST_PROPERTIES,
  REQUEST_SECTIONS,
} from 'utils/constants';
import { useDispatch } from 'react-redux';

type Props = {
  requestData: Request;
  requestQuestionsData: RequestQuestion[];
  setUpdatedReqData?: React.Dispatch<React.SetStateAction<UpdateReqData>>;
  showComment?: boolean;
  disableFields?: boolean;
  propertiesComments?: {
    [key: string]: PropertyCommentType[];
  };
  errors?: RequestRequiredErrors;
  questionIdParam?: string;
  propertyNameParam?: string;
};

const LDOnlyPage = ({
  requestData,
  requestQuestionsData,
  setUpdatedReqData = () => {},
  showComment = false,
  disableFields = false,
  propertiesComments = {},
  errors = {},
  questionIdParam = '',
  propertyNameParam = '',
}: Props) => {
  const dispatch = useDispatch();
  const questions = useMemo(
    () =>
      requestQuestionsData.filter(
        (question) => question.section === REQUEST_SECTIONS.LD_DETAILS
      ),
    [requestQuestionsData]
  );
  const hasError = useMemo<boolean>(
    () => Boolean(errors.ldPriority),
    [errors.ldPriority]
  );

  const onChange = (path: string, value: any) => {
    setUpdatedReqData((prevData: UpdateReqData) => {
      set(prevData, path, value);

      return { ...prevData };
    });
  };

  const onDeleteComment = (commentId: string, propertykey: string) => {
    dispatch(deletePropertiesComment({ commentId, propertykey }));
  };

  const onEditComment = async ({
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
      isBaseComment: true,
      requestId: requestData.id!,
      requestProperty: propertykey,
      userId: '',
    };
    dispatch(postPropertiesComment(newMessage));
  };

  return (
    <div className='mt-8 mb-12'>
      <Typography variant='h5' data-cy='ld-only_title'>
        {intl.get('REQUEST_PAGE.L_D_SECTION.TITLE')}
      </Typography>
      <Typography variant='caption' className='block mb-4 text-neutral-light'>
        {intl.get('REQUEST_PAGE.L_D_SECTION.CAPTION')}
      </Typography>

      <div className='grid gap-y-6 gap-x-14 grid-cols-2'>
        <div>
          <div className='flex justify-between'>
            <FormLabel state={hasError ? 'error' : 'default'}>
              {intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.PRIORITY')}
            </FormLabel>

            {showComment && (
              <Comments
                comments={getPropertyComments(
                  propertiesComments,
                  REQUEST_PROPERTIES.LD_PRIORITY
                )}
                onEdit={onEditComment}
                onDelete={(commentId: string) =>
                  onDeleteComment(commentId, REQUEST_PROPERTIES.LD_PRIORITY)
                }
                onCreate={(content) =>
                  onCreateComment(content, REQUEST_PROPERTIES.LD_PRIORITY)
                }
                isPopupOpen={
                  propertyNameParam === REQUEST_PROPERTIES.LD_PRIORITY
                }
              />
            )}
          </div>

          <Dropdown
            options={[
              {
                label: intl.get(
                  `REQUEST_PAGE.L_D_SECTION.PRIORITY_OPTIONS.${REQUEST_LD_PRIORITY.HIGH}`
                ),
                value: REQUEST_LD_PRIORITY.HIGH,
              },
              {
                label: intl.get(
                  `REQUEST_PAGE.L_D_SECTION.PRIORITY_OPTIONS.${REQUEST_LD_PRIORITY.MEDIUM}`
                ),
                value: REQUEST_LD_PRIORITY.MEDIUM,
              },
              {
                label: intl.get(
                  `REQUEST_PAGE.L_D_SECTION.PRIORITY_OPTIONS.${REQUEST_LD_PRIORITY.LOW}`
                ),
                value: REQUEST_LD_PRIORITY.LOW,
              },
              {
                label: intl.get(
                  `REQUEST_PAGE.L_D_SECTION.PRIORITY_OPTIONS.${REQUEST_LD_PRIORITY.UNASSIGNED}`
                ),
                value: REQUEST_LD_PRIORITY.UNASSIGNED,
              },
            ]}
            disabled={disableFields}
            onChange={(option) => {
              onChange(
                `requestAttributes.${REQUEST_PROPERTIES.LD_PRIORITY}`,
                option.value
              );
            }}
            values={[
              {
                label: intl.get(
                  `REQUEST_PAGE.L_D_SECTION.PRIORITY_OPTIONS.${requestData.ldPriority}`
                ),
                value: requestData.ldPriority,
              },
            ]}
            state={hasError ? 'error' : 'default'}
            triggerProps={{ 'data-cy': 'ld-only_priority-dropdown' }}
          />
          {hasError && (
            <FormHelperText state='error'>
              {intl.get('REQUEST_PAGE.BASIC_DETAILS.ERRORS.MISSING_INPUT')}
            </FormHelperText>
          )}
        </div>

        <div />

        <div>
          <div className='flex justify-between'>
            <FormLabel>
              {intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.EFFORT')}
            </FormLabel>

            {showComment && (
              <Comments
                comments={getPropertyComments(
                  propertiesComments,
                  REQUEST_PROPERTIES.EFFORT
                )}
                onEdit={onEditComment}
                onDelete={(commentId: string) =>
                  onDeleteComment(commentId, REQUEST_PROPERTIES.EFFORT)
                }
                onCreate={(content) =>
                  onCreateComment(content, REQUEST_PROPERTIES.EFFORT)
                }
                isPopupOpen={propertyNameParam === REQUEST_PROPERTIES.EFFORT}
              />
            )}
          </div>

          <TextArea
            onChange={(e) =>
              onChange(
                `requestAttributes.${REQUEST_PROPERTIES.EFFORT}`,
                e.target.value
              )
            }
            textAreaProps={{
              defaultValue: requestData.effort,
              'data-cy': 'ld-only_estimated-effort',
            }}
            disabled={disableFields}
          />
        </div>

        <div>
          <div className='flex justify-between'>
            <FormLabel>
              {intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.COST')}
            </FormLabel>

            {showComment && (
              <Comments
                comments={getPropertyComments(
                  propertiesComments,
                  REQUEST_PROPERTIES.COST
                )}
                onEdit={onEditComment}
                onDelete={(commentId: string) =>
                  onDeleteComment(commentId, REQUEST_PROPERTIES.COST)
                }
                onCreate={(content) =>
                  onCreateComment(content, REQUEST_PROPERTIES.COST)
                }
                isPopupOpen={propertyNameParam === REQUEST_PROPERTIES.COST}
              />
            )}
          </div>

          <TextArea
            onChange={(e) =>
              onChange(
                `requestAttributes.${REQUEST_PROPERTIES.COST}`,
                e.target.value
              )
            }
            textAreaProps={{
              defaultValue: requestData.cost,
              'data-cy': 'ld-only_estimated-cost',
            }}
            disabled={disableFields}
          />
        </div>

        <div>
          <div className='flex justify-between'>
            <FormLabel>
              {intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.COMMENTS')}
            </FormLabel>

            {showComment && (
              <Comments
                comments={getPropertyComments(
                  propertiesComments,
                  REQUEST_PROPERTIES.ADDITONAL_INFORMATION
                )}
                onEdit={onEditComment}
                onDelete={(commentId: string) =>
                  onDeleteComment(
                    commentId,
                    REQUEST_PROPERTIES.ADDITONAL_INFORMATION
                  )
                }
                onCreate={(content) =>
                  onCreateComment(
                    content,
                    REQUEST_PROPERTIES.ADDITONAL_INFORMATION
                  )
                }
                isPopupOpen={
                  propertyNameParam === REQUEST_PROPERTIES.ADDITONAL_INFORMATION
                }
              />
            )}
          </div>

          <TextArea
            onChange={(e) =>
              onChange('requestAttributes.data', {
                ...requestData.data,
                [REQUEST_PROPERTIES.ADDITONAL_INFORMATION]: e.target.value,
              })
            }
            textAreaProps={{
              defaultValue: requestData.data?.additionalInformation,
              'data-cy': 'ld-only_comments',
            }}
            disabled={disableFields}
          />
        </div>

        <div />

        <IntakeQuestions
          questions={questions}
          requestId={requestData.id!}
          showComment={showComment}
          setUpdatedReqData={setUpdatedReqData}
          disableFields={disableFields}
          questionIdParam={questionIdParam}
        />
      </div>
    </div>
  );
};

export default LDOnlyPage;
