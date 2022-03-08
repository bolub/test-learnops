import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {
  Typography,
  Icon,
  Button,
  Tabs,
  useElevation,
} from '@getsynapse/design-system';
import { PATHS, NEW_PROJECT_FORM_FIELDS } from 'utils/constants';
import { getAllRequests } from 'state/Requests/requestSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import { createNewProject } from 'state/Projects/projectsSlice';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import BasicDetails from './components/BasicDetails';
import BudgetDetails from './components/BudgetDetails';
import ResourcesDetails from './components/ResourcesDetails';
import {
  defaultNewProjectData,
  requiredFields,
  requiredFieldsErrorsMap,
} from './helpers/types';
import { NewProject, objKeyAsString } from 'utils/customTypes';
import useModal from 'Hooks/useModal';

const NewProjectPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(0);
  const [requiredFieldsErrors, setRequiredFieldsErrors] =
    useState<objKeyAsString>(requiredFieldsErrorsMap);
  const { Modal, modalProps, openModal, closeModal } = useModal();

  const [newProjectData, setNewProjectData] = useState<NewProject>(
    defaultNewProjectData
  );
  const footerElevation = useElevation(1);

  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  const handleCancel = () => {
    openModal({
      title: intl.get('NEW_PROJECT_PAGE.CANCEL_PROJECT_CREATION_MODAL.TITLE'),
      size: 'medium',
      children: (
        <Typography variant='h6'>
          {intl.get('NEW_PROJECT_PAGE.CANCEL_PROJECT_CREATION_MODAL.BODY', {
            projectName: newProjectData.title,
          })}
        </Typography>
      ),
      actionButtons: [
        {
          children: intl.get(
            'NEW_PROJECT_PAGE.CANCEL_PROJECT_CREATION_MODAL.SUBMIT'
          ),
          color: 'danger',
          onClick: () => {
            dispatch(
              setNotificationText(
                intl.get('NEW_PROJECT_PAGE.CANCEL_PROJECT_CREATION_SUCCESS', {
                  projectName: newProjectData.title,
                })
              )
            );
            dispatch(setNotificationVariant('success'));
            dispatch(setNotificationTimeout(4000));
            dispatch(displayNotification());
            closeModal();
            history.push(PATHS.PROJECTS_LIST_PAGE);
          },
        },
        {
          children: intl.get(
            'NEW_PROJECT_PAGE.CANCEL_PROJECT_CREATION_MODAL.CANCEL'
          ),
          variant: 'secondary',
          onClick: () => closeModal(),
        },
      ],
    });
  };
  const handleTabsNavigation = (value: number) => {
    setCurrentTab(value);
  };

  const handleSaveProject = () => {
    dispatch(createNewProject(newProjectData));
    dispatch(
      setNotificationText(
        intl.get('REQUEST_PAGE.TOP_BAR.CREATE_PROJECT_MODAL.SUCCESS_MESSAGE', {
          projectTitle: newProjectData.title,
        })
      )
    );
    dispatch(setNotificationVariant('success'));
    dispatch(setNotificationTimeout(4000));
    dispatch(displayNotification());
    history.push(PATHS.PROJECTS_LIST_PAGE);
  };

  const handleSave = () => {
    let canSave = true;
    let errorsMap: objKeyAsString = { ...requiredFieldsErrorsMap };
    const dateFields = [
      NEW_PROJECT_FORM_FIELDS.START_DATE,
      NEW_PROJECT_FORM_FIELDS.TARGET_LAUNCH_DATE,
      NEW_PROJECT_FORM_FIELDS.TARGET_COMPLETION_DATE,
    ];
    requiredFields.forEach((field) => {
      if (!dateFields.includes(field) && isEmpty(newProjectData[field])) {
        canSave = false;
        errorsMap[field] = true;
      } else {
        if (
          !(newProjectData[field] instanceof Date) &&
          isEmpty(newProjectData[field])
        ) {
          errorsMap[field] = true;
          canSave = false;
        }
      }
    });
    setRequiredFieldsErrors(errorsMap);
    if (!canSave) {
      dispatch(setNotificationVariant('error'));
      dispatch(setNotificationText(intl.get('NEW_PROJECT_PAGE.SAVE_ERROR')));
      dispatch(setNotificationTimeout(4000));
      dispatch(displayNotification());
      setCurrentTab(0);
    } else {
      handleSaveProject();
    }
  };

  return (
    <div className='flex flex-col h-full min-h-project'>
      <PageTitle titleComponent={intl.get('NEW_PROJECT_PAGE.TITLE')} />
      <Modal {...modalProps} aria-label='New project form' />
      <div
        className='bg-neutral-white flex-grow overflow-y-auto mx-6 mt-2'
        data-cy='project-form-body'
      >
        <Tabs
          className='px-4 py-4'
          index={currentTab}
          onChange={handleTabsNavigation}
          data={[
            {
              label: intl.get('NEW_PROJECT_PAGE.BASIC_DETAILS'),
              content: (
                <BasicDetails
                  data={newProjectData}
                  setData={setNewProjectData}
                  requiredFieldsErrors={requiredFieldsErrors}
                />
              ),
            },
            {
              label: intl.get('NEW_PROJECT_PAGE.RESOURCES_DETAILS'),
              content: (
                <ResourcesDetails
                  data={newProjectData}
                  setData={setNewProjectData}
                />
              ),
            },
            {
              label: intl.get('NEW_PROJECT_PAGE.BUDGET_DETAILS'),
              content: (
                <BudgetDetails
                  data={newProjectData}
                  setData={setNewProjectData}
                />
              ),
            },
          ]}
        />
      </div>
      <div
        className={`w-full bg-neutral-white py-2 flex justify-between z-5 ${footerElevation}`}
      >
        <div className='ml-6'>
          {currentTab > 0 && (
            <Button
              variant='secondary'
              onClick={() => handleTabsNavigation(currentTab - 1)}
            >
              <Icon name='caret-back-outline' className='mr-4' />
              {intl.get('NEW_PROJECT_PAGE.BACK_BUTTON')}
            </Button>
          )}
        </div>
        <div className='flex space-x-4 mr-12'>
          <Button variant='secondary' onClick={handleCancel}>
            {intl.get('NEW_PROJECT_PAGE.CANCEL_BUTTON')}
          </Button>
          {currentTab < 2 ? (
            <Button
              onClick={() => handleTabsNavigation(currentTab + 1)}
              data-testid='next-button'
            >
              {intl.get('NEW_PROJECT_PAGE.NEXT_BUTTON')}
              <Icon name='caret-forward-outline' className='ml-3.5' />
            </Button>
          ) : (
            <Button onClick={handleSave} data-testid='save-button'>
              {intl.get('NEW_PROJECT_PAGE.SAVE_BUTTON')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProjectPage;
