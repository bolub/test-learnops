import { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { PROJECT_MORE_ACTIONS } from 'utils/constants';
import { MoreActionsOption } from 'utils/customTypes';
import MoreActions from 'Organisms/MoreActions/MoreActions';
import CloseProjectIcon from 'assets/icons/close-project.svg';
import CancelProject from 'Pages/ProjectPage/components/CancelProject/CancelProject';
import DeleteProject from 'Pages/ProjectPage/components/DeleteProject/DeleteProject';

const OverviewActions = ({
  canCancelProject,
  cancelProjectCallback,
  canCloseProject,
  deleteProjectCallback,
  toggleCloseModal,
}: {
  canCancelProject: boolean;
  cancelProjectCallback: (reason: string) => Promise<void>;
  canCloseProject: boolean;
  deleteProjectCallback: () => Promise<void>;
  toggleCloseModal: () => void;
}) => {
  const [displayCancelModal, setDisplayCancelModal] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

  const handleSelectOption = (option: MoreActionsOption) => {
    if (option.value === PROJECT_MORE_ACTIONS.CANCEL) {
      setDisplayCancelModal(true);
    }

    if (option.value === PROJECT_MORE_ACTIONS.DELETE) {
      setDisplayDeleteModal(true);
    }

    if (option.value === PROJECT_MORE_ACTIONS.CLOSE) {
      toggleCloseModal();
    }
  };

  const moreActionsOptions: MoreActionsOption[] = useMemo(() => {
    const options = [];
    if (canCancelProject) {
      options.push({
        value: PROJECT_MORE_ACTIONS.CANCEL,
        label: intl.get('PROJECT_DETAIL.CANCEL_PROJECT.TITLE'),
        iconName: 'remove-circle',
        dataCy: 'cancel-project-button',
        iconClassName: 'text-error-dark group-hover:text-error-dark',
      });
    }

    options.push({
      value: PROJECT_MORE_ACTIONS.DELETE,
      label: intl.get('PROJECT_DETAIL.DELETE_PROJECT.TITLE'),
      iconName: 'trash',
      dataCy: 'delete-project-button',
    });

    if (canCloseProject) {
      options.push({
        value: PROJECT_MORE_ACTIONS.CLOSE,
        label: intl.get('PROJECT_DETAIL.CLOSE_PROJECT.TITLE'),
        iconName: '',
        iconSrc: CloseProjectIcon,
        dataCy: 'close-project-button',
      });
    }
    return options;
  }, [canCancelProject, canCloseProject]);

  return (
    <>
      <CancelProject
        confirmCancelProject={cancelProjectCallback}
        shouldDisplayModal={displayCancelModal}
        closeModalCallback={() => setDisplayCancelModal(false)}
      />
      <DeleteProject
        confirmDeleteProject={deleteProjectCallback}
        shouldDisplayModal={displayDeleteModal}
        onCloseModal={() => setDisplayDeleteModal(false)}
      />
      <MoreActions
        options={moreActionsOptions}
        onSelectOption={handleSelectOption}
      />
    </>
  );
};

export default OverviewActions;
