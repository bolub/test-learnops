import { useState, useCallback, useMemo } from 'react';
import { Modal } from '@getsynapse/design-system';
import { ModalProps } from 'utils/customTypes';

const defaultState: ModalProps = {
  actionButtons: [],
  closeModal: () => {},
  isOpen: false,
  size: 'small',
  title: '',
  titleIcon: null,
  children: null,
  childrenClassName: '',
};

const useModal = () => {
  const [modalState, setModalState] = useState<ModalProps>(defaultState);

  const openModal = useCallback(
    (state: ModalProps) => {
      setModalState((prevState) => ({
        ...prevState,
        ...state,
        isOpen: true,
      }));
    },
    [setModalState]
  );

  const closeModal = useCallback(() => {
    setModalState((prevState) => ({
      ...prevState,
      ...defaultState,
    }));
  }, [setModalState]);

  const updateModal = useCallback(
    (state: ModalProps) => {
      setModalState((prevState) => ({
        ...prevState,
        ...state,
      }));
    },
    [setModalState]
  );

  const modalProps = useMemo(
    () => ({
      ...modalState,
      closeModal,
    }),
    [closeModal, modalState]
  );

  return {
    Modal,
    modalProps,
    openModal,
    closeModal,
    updateModal,
  };
};

export default useModal;
