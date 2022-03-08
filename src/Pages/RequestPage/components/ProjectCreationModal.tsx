import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createNewProject } from 'state/Projects/projectsSlice';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { selectUser } from 'state/User/userSlice';
import {
  selectLearningTeams,
  selectProjectCategories,
} from 'state/Organization/organizationSlice';
import {
  selectProjectProcesses,
  getOrganizationProcesses,
} from 'state/Processes/processesSlice';
import {
  getLDUsers,
  selectLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import { PROJECT_PRIORITY, PROJECT_PRIVACY, PATHS } from 'utils/constants';
import {
  Modal,
  Typography,
  TextField,
  Datepicker,
  FormItem,
  Dropdown,
  UsersPicker,
} from '@getsynapse/design-system';
import { MultipleOptionLI } from 'Pages/NewProjectPage/helpers/snippets';
import { UserOption, objKeyAsString } from 'utils/customTypes';
import useInlineNotification from 'Hooks/useInlineNotification';
import intl from 'react-intl-universal';

type Option = {
  label: string;
  value: any;
};

const ProjectCreationForm: React.FC<{
  updateValue: (newValue: objKeyAsString) => void;
  setLearningTeamIds: Dispatch<SetStateAction<string[]>>;
}> = ({ updateValue, setLearningTeamIds }) => {
  const currentUser = useSelector(selectUser);
  const learningTeams = useSelector(selectLearningTeams);
  const projectProcesses = useSelector(selectProjectProcesses);
  const projectCategories = useSelector(selectProjectCategories);
  const ldUsersSelector = useSelector(selectLDUsers);

  const processOptions = useMemo(
    () =>
      projectProcesses.map((process) => ({
        label: process.processName,
        value: process.id,
      })),
    [projectProcesses]
  );

  const privacyOptions = useMemo(
    () =>
      Object.keys(PROJECT_PRIVACY).map((key) => ({
        label: intl.get(`PROJECT_DETAIL.PRIVACY_OPTIONS.${key}`),
        value: PROJECT_PRIVACY[key],
      })),
    []
  );

  const categoryOptions = useMemo(
    () =>
      projectCategories.map((category) => ({
        label: category.categoryName,
        value: category.id,
      })),
    [projectCategories]
  );

  const teamOptions = useMemo(
    () =>
      learningTeams.map((team) => ({
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
    return ldUsers.filter((ldUser) => currentUser.id === ldUser.value);
  }, [currentUser, ldUsers]);

  const handlePickOwners = (owners: UserOption[]) => {
    const ownersIds = owners.map((owner) => owner.value);
    updateValue({ owners: ownersIds });
  };

  const [privacyMode, setPrivacyMode] = useState('');
  const getPrivacyHelperText = () => {
    switch (privacyMode) {
      case 'team':
        return intl.get('PROJECT_DETAIL.PRIVACY_TEAM_MESSAGE');
      case 'private':
        return intl.get('PROJECT_DETAIL.PRIVACY_PRIVATE_MESSAGE');
      default:
        return '';
    }
  };
  return (
    <div className='flex flex-col'>
      <Typography
        variant='body'
        weight='regular'
        className='text-neutral-black'
      >
        {intl.get('PROJECT_DETAIL.FILL_IN_INFORMATION_TITLE')}
      </Typography>
      <div className='grid gap-y-4 gap-x-10% grid-cols-2 mt-4'>
        <FormItem label={intl.get('PROJECT_DETAIL.PROJECT_NAME')}>
          <TextField
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateValue({ title: e.target.value })
            }
            placeholder={intl.get('PROJECT_DETAIL.PROJECT_NAME_PLACEHOLDER')}
            className='w-full'
            data-cy='project-input_name'
          />
        </FormItem>
        <FormItem
          label={intl.get('PROJECT_DETAIL.PROJECT_OWNERS')}
          className='text-primary-light font-medium'
        >
          <UsersPicker
            usersList={ldUsers}
            selectedUsersList={ownersList}
            onChange={handlePickOwners}
            maxLimit={2}
            required
          />
        </FormItem>
        <FormItem>
          <Datepicker
            className='flex justify-evenly w-full'
            canSelectRange={true}
            startDateLabel={intl.get('PROJECT_DETAIL.START_DATE')}
            size='large'
            onPickDate={(dates: any) =>
              updateValue({
                startDate: dates.startDate,
                targetCompletionDate: dates.endDate,
              })
            }
            endDateLabel={intl.get('PROJECT_DETAIL.END_DATE')}
            data-cy='project-input_date'
          />
        </FormItem>
        <FormItem label={intl.get('PROJECT_DETAIL.CATEGORY')}>
          <Dropdown
            placeholder={intl.get('PROJECT_DETAIL.CATEGORY_PLACEHOLDER')}
            onChange={(option: Option) =>
              updateValue({ category_id: option.value })
            }
            options={categoryOptions}
            triggerProps={{ 'data-cy': 'project-input_category' }}
          />
        </FormItem>
        <FormItem label={intl.get('PROJECT_DETAIL.PROCESS')}>
          <Dropdown
            placeholder={intl.get('PROJECT_DETAIL.PROCESS_PLACEHOLDER')}
            onChange={(option: Option) =>
              updateValue({ process_id: option.value })
            }
            options={processOptions}
            triggerProps={{ 'data-cy': 'project-input_process' }}
          />
        </FormItem>
        <FormItem label={intl.get('PROJECT_DETAIL.PRIORITY')}>
          <Dropdown
            placeholder={intl.get('PROJECT_DETAIL.PRIORITY_PLACEHOLDER')}
            onChange={(option: Option) =>
              updateValue({ priority: option.value })
            }
            options={priorityOptions}
            triggerProps={{ 'data-cy': 'project-input_priority' }}
          />
        </FormItem>
        <FormItem
          label={intl.get('PROJECT_DETAIL.PRIVACY')}
          helpText={getPrivacyHelperText()}
        >
          <Dropdown
            placeholder={intl.get('PROJECT_DETAIL.PRIVACY_PLACEHOLDER')}
            onChange={(option: Option) => {
              updateValue({ privacy: option.value });
              setPrivacyMode(option.value);
            }}
            options={privacyOptions}
            triggerProps={{ 'data-cy': 'project-input_privacy' }}
          />
        </FormItem>
        {privacyMode === PROJECT_PRIVACY.TEAM && (
          <FormItem label={intl.get('PROJECT_DETAIL.TEAM')}>
            <Dropdown
              multiple
              placeholder={intl.get('PROJECT_DETAIL.TEAM_PLACEHOLDER')}
              onChange={(options: Option[]) => {
                const ids = options.map((option) => option.value);
                setLearningTeamIds(ids);
              }}
              options={teamOptions}
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
              triggerProps={{ 'data-cy': 'project-input_detail' }}
            />
          </FormItem>
        )}
      </div>
    </div>
  );
};

const ProjectCreationModal = ({
  isOpen,
  setModalOpen,
  requestId,
}: {
  isOpen: boolean;
  setModalOpen: any;
  requestId: string;
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(selectUser);
  const [fieldsValues, setFieldsValues] = useState({
    title: '',
    category_id: '',
    privacy: '',
    priority: '',
    process_id: '',
    startDate: '',
    targetCompletionDate: '',
    owners: [currentUser.id],
  });
  const [learningTeamIds, setLearningTeamIds] = useState<string[]>([]);
  const { showInlineNotification } = useInlineNotification();

  useEffect(() => {
    if (isOpen) {
      dispatch(getOrganizationProcesses());
      dispatch(getLDUsers());
    }
  }, [dispatch, isOpen]);

  const updateValue = (newValue: any) =>
    setFieldsValues((prevData) => ({ ...prevData, ...newValue }));

  const [canCreateProject, setCanCreateProject] = useState(false);
  const createProject = useCallback(
    async (redirectToProject?: boolean) => {
      let createdProject;
      if (fieldsValues.privacy === PROJECT_PRIVACY.TEAM) {
        createdProject = await dispatch(
          createNewProject({
            ...fieldsValues,
            projectRequests: [requestId],
            learningTeams: learningTeamIds,
          })
        );
      } else {
        createdProject = await dispatch(
          createNewProject({ ...fieldsValues, projectRequests: [requestId] })
        );
      }
      const newProjectId = get(createdProject, 'payload.data.id', '');
      setModalOpen(false);
      if (newProjectId && redirectToProject) {
        history.push(`${PATHS.PROJECT_PAGE}/${newProjectId}`);
      }
      showInlineNotification(
        'success',
        intl.get('REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.SUCCESS_MESSAGE', {
          projectTitle: fieldsValues.title,
        })
      );
    },
    [
      dispatch,
      fieldsValues,
      history,
      requestId,
      setModalOpen,
      learningTeamIds,
      showInlineNotification,
    ]
  );

  const getActionButtons = useCallback(
    () => [
      {
        children: intl.get(
          'REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.SAVE_OPEN'
        ),
        variant: 'primary',
        disabled: !canCreateProject,
        onClick: () => createProject(true),
        'data-cy': 'save-open-project',
      },
      {
        children: intl.get(
          'REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.SAVE_NOW'
        ),
        variant: 'secondary',
        disabled: !canCreateProject,
        onClick: () => createProject(),
        'data-cy': 'save-project-now',
      },
      {
        children: intl.get('REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.CANCEL'),
        variant: 'tertiary',
        onClick: () => setModalOpen(false),
        'data-cy': 'cancel-project-creation',
      },
    ],
    [canCreateProject, createProject, setModalOpen]
  );

  const checkEmpty = (value: any) => {
    if (Array.isArray(value)) {
      return isEmpty(value);
    }
    return value == null || value === '';
  };

  useEffect(() => {
    if (
      fieldsValues.privacy === PROJECT_PRIVACY.TEAM &&
      isEmpty(learningTeamIds)
    ) {
      canCreateProject && setCanCreateProject(false);
    } else if (
      !Object.values(fieldsValues).some((value) => checkEmpty(value))
    ) {
      !canCreateProject && setCanCreateProject(true);
    } else {
      canCreateProject && setCanCreateProject(false);
    }
  }, [canCreateProject, fieldsValues, learningTeamIds]);

  const [modalProps, setModalProps] = useState({
    children: (
      <ProjectCreationForm
        setLearningTeamIds={setLearningTeamIds}
        updateValue={updateValue}
      />
    ),
    actionButtons: getActionButtons(),
  });

  useEffect(() => {
    setModalProps((prevData) => ({
      ...prevData,
      actionButtons: getActionButtons(),
    }));
  }, [canCreateProject, setModalProps, getActionButtons]);

  return (
    <Modal
      title={intl.get('REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.TITLE')}
      isOpen={isOpen}
      aria-label={intl.get('REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.TITLE')}
      childrenClassName='max-h-full'
      size='large'
      closeModal={() => setModalOpen(false)}
      data-cy='create-project-modal'
      {...modalProps}
    />
  );
};

export default ProjectCreationModal;
