import intl from 'react-intl-universal';
import debounce from 'lodash/debounce';
import {
  Dropdown,
  FormItem,
  TextField,
  Typography,
  UsersPicker,
} from '@getsynapse/design-system';
import { useDispatch, useSelector } from 'react-redux';
import {
  deletePropertiesComment,
  updatePropertiesComment,
  postPropertiesComment,
} from 'state/RequestComments/requestCommentsSlice';
import { IntakeQuestions } from 'Pages/IntakeQuestions';
import { isNotEmptyArray } from 'Pages/helpers';
import classnames from 'classnames';
import {
  REQUEST_PROPERTIES,
  REQUEST_STATUS,
  REQUEST_SECTIONS,
} from 'utils/constants';
import {
  newPropertyCommentType,
  PropertyCommentType,
  Request,
  RequestQuestion,
  RequestRequiredErrors,
  UpdateReqData,
} from 'utils/customTypes';
import Comments from 'Organisms/Comments/Comments';
import getPropertyComments from 'Hooks/getPropertyComments';
import { useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import {
  getLDUsers,
  selectLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import {
  getOrganization,
  selectFormattedBusinessTeams,
} from 'state/Teams/teamsSlice';
import { selectUserId } from 'state/User/userSlice';

type UserOption = {
  label: string;
  avatar: { initial?: string; imageSrc?: string };
  value: string;
};

type Props = {
  requestQuestionsData: RequestQuestion[];
  requestData: Request;
  showComment?: boolean;
  setUpdatedReqData?: React.Dispatch<React.SetStateAction<UpdateReqData>>;
  propertiesComments?: {
    [key: string]: PropertyCommentType[];
  };
  disableFields?: boolean;
  setErrors?: (error: boolean) => void;
  errors?: RequestRequiredErrors;
  setOwners?: Dispatch<SetStateAction<string[]>>;
  questionIdParam?: string;
  propertyNameParam?: string;
};

const BasicDetails = ({
  requestData,
  requestQuestionsData,
  showComment = false,
  propertiesComments = {},
  setUpdatedReqData = () => {},
  disableFields = false,
  setErrors = () => {},
  errors = {},
  setOwners = () => {},
  questionIdParam = '',
  propertyNameParam = '',
}: Props) => {
  const dispatch = useDispatch();
  const hasError = useMemo(() => Boolean(errors.title), [errors.title]);
  const requestId = requestData.id!;
  const questions =
    isNotEmptyArray(requestQuestionsData) &&
    requestQuestionsData.filter(
      (question: { section: string }) =>
        question && question.section === REQUEST_SECTIONS.BASIC_DETAILS
    );

  const userId = useSelector(selectUserId);
  const isRequestOwner = requestData.owners?.some((user) => user.id === userId);
  const ldUsersSelector = useSelector(selectLDUsers);
  const businessTeams = useSelector(selectFormattedBusinessTeams);

  const ldUsers = useMemo(
    () =>
      ldUsersSelector.map((user) => {
        return {
          label: `${user.data.firstName} ${user.data.lastName}`,
          avatar: {
            imageSrc: user.avatar_url,
            initial: `${user.data.firstName.charAt(
              0
            )}${user.data.lastName.charAt(0)}`,
          },
          value: user.id,
        };
      }),
    [ldUsersSelector]
  );
  const ownersList = useMemo(() => {
    return ldUsers.filter((ldUser) =>
      requestData.owners?.map((owner) => owner.id).includes(ldUser.value)
    );
  }, [requestData.owners, ldUsers]);

  useEffect(() => {
    if (isRequestOwner) {
      dispatch(getLDUsers());
    }
    dispatch(getOrganization());
  }, [dispatch, isRequestOwner]);

  const onTitleChange = debounce((value: string) => {
    setUpdatedReqData((prevState: UpdateReqData) => {
      return {
        ...prevState,
        requestAttributes: {
          ...prevState.requestAttributes,
          title: value,
        },
      };
    });
  }, 500);

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
      isBaseComment: true,
      requestId: requestId,
      requestProperty: propertykey,
      userId: '',
    };
    dispatch(postPropertiesComment(newMessage));
  };

  const changeOwners = (owners: UserOption[]) => {
    const ownersIds = owners.map((owner) => owner.value);
    setOwners(ownersIds);
  };

  const changeBusinessUnit = (option: any) => {
    setUpdatedReqData((prevState: UpdateReqData) => {
      return {
        ...prevState,
        requestAttributes: {
          ...prevState.requestAttributes,
          business_team_id: option.value,
        },
      };
    });
  };

  return (
    <div data-cy='basic-details'>
      <Typography variant='h5' className='mt-8'>
        {intl.get('REQUEST_PAGE.BASIC_DETAILS.TITLE')}
      </Typography>
      <Typography
        variant='caption'
        className='block w-56 mb-4 text-neutral-light'
      >
        {intl.get('REQUEST_PAGE.BASIC_DETAILS.CAPTION')}
      </Typography>

      <div className='flex flex-col'>
        <div className='grid gap-y-6 gap-x-14 grid-cols-2'>
          {isRequestOwner && requestData.status !== REQUEST_STATUS.DRAFT && (
            <div>
              <div className='relative'>
                {showComment && (
                  <Comments
                    comments={getPropertyComments(
                      propertiesComments,
                      REQUEST_PROPERTIES.REQUEST_OWNER
                    )}
                    className={classnames('absolute', 'right-0')}
                    onEdit={onEditComment}
                    onDelete={(commentId: string) =>
                      onDeleteComment(
                        commentId,
                        REQUEST_PROPERTIES.REQUEST_OWNER
                      )
                    }
                    onCreate={(content) =>
                      onCreateComment(content, REQUEST_PROPERTIES.REQUEST_OWNER)
                    }
                    isPopupOpen={
                      propertyNameParam === REQUEST_PROPERTIES.REQUEST_OWNER
                    }
                  />
                )}
                <FormItem
                  label={intl.get(
                    'REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUEST_OWNER'
                  )}
                  data-cy='label__request-owner'
                >
                  <UsersPicker
                    usersList={ldUsers}
                    selectedUsersList={ownersList}
                    onChange={changeOwners}
                    required
                    disabled={!isRequestOwner || disableFields}
                    triggerProps={{ 'data-cy': 'add_owner-button' }}
                  />
                </FormItem>
              </div>
            </div>
          )}
          <div>
            <div className={classnames('flex', 'justify-between', 'mb-2')}>
              <Typography
                variant='caption'
                className='text-neutral-light'
                data-cy='label__request-number'
              >
                {intl.get('REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUEST_NUMBER')}
              </Typography>
              {showComment && (
                <Comments
                  comments={getPropertyComments(
                    propertiesComments,
                    REQUEST_PROPERTIES.REQUEST_IDENTIFIER
                  )}
                  onEdit={onEditComment}
                  onDelete={(commentId) =>
                    onDeleteComment(
                      commentId,
                      REQUEST_PROPERTIES.REQUEST_IDENTIFIER
                    )
                  }
                  onCreate={(content) =>
                    onCreateComment(
                      content,
                      REQUEST_PROPERTIES.REQUEST_IDENTIFIER
                    )
                  }
                  testId='request-number'
                  isPopupOpen={
                    propertyNameParam === REQUEST_PROPERTIES.REQUEST_IDENTIFIER
                  }
                />
              )}
            </div>
            <TextField
              disabled
              variant='text'
              length='medium'
              defaultValue={requestData.requestIdentifier}
              data-cy='field__request-number'
            />
          </div>
          <div>
            <div className='relative'>
              {showComment && (
                <Comments
                  comments={getPropertyComments(
                    propertiesComments,
                    REQUEST_PROPERTIES.BUSINESS_UNIT
                  )}
                  className={classnames('absolute', 'right-0')}
                  onEdit={onEditComment}
                  onDelete={(commentId: string) =>
                    onDeleteComment(commentId, REQUEST_PROPERTIES.BUSINESS_UNIT)
                  }
                  onCreate={(content) =>
                    onCreateComment(content, REQUEST_PROPERTIES.BUSINESS_UNIT)
                  }
                  testId='business-unit'
                  isPopupOpen={
                    propertyNameParam === REQUEST_PROPERTIES.BUSINESS_UNIT
                  }
                />
              )}
              <FormItem
                label={intl.get(
                  'REQUEST_PAGE.BASIC_DETAILS.FIELDS.BUSINESS_UNIT'
                )}
                data-cy='label__business-unit'
              >
                <Dropdown
                  options={businessTeams}
                  values={[
                    {
                      label: requestData.businessTeam?.title,
                      value: requestData.businessTeam?.id,
                    },
                  ]}
                  triggerProps={{ 'data-cy': 'field__business-unit' }}
                  disabled={disableFields}
                  onChange={changeBusinessUnit}
                />
              </FormItem>
            </div>
          </div>
          <div>
            <div className='relative'>
              {showComment && (
                <Comments
                  comments={getPropertyComments(
                    propertiesComments,
                    REQUEST_PROPERTIES.REQUEST_TITLE
                  )}
                  className={classnames('absolute', 'right-0')}
                  onEdit={onEditComment}
                  onDelete={(commentId) =>
                    onDeleteComment(commentId, REQUEST_PROPERTIES.REQUEST_TITLE)
                  }
                  onCreate={(content) =>
                    onCreateComment(content, REQUEST_PROPERTIES.REQUEST_TITLE)
                  }
                  testId='request-title'
                  isPopupOpen={
                    propertyNameParam === REQUEST_PROPERTIES.REQUEST_TITLE
                  }
                />
              )}
              <FormItem
                label={intl.get(
                  'REQUEST_PAGE.BASIC_DETAILS.FIELDS.REQUEST_TITLE'
                )}
                data-cy='label__request-title'
                labelProps={{ state: hasError ? 'error' : 'default' }}
              >
                <TextField
                  variant='text'
                  length='medium'
                  onChange={(e: { target: { value: string } }) => {
                    if (e.target.value !== '') {
                      setErrors(false);
                    }
                    onTitleChange(e.target.value);
                  }}
                  defaultValue={requestData.title}
                  data-cy='field__request-title'
                  disabled={disableFields}
                  state={hasError ? 'error' : 'default'}
                  helpText={
                    hasError
                      ? intl.get(
                          'REQUEST_PAGE.BASIC_DETAILS.ERRORS.MISSING_INPUT'
                        )
                      : ''
                  }
                />
              </FormItem>
            </div>
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

export default BasicDetails;
