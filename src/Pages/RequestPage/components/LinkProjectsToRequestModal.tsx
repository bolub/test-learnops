import React, { useState, useMemo, useEffect } from 'react';
import intl from 'react-intl-universal';
import { Modal, Typography } from '@getsynapse/design-system';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllProjects, fetchProjects } from 'state/Projects/projectsSlice';
import { Project } from 'utils/customTypes';
import {
  selectActiveRequest,
  linkProjectsToRequest,
} from 'state/ActiveRequest/activeRequestSlice';
import {
  setNotificationText,
  setNotificationTimeout,
  displayNotification,
} from 'state/InlineNotification/inlineNotificationSlice';
import ProjectRequestsLinking from 'Organisms/ProjectRequestsLinking/ProjectRequestsLinking';
import LinkedRequestProjectsTable from './LinkedRequestProjectsTable';

const ModalContent: React.FC<{
  linkedProjectsList: Project[];
  onLinkProject: (project: Project) => void;
  onUnlinkProject: (projectId: string) => void;
}> = ({ onLinkProject, linkedProjectsList, onUnlinkProject }) => {
  const dispatch = useDispatch();
  const projectsList = useSelector(selectAllProjects);
  const availableProjectsList = useMemo(() => {
    if (linkedProjectsList.length === 0) {
      return projectsList;
    }
    const linkedProjectsIds = linkedProjectsList.map((project) => project.id);
    return projectsList.filter(
      (project) => !linkedProjectsIds.includes(project.id)
    );
  }, [linkedProjectsList, projectsList]);
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const linkRequestToProjectHandle = (project: Project) => {
    onLinkProject(project);
  };
  const unLinkProjectHandle = (projectId: string) => {
    onUnlinkProject(projectId);
  };
  return (
    <React.Fragment>
      <Typography variant='body' className='mb-6'>
        {intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.SUBTITLE')}
      </Typography>
      <LinkedRequestProjectsTable
        projectsList={linkedProjectsList}
        unLinkProject={unLinkProjectHandle}
      />
      <ProjectRequestsLinking
        onLinkItem={linkRequestToProjectHandle}
        availableItemsList={availableProjectsList}
        triggerTitle={intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.TITLE')}
        placeholder={intl.get(
          'REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.PLACEHOLDER'
        )}
        data-cy='request-search-projects-to-link'
      />
    </React.Fragment>
  );
};

const LinkProjectsToRequestModal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  requestId: string;
}> = ({ isOpen = false, closeModal = () => {}, requestId }) => {
  const dispatch = useDispatch();
  const activeRequest = useSelector(selectActiveRequest);
  const [linkedProjectsList, setLinkedProjectsList] = useState<Project[]>(
    activeRequest?.requestProjects ? activeRequest.requestProjects : []
  );
  const saveHandle = () => {
    dispatch(
      linkProjectsToRequest({ projects: linkedProjectsList, requestId })
    );
    dispatch(
      setNotificationText(
        intl.get(
          'REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.LINKED_PROJECTS_SUCCESS'
        )
      )
    );
    dispatch(setNotificationTimeout(4000));
    dispatch(displayNotification());
    cancelHandle();
  };
  const cancelHandle = () => {
    setLinkedProjectsList(activeRequest?.requestProjects || []);
    closeModal();
  };
  const unLinkProjectHandle = (projectId: string) => {
    const updatedLinkedProjectsList = linkedProjectsList.filter(
      (project) => project.id !== projectId
    );
    setLinkedProjectsList(updatedLinkedProjectsList);
  };
  const linkProjectHandle = (project: Project) => {
    setLinkedProjectsList((prevLinkedProjects) =>
      prevLinkedProjects.concat(project)
    );
  };
  useEffect(() => {
    setLinkedProjectsList(activeRequest?.requestProjects || []);
  }, [activeRequest.requestProjects, setLinkedProjectsList]);
  return (
    <Modal
      isOpen={isOpen}
      title={intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.TITLE')}
      aria-label={intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.TITLE')}
      closeModal={closeModal}
      size='large'
      actionButtons={[
        {
          children: intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.SAVE'),
          variant: 'primary',
          onClick: saveHandle,
          'data-cy': 'link-projects-to-request',
        },
        {
          children: intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.CANCEL'),
          variant: 'secondary',
          onClick: cancelHandle,
          'data-cy': 'cancel-link-projects-to-request',
        },
      ]}
      childrenClassName='max-h-100 max-w-full'
    >
      <ModalContent
        onUnlinkProject={unLinkProjectHandle}
        onLinkProject={linkProjectHandle}
        linkedProjectsList={linkedProjectsList}
      />
    </Modal>
  );
};

export default LinkProjectsToRequestModal;
