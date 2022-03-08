import React, { Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import get from 'lodash/get';
import {
  Typography,
  FormItem,
  TextField,
  Dropdown,
  TextArea,
  Datepicker,
  UsersPicker,
} from '@getsynapse/design-system';
import { useSelector, useDispatch } from 'react-redux';
import { selectRequestsByStatus } from 'state/Requests/requestSlice';
import {
  selectBussinessTeams,
  selectLearningTeams,
  selectProjectCategories,
} from 'state/Organization/organizationSlice';
import {
  getOrganizationProcesses,
  selectProjectProcesses,
} from 'state/Processes/processesSlice';
import {
  getRequest,
  getRequestQuestions,
} from 'state/ActiveRequest/activeRequestSlice';
import useModal from 'Hooks/useModal';
import {
  NEW_PROJECT_FORM_FIELDS,
  REQUEST_STATUS,
  PROJECT_PRIORITY,
  PROJECT_PRIVACY,
  PROJECT_STATUS,
  PROJECT_HEALTH,
} from 'utils/constants';
import {
  getLDUsers,
  selectLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import { selectUser } from 'state/User/userSlice';
import { MultipleOptionLI } from '../helpers/snippets';
import LinkedProjectRequestsTable from './LinkedProjectRequestsTable';
import ProjectRequestsLinking from 'Organisms/ProjectRequestsLinking/ProjectRequestsLinking';
import ProjectHealtPicker from 'Organisms/ProjectHealtPicker/ProjectHealtPicker';
import ViewRequestModal from './ViewRequestModal/ViewRequestModal';
import handleFieldChange from '../helpers/handleFieldChange';
import TimelineDates from './TimelineDates/TimelineDates';
import {
  NewProject,
  objKeyAsString,
  Request,
  UserOption,
  ProjectCategory,
  LearningTeam,
  Option,
} from 'utils/customTypes';

type BasicDetailsProps = {
  data: NewProject;
  setData: Dispatch<SetStateAction<NewProject>>;
  requiredFieldsErrors: objKeyAsString;
  isOnUpdatingPage?: boolean;
  isReadOnly?: boolean;
  originalData?: NewProject;
};

const BasicDetails: React.FC<BasicDetailsProps> = ({
  data,
  setData,
  requiredFieldsErrors,
  isOnUpdatingPage = false,
  isReadOnly = false,
  originalData,
}) => {
  const dispatch = useDispatch();
  const approvedRequests = useSelector(
    selectRequestsByStatus(REQUEST_STATUS.APPROVED)
  );
  const ldUsersSelector = useSelector(selectLDUsers);
  const currentUser = useSelector(selectUser);
  const { Modal, modalProps, openModal } = useModal();
  const linkedRequestIds = data.projectRequests;
  const bussinessTeams = useSelector(selectBussinessTeams);
  const learningTeams = useSelector(selectLearningTeams);
  const projectProcesses = useSelector(selectProjectProcesses);
  const projectCategories = useSelector(selectProjectCategories);
  const displayActualCompletionDatePicker =
    isOnUpdatingPage &&
    [PROJECT_STATUS.COMPLETED, PROJECT_STATUS.CLOSED].includes(data.status);

  useEffect(() => {
    dispatch(getOrganizationProcesses());
  }, [dispatch]);

  const handleFormFieldChange = (fieldName: string, fieldValue: any) => {
    handleFieldChange(fieldName, fieldValue, setData);
  };

  const unLinkRequestHandle = (requestId: string) => {
    setData((prevData) => ({
      ...prevData,
      projectRequests: prevData.projectRequests.filter(
        (id: string) => id !== requestId
      ),
    }));
  };

  const linkRequestHandler = (request: Request) => {
    setData((prevData) => ({
      ...prevData,
      projectRequests: prevData.projectRequests
        ? prevData.projectRequests.concat(request.id!)
        : [request.id!],
    }));
  };

  const changeOwners = (owners: UserOption[]) => {
    const ownersIds = owners.map((owner) => owner.value);
    handleFormFieldChange(NEW_PROJECT_FORM_FIELDS.PROJECT_OWNERS, ownersIds);
  };

  useEffect(() => {
    dispatch(getLDUsers());
  }, [dispatch]);

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
    return ldUsers.filter((ldUser) => data.owners?.includes(ldUser.value));
  }, [data.owners, ldUsers]);

  const currentUserOption = useMemo(() => {
    return ldUsers.filter((ldUser) => currentUser.id === ldUser.value);
  }, [currentUser, ldUsers]);

  useEffect(() => {
    if (!isOnUpdatingPage) {
      setData((prevData) => ({ ...prevData, owners: [currentUser.id!] }));
    }
  }, [currentUser.id, setData, isOnUpdatingPage]);

  const availableRequestsList = useMemo(
    () =>
      approvedRequests.filter(
        (request: Request) => !data.projectRequests.includes(request.id!)
      ),
    [approvedRequests, data.projectRequests]
  );

  const linkedRequestsList = useMemo(
    () =>
      approvedRequests.filter((request: Request) =>
        linkedRequestIds.includes(request.id!)
      ),
    [approvedRequests, linkedRequestIds]
  );

  const businessUnitOptions = useMemo(
    () =>
      bussinessTeams.map((businessUnit: any) => ({
        label: businessUnit.title,
        value: businessUnit.id,
      })),
    [bussinessTeams]
  );

  const categoryOptions = useMemo(
    () =>
      projectCategories.map((category: ProjectCategory) => ({
        label: category.categoryName,
        value: category.id,
      })),
    [projectCategories]
  );

  const processOptions = useMemo(
    () =>
      projectProcesses.map((process) => ({
        label: process.processName,
        value: process.id,
      })),
    [projectProcesses]
  );

  const stageOptions = useMemo(() => {
    let optionsList: Option[] = [];
    if (data.process_id) {
      const selectedProcess = projectProcesses.find(
        (process) => process.id === data.process_id
      );
      if (selectedProcess) {
        optionsList = selectedProcess.projectStages.map((stage) => ({
          label: stage.stageName,
          value: stage.id,
        }));
      }
    }
    return optionsList;
  }, [projectProcesses, data.process_id]);

  const statusOptions = useMemo(() => {
    const { CLOSED, CANCELED, ...remainingStatus } = PROJECT_STATUS;
    const statusList = { ...remainingStatus };
    const options = Object.keys(statusList).map((key) => ({
      label: intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.${key}`),
      value: PROJECT_STATUS[key],
    }));
    if (data.status === PROJECT_STATUS.CLOSED) {
      options.push({
        label: intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.CLOSED`),
        value: PROJECT_STATUS.CLOSED,
      });
    }
    if (data.status === PROJECT_STATUS.CANCELED) {
      options.push({
        label: intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.CANCELED`),
        value: PROJECT_STATUS.CANCELED,
      });
    }
    return options;
  }, [data.status]);

  const privacyOptions = useMemo(() => {
    if (isOnUpdatingPage && originalData?.privacy) {
      if (originalData?.privacy === PROJECT_PRIVACY.TEAM) {
        return [
          {
            label: intl.get('PROJECT_DETAIL.PRIVACY_OPTIONS.TEAM'),
            value: PROJECT_PRIVACY.TEAM,
          },
          {
            label: intl.get('PROJECT_DETAIL.PRIVACY_OPTIONS.PUBLIC'),
            value: PROJECT_PRIVACY.PUBLIC,
          },
        ];
      }

      if (originalData?.privacy === PROJECT_PRIVACY.PUBLIC) {
        return [
          {
            label: intl.get('PROJECT_DETAIL.PRIVACY_OPTIONS.PUBLIC'),
            value: PROJECT_PRIVACY.PUBLIC,
          },
          {
            label: intl.get('PROJECT_DETAIL.PRIVACY_OPTIONS.TEAM'),
            value: PROJECT_PRIVACY.TEAM,
          },
        ];
      }
    }
    return Object.keys(PROJECT_PRIVACY).map((key) => ({
      label: intl.get(`PROJECT_DETAIL.PRIVACY_OPTIONS.${key}`),
      value: PROJECT_PRIVACY[key],
    }));
  }, [isOnUpdatingPage, originalData?.privacy]);

  const healthOptions = useMemo(
    () =>
      Object.keys(PROJECT_HEALTH).map((key) => ({
        label: intl.get(`PROJECT_DETAIL.HEALTH_OPTIONS.${key}`),
        value: PROJECT_HEALTH[key],
      })),
    []
  );

  const teamOptions = useMemo(
    () =>
      learningTeams.map((team: LearningTeam) => ({
        label: team.name,
        value: team.id,
      })),
    [learningTeams]
  );

  const priorityOptions = useMemo(
    () =>
      Object.keys(PROJECT_PRIORITY).map((key) => ({
        label: intl.get(`PROJECT_DETAIL.PRIORITY_OPTIONS.${key}`),
        value: PROJECT_PRIORITY[key],
      })),
    []
  );

  const viewRequestHandle = async (request: Request) => {
    await dispatch(getRequest(request.id!));
    await dispatch(getRequestQuestions(request.id!));
    openModal({
      title: request.title,
      size: 'large',
      childrenClassName: 'min-h-96',
      children: <ViewRequestModal />,
    });
  };

  const getPrivacyHelperText = () => {
    if (requiredFieldsErrors?.privacy) {
      return intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR');
    }
    switch (data.privacy) {
      case 'team':
        return intl.get('PROJECT_DETAIL.PRIVACY_TEAM_MESSAGE');
      case 'private':
        return intl.get('PROJECT_DETAIL.PRIVACY_PRIVATE_MESSAGE');
      default:
        return '';
    }
  };

  const getInitialValueForDropDown = (
    options: Option[],
    values: string[] | string
  ) => {
    if (!values) {
      return [];
    }
    return options.filter(
      (option) => values === option.value || values.includes(option.value)
    );
  };

  const shouldShowHealthField =
    isOnUpdatingPage &&
    [
      PROJECT_STATUS.IN_PROGRESS,
      PROJECT_STATUS.COMPLETED,
      PROJECT_STATUS.CLOSED,
    ].includes(data.status);

  return (
    <div className='mt-8'>
      <Modal
        {...modalProps}
        aria-label={intl.get('NEW_PROJECT_PAGE.VIEW_PROJECT_MODAL.TITLE')}
        data-cy='view-linked-request-modal'
      />
      <Typography variant='h5'>
        {intl.get('PROJECT_DETAIL.BASIC_INFORMATION_TITLE')}
      </Typography>
      {!isOnUpdatingPage && (
        <Typography variant='caption'>
          {intl.get('PROJECT_DETAIL.BASIC_INFORMATION_SUBTITLE')}
        </Typography>
      )}
      <div className='grid gap-y-6 gap-x-10% grid-cols-2 mt-8'>
        <FormItem
          label={intl.get('PROJECT_DETAIL.PROJECT_NAME')}
          helpText={
            requiredFieldsErrors?.title &&
            intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
          }
          helpTextProps={{
            state: requiredFieldsErrors?.title ? 'error' : 'default',
          }}
          labelProps={{
            required: true,
            state: requiredFieldsErrors?.title ? 'error' : 'default',
          }}
        >
          <TextField
            variant='text'
            placeholder={intl.get('PROJECT_DETAIL.PROJECT_NAME_PLACEHOLDER')}
            value={data.title}
            state={requiredFieldsErrors?.title ? 'error' : 'default'}
            disabled={isReadOnly}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleFormFieldChange(
                NEW_PROJECT_FORM_FIELDS.TITLE,
                event.target.value
              )
            }
            data-cy='project-name-input'
          />
        </FormItem>
        <FormItem
          label={intl.get('PROJECT_DETAIL.PROJECT_OWNERS')}
          helpText={
            requiredFieldsErrors?.owners &&
            intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
          }
          helpTextProps={{
            state: requiredFieldsErrors?.owners ? 'error' : 'default',
          }}
          labelProps={{
            required: true,
            state: requiredFieldsErrors?.owners ? 'error' : 'default',
          }}
        >
          <UsersPicker
            disabled={isReadOnly}
            usersList={ldUsers}
            selectedUsersList={
              isOnUpdatingPage ? ownersList : currentUserOption
            }
            onChange={changeOwners}
            maxLimit={2}
            required
          />
        </FormItem>
        <FormItem label={intl.get('PROJECT_DETAIL.DESCRIPTION')}>
          <TextArea
            disabled={isReadOnly}
            value={data.description}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleFormFieldChange(
                NEW_PROJECT_FORM_FIELDS.DESCRIPTION,
                event.target.value
              )
            }
            textAreaProps={{
              placeholder: intl.get('PROJECT_DETAIL.DESCRIPTION_PLACEHOLDER'),
              className: 'max-h-32',
              'data-cy': 'project-description-input',
            }}
          />
        </FormItem>
        <div>
          <FormItem
            label={intl.get('PROJECT_DETAIL.BUSINESS_UNIT')}
            helpText={
              requiredFieldsErrors?.businessUnitId &&
              intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.businessUnitId ? 'error' : 'default',
            }}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.businessUnitId ? 'error' : 'default',
            }}
          >
            <Dropdown
              disabled={isReadOnly}
              placeholder={intl.get('PROJECT_DETAIL.BUSINESS_UNIT_PLACEHOLDER')}
              onChange={(option: Option) =>
                handleFormFieldChange(
                  NEW_PROJECT_FORM_FIELDS.BUSINESS_UNIT,
                  option.value
                )
              }
              values={getInitialValueForDropDown(
                businessUnitOptions,
                data[NEW_PROJECT_FORM_FIELDS.BUSINESS_UNIT]
              )}
              options={businessUnitOptions}
              state={requiredFieldsErrors?.businessUnitId ? 'error' : 'default'}
              triggerProps={{
                'data-cy': 'project-business-input',
              }}
            />
          </FormItem>
          <FormItem
            className='mt-6'
            label={intl.get('PROJECT_DETAIL.CATEGORY')}
            helpText={
              requiredFieldsErrors?.category_id &&
              intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.category_id ? 'error' : 'default',
            }}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.category_id ? 'error' : 'default',
            }}
          >
            <Dropdown
              disabled={isReadOnly}
              placeholder={intl.get('PROJECT_DETAIL.CATEGORY_PLACEHOLDER')}
              onChange={(option: Option) =>
                handleFormFieldChange(
                  NEW_PROJECT_FORM_FIELDS.CATEGORY,
                  option.value
                )
              }
              options={categoryOptions}
              values={getInitialValueForDropDown(
                categoryOptions,
                data[NEW_PROJECT_FORM_FIELDS.CATEGORY]
              )}
              state={requiredFieldsErrors?.category_id ? 'error' : 'default'}
              triggerProps={{ 'data-cy': 'project-category' }}
            />
          </FormItem>
        </div>
        <TimelineDates
          startDate={data.startDate}
          targetCompletionDate={data.targetCompletionDate}
          requiredFieldsErrors={requiredFieldsErrors}
          handleFormFieldChange={handleFormFieldChange}
          originalData={originalData}
          disabled={isReadOnly}
          isOnUpdatingPage={isOnUpdatingPage}
        />
        <Datepicker
          disabled={isReadOnly}
          className='w-full'
          startDate={data.targetLaunchDate && new Date(data.targetLaunchDate)}
          startDateLabel={intl.get('PROJECT_DETAIL.TARGET_LAUNCH_DATE')}
          size='large'
          onPickDate={(date: object) =>
            handleFormFieldChange(
              NEW_PROJECT_FORM_FIELDS.TARGET_LAUNCH_DATE,
              date
            )
          }
          data-cy='project-target-input'
        />
        <div
          className={classnames({
            'grid grid-cols-2 gap-6': displayActualCompletionDatePicker,
          })}
        >
          <FormItem
            label={intl.get('PROJECT_DETAIL.STATUS')}
            helpText={
              requiredFieldsErrors?.status &&
              intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.status ? 'error' : 'default',
            }}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.status ? 'error' : 'default',
            }}
          >
            <Dropdown
              disabled={isReadOnly}
              placeholder={intl.get('PROJECT_DETAIL.STATUS_PLACEHOLDER')}
              state={requiredFieldsErrors?.status ? 'error' : 'default'}
              onChange={(option: Option) =>
                handleFormFieldChange(
                  NEW_PROJECT_FORM_FIELDS.STATUS,
                  option.value
                )
              }
              values={getInitialValueForDropDown(
                statusOptions,
                data[NEW_PROJECT_FORM_FIELDS.STATUS]
              )}
              options={statusOptions}
              triggerProps={{ 'data-cy': 'project-status-input' }}
            />
          </FormItem>
          {displayActualCompletionDatePicker && (
            <FormItem
              label={intl.get('PROJECT_DETAIL.ACTUAL_COMPLETION_DATE')}
              helpText={
                requiredFieldsErrors?.actualDate &&
                intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
              }
              helpTextProps={{
                state: requiredFieldsErrors?.actualDate ? 'error' : 'default',
              }}
              labelProps={{
                required: true,
                state: requiredFieldsErrors?.actualDate ? 'error' : 'default',
              }}
            >
              <Datepicker
                disabled={isReadOnly}
                className='w-full'
                startDate={data.actualDate && new Date(data.actualDate)}
                size='large'
                onPickDate={(date: object) =>
                  handleFormFieldChange(
                    NEW_PROJECT_FORM_FIELDS.ACTUAL_COMPLETION_DATE,
                    date
                  )
                }
                data-cy='project-completion-input'
              />
            </FormItem>
          )}
        </div>
        <FormItem label={intl.get('PROJECT_DETAIL.PRIORITY')}>
          <Dropdown
            disabled={isReadOnly}
            placeholder={intl.get('PROJECT_DETAIL.PRIORITY_PLACEHOLDER')}
            onChange={(option: Option) =>
              handleFormFieldChange(
                NEW_PROJECT_FORM_FIELDS.PRIORITY,
                option.value
              )
            }
            values={getInitialValueForDropDown(
              priorityOptions,
              data[NEW_PROJECT_FORM_FIELDS.PRIORITY]
            )}
            options={priorityOptions}
            triggerProps={{ 'data-cy': 'project-priority-input' }}
          />
        </FormItem>
        {shouldShowHealthField && (
          <FormItem label={intl.get('PROJECT_DETAIL.HEALTH')}>
            <ProjectHealtPicker
              onChange={handleFormFieldChange}
              options={healthOptions}
              disabled={isReadOnly}
              values={getInitialValueForDropDown(
                healthOptions,
                data[NEW_PROJECT_FORM_FIELDS.HEALTH]
              )}
            />
          </FormItem>
        )}
      </div>
      <div className='border-neutral-lighter border-t py-8 mt-8'>
        <Typography variant='h5'>
          {intl.get('PROJECT_DETAIL.SHARING')}
        </Typography>
        <div
          className='grid gap-y-6 gap-x-10% grid-cols-2 mt-4'
          data-cy='project-privacy-helper-text'
        >
          <FormItem
            label={intl.get('PROJECT_DETAIL.PRIVACY')}
            helpText={getPrivacyHelperText()}
            helpTextProps={{
              state: requiredFieldsErrors?.privacy ? 'error' : 'default',
            }}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.privacy ? 'error' : 'default',
            }}
          >
            <Dropdown
              disabled={isReadOnly}
              placeholder={intl.get('PROJECT_DETAIL.PRIVACY_PLACEHOLDER')}
              values={getInitialValueForDropDown(
                privacyOptions,
                data[NEW_PROJECT_FORM_FIELDS.PRIVACY]
              )}
              onChange={(option: Option) =>
                handleFormFieldChange(
                  NEW_PROJECT_FORM_FIELDS.PRIVACY,
                  option.value
                )
              }
              options={privacyOptions}
              state={requiredFieldsErrors?.privacy ? 'error' : 'default'}
              triggerProps={{ 'data-cy': 'project-privacy-input' }}
            />
          </FormItem>
          {get(data, 'privacy', '') === 'team' && (
            <FormItem
              label={intl.get('PROJECT_DETAIL.TEAM')}
              helpText={
                requiredFieldsErrors?.privacy &&
                intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
              }
              helpTextProps={{
                state: requiredFieldsErrors?.privacy ? 'error' : 'default',
              }}
              labelProps={{
                required: true,
                state: requiredFieldsErrors?.privacy ? 'error' : 'default',
              }}
            >
              <Dropdown
                disabled={isReadOnly}
                placeholder={intl.get('PROJECT_DETAIL.TEAM_PLACEHOLDER')}
                triggerProps={{ 'data-cy': 'project-team-input' }}
                onChange={(options: Option[]) =>
                  handleFormFieldChange(NEW_PROJECT_FORM_FIELDS.TEAMS, options)
                }
                multiple
                options={teamOptions}
                values={getInitialValueForDropDown(
                  teamOptions,
                  data.learningTeams
                )}
                state={requiredFieldsErrors?.privacy ? 'error' : 'default'}
                renderOption={(
                  option: Option,
                  isSelected: boolean,
                  selectOption,
                  { className, ...otherProps }
                ) => (
                  <li
                    {...otherProps}
                    className={classnames('group', className, {
                      'hover:bg-primary focus-visible:bg-primary': isSelected,
                    })}
                  >
                    <MultipleOptionLI
                      label={option.label}
                      isSelected={isSelected}
                      selectOption={selectOption}
                    />
                  </li>
                )}
              />
            </FormItem>
          )}
        </div>
      </div>
      <div className='border-neutral-lighter border-t border-b py-8'>
        <Typography variant='h5'>
          {intl.get('PROJECT_DETAIL.PROJECT_PROCESS_SECTION')}
        </Typography>
        <div className='grid gap-y-6 gap-x-10% grid-cols-2 mt-4'>
          <FormItem
            label={intl.get('PROJECT_DETAIL.PROCESS')}
            helpText={
              requiredFieldsErrors?.process_id &&
              intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.process_id ? 'error' : 'default',
            }}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.process_id ? 'error' : 'default',
            }}
          >
            <Dropdown
              disabled={isReadOnly || isOnUpdatingPage}
              placeholder={intl.get('PROJECT_DETAIL.PROCESS_PLACEHOLDER')}
              onChange={(option: Option) =>
                handleFormFieldChange(
                  NEW_PROJECT_FORM_FIELDS.PROCESS,
                  option.value
                )
              }
              values={getInitialValueForDropDown(
                processOptions,
                data[NEW_PROJECT_FORM_FIELDS.PROCESS]
              )}
              state={requiredFieldsErrors?.process_id ? 'error' : 'default'}
              options={processOptions}
              triggerProps={{ 'data-cy': 'project-process-input' }}
            />
          </FormItem>
          <FormItem
            label={intl.get('PROJECT_DETAIL.STAGE')}
            helpText={
              requiredFieldsErrors?.stage_id &&
              intl.get('NEW_PROJECT_PAGE.MISSING_INFO_ERROR')
            }
            helpTextProps={{
              state: requiredFieldsErrors?.stage_id ? 'error' : 'default',
            }}
            labelProps={{
              required: true,
              state: requiredFieldsErrors?.stage_id ? 'error' : 'default',
            }}
          >
            <Dropdown
              disabled={isReadOnly}
              placeholder={intl.get('PROJECT_DETAIL.STAGE_PLACEHOLDER')}
              values={getInitialValueForDropDown(
                stageOptions,
                data[NEW_PROJECT_FORM_FIELDS.STAGE]
              )}
              onChange={(option: Option) =>
                handleFormFieldChange(
                  NEW_PROJECT_FORM_FIELDS.STAGE,
                  option.value
                )
              }
              options={stageOptions}
              state={requiredFieldsErrors?.stage_id ? 'error' : 'default'}
              triggerProps={{
                'data-cy': 'project-stage-input',
              }}
            />
          </FormItem>
        </div>
      </div>
      <div className='mt-10'>
        <Typography variant='h5' className='mt-8 mb-4'>
          {intl.get('PROJECT_DETAIL.LINKED_REQUESTS_SECTION.TITLE')}
        </Typography>
        <LinkedProjectRequestsTable
          requestsList={linkedRequestsList}
          unLinkRequest={unLinkRequestHandle}
          viewRequest={viewRequestHandle}
          disabled={isReadOnly}
        />
        <ProjectRequestsLinking
          disabled={isReadOnly}
          placeholder={intl.get(
            'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.PLACEHOLDER'
          )}
          triggerTitle={intl.get(
            'PROJECT_DETAIL.LINKED_REQUESTS_SECTION.LINK_REQUEST'
          )}
          availableItemsList={availableRequestsList}
          onLinkItem={linkRequestHandler}
        />
      </div>
    </div>
  );
};

export default BasicDetails;
