import React from 'react';
import intl from 'react-intl-universal';
import { Button, Tag } from '@getsynapse/design-system';
import { Project } from 'utils/customTypes';
import { PROJECT_STATUS } from 'utils/constants';

const LinkedRequestProjectsTable: React.FC<{
  projectsList: Project[];
  unLinkProject: (projectId: string) => void;
}> = ({ projectsList, unLinkProject }) => {
  type keys = keyof typeof PROJECT_STATUS;
  type ProjectStatus = typeof PROJECT_STATUS[keys];
  const statusStyle: Record<
    ProjectStatus,
    { className: string; textClassName: string }
  > = {
    new: {
      className: 'bg-success-lighter',
      textClassName: 'text-success-dark',
    },
    in_planning: {
      className: 'bg-warning-lighter',
      textClassName: 'text-secondary-darker',
    },
    in_progress: {
      className: 'bg-teal-lighter',
      textClassName: 'text-teal-dark',
    },
    completed: {
      className: 'bg-purple-lighter',
      textClassName: 'text-purple-dark',
    },
    on_hold: {
      className: 'bg-neutral-lighter',
      textClassName: 'text-neutral-darker',
    },
    canceled: {
      className: 'bg-error-lighter',
      textClassName: 'text-error-dark',
    },
  };

  const getStatusLabel: (status: ProjectStatus) => string = (status) => {
    const key = `${status}`.toUpperCase();
    return intl.get(`PROJECT_DETAIL.STATUS_OPTIONS.${key}`).defaultMessage('');
  };

  return (
    <div className='w-full px-1'>
      <table className='w-full px-1 mb-5'>
        <thead className='bg-primary-lightest text-xs text-primary-dark font-semibold table w-full table-fixed'>
          <tr>
            <th className='px-2 py-3 text-left flex-1 shadow-column w-7/12'>
              {intl.get(
                'REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.PROJECT_TITLE'
              )}
            </th>
            <th className='px-2 py-3text-left shadow-column'>
              {intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.STATUS')}
            </th>
            <th className='px-2 py-3 shadow-column w-24'></th>
          </tr>
        </thead>
        <tbody
          className='shadow-header block w-full max-h-66 overflow-y-auto'
          data-cy='linked-requests-table-body'
        >
          {projectsList.length === 0 && (
            <tr className='table w-full table-fixed'>
              <td colSpan={3} className='shadow-header'>
                <div
                  className='py-4 text-neutral text-sm flex flex-1 items-center justify-center'
                  data-cy='no-linked-projects'
                >
                  {intl.get(
                    'REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.NO_LINKED_PROJECTS'
                  )}
                </div>
              </td>
            </tr>
          )}
          {projectsList.map((project) => {
            const status = project.status as ProjectStatus;
            const tagStyle = statusStyle[status];
            const tagLabel = getStatusLabel(status);
            return (
              <tr key={project.id} className='table w-full table-fixed'>
                <td
                  className='text-neutral-black text-sm py-1 px-2 shadow-column w-7/12'
                  data-cy={`project-${project.id}-title`}
                >
                  {project.title}
                </td>
                <td className='py-1 px-2 shadow-column'>
                  <Tag
                    className={`${tagStyle.className} text-xs`}
                    textClassName={tagStyle.textClassName}
                    label={tagLabel}
                    data-cy={`project-${project.id}-status`}
                  />
                </td>
                <td className='py-1 px-2 shadow-column w-24'>
                  <Button
                    className='text-sm text-primary'
                    variant='tertiary'
                    onClick={() => unLinkProject(project.id)}
                    data-cy={`unlink-project-${project.id}-from-table`}
                  >
                    {intl.get('REQUEST_PAGE.TOP_BAR.LINK_REQUEST_MODAL.UNLINK')}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LinkedRequestProjectsTable;
