import {
  useEffect,
  useMemo,
  useCallback,
  useState,
  Fragment,
  ChangeEvent,
} from 'react';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SLICE_STATUS, REQUEST_TYPE, PATHS } from 'utils/constants';
import {
  getForm,
  selectForm,
  selectFormStatus,
  updateForm,
  selectFormQuestions,
  getFormQuestions,
  resetForm,
  deleteForm,
} from 'state/Forms/formSlice';
import {
  getLDUsers,
  selectLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import Loader from 'Molecules/Loader/Loader';
import FormDetailsTabs from './FormDetailsTabs';
import FormFooterButtons from './FormFooterButtons';
import FormTopBar from './FormTopBar';
import { RequestQuestion } from 'utils/customTypes';
import DeleteFormModal from '../Forms/DeleteFormModal';
import EditFormModal from './EditFormModal';

const FormPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();
  const form = useSelector(selectForm);
  const questions = useSelector(selectFormQuestions);
  const formStatus = useSelector(selectFormStatus);
  const ldUsersSelector = useSelector(selectLDUsers);
  const [currentTab, setCurrentTab] = useState(0);
  const [editedForm, setEditedForm] = useState(form);
  const [formQuestions, setFormQuestions] = useState<RequestQuestion[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    requestType: false,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (formId) {
      dispatch(getForm(formId));
      dispatch(getFormQuestions(formId));
    }
    return () => {
      dispatch(resetForm());
    };
  }, [formId, dispatch]);

  useEffect(() => {
    if (form) {
      setEditedForm(form);
    }
  }, [form]);

  useEffect(() => {
    if (questions) {
      setFormQuestions(questions);
    }
  }, [questions]);

  useEffect(() => {
    dispatch(getLDUsers());
  }, [dispatch]);

  const requestTypeOptions = useMemo(() => {
    return REQUEST_TYPE.map((type) => ({
      value: type,
      label: intl.get(`REQUEST_PAGE.LEFT_PANEL.REQUEST_TYPE.${type}`),
    }));
  }, []);

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

  const canSubmit = useMemo(
    () => !isEqual(form, editedForm) || !isEqual(questions, formQuestions),
    [editedForm, form, questions, formQuestions]
  );

  const handleTabChange = useCallback((tab: number) => {
    setCurrentTab(tab);
  }, []);

  const handleCancel = useCallback(() => {
    history.push(PATHS.SETTINGS);
  }, [history]);

  const handleChangeField = useCallback(
    (value: string | string[] | boolean, path: string) => {
      setEditedForm({ ...editedForm, [path]: value });
    },
    [editedForm]
  );

  const handleShowModal = useCallback(() => setIsEditModalOpen(true), []);

  const handleCloseModal = useCallback(() => setIsEditModalOpen(false), []);

  const handleSave = useCallback(async () => {
    setErrors({
      title: !get(editedForm, 'title'),
      description: !get(editedForm, 'form_description'),
      requestType: !get(editedForm, 'request_type'),
    });

    if (
      get(editedForm, 'title') &&
      get(editedForm, 'form_description') &&
      get(editedForm, 'request_type')
    ) {
      let updatedQuestions;
      if (!isEqual(formQuestions, questions)) {
        updatedQuestions = formQuestions;
      }
      await dispatch(
        updateForm({ ...editedForm, questions: updatedQuestions })
      );
      if (formStatus === SLICE_STATUS.IDLE) {
        dispatch(
          setNotificationText(intl.get('SETTINGS_PAGE.FORMS.UPDATED_SUCCESS'))
        );
        dispatch(setNotificationVariant('success'));
        dispatch(setNotificationTimeout(4000));
        dispatch(displayNotification());
      }
      history.push(PATHS.SETTINGS);
    } else {
      handleCloseModal();
      setCurrentTab(0);
      dispatch(
        setNotificationText(intl.get('SETTINGS_PAGE.FORMS.NOT_UPDATED'))
      );
      dispatch(setNotificationVariant('error'));
      dispatch(setNotificationTimeout(4000));
      dispatch(displayNotification());
    }
  }, [
    editedForm,
    formQuestions,
    questions,
    dispatch,
    formStatus,
    history,
    handleCloseModal,
  ]);

  const handlePublishUnpublish = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const isPublished = e.target.checked;
      await dispatch(
        updateForm({
          ...form,
          data: { ...get(form, 'data'), published: isPublished },
        })
      );
      setEditedForm({
        ...editedForm,
        data: { ...get(editedForm, 'data'), published: isPublished },
      });
      if (formStatus === SLICE_STATUS.IDLE) {
        dispatch(
          setNotificationText(
            isPublished
              ? intl.get('SETTINGS_PAGE.FORMS.PUBLISH_SUCCESS')
              : intl.get('SETTINGS_PAGE.FORMS.UNPUBLISH_SUCCESS')
          )
        );
        dispatch(setNotificationVariant('success'));
        dispatch(setNotificationTimeout(4000));
        dispatch(displayNotification());
      }
    },
    [dispatch, editedForm, form, formStatus]
  );

  const onDelete = useCallback(async () => {
    if (formId) {
      await dispatch(deleteForm(formId));
      dispatch(
        setNotificationText(intl.get('SETTINGS_PAGE.FORMS.DELETE.SUCCESS'))
      );
      dispatch(setNotificationVariant('success'));
      dispatch(setNotificationTimeout(4000));
      dispatch(displayNotification());
      history.push(PATHS.SETTINGS);
    }
  }, [dispatch, formId, history]);

  return (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={`${intl.get('ENTITIES.REQUEST_FORM', {
          num: 2,
        })} / ${get(form, 'title', '')}`}
        className='sticky top-0 left-0 right-0 bg-neutral-lightest z-10'
      />
      <EditFormModal
        isOpen={isEditModalOpen}
        handleSave={handleSave}
        onClose={handleCloseModal}
        status={get(editedForm, 'data.published') ? 'published' : 'unpublished'}
      />
      <DeleteFormModal
        onClose={() => setDeleteModal(false)}
        isOpen={deleteModal}
        formId={formId}
        isPublished={get(editedForm, 'data.published')}
        onDelete={onDelete}
      />
      {formStatus !== SLICE_STATUS.LOADING && get(form, 'id', '') ? (
        <Fragment>
          <FormTopBar
            formObj={editedForm}
            handlePublishUnpublish={handlePublishUnpublish}
            onDelete={() => setDeleteModal(true)}
          />
          <main className='mx-6 flex-grow flex space-x-4 bg-neutral-white overflow-y-auto mb-12'>
            <div className='flex-grow h-full p-4'>
              <FormDetailsTabs
                formObj={editedForm}
                handleChangeField={handleChangeField}
                ldUsers={ldUsers}
                requestTypeOptions={requestTypeOptions}
                onTabChange={handleTabChange}
                currentTab={currentTab}
                errors={errors}
                formQuestions={formQuestions}
                setFormQuestions={setFormQuestions}
              />
            </div>
          </main>
        </Fragment>
      ) : (
        <Loader />
      )}
      <FormFooterButtons
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onSave={handleShowModal}
        onCancel={handleCancel}
        canSubmit={canSubmit}
        saveButtonLabel={intl.get(
          'REQUEST_PAGE.REQUEST_DETAILS.BUTTON.UPDATE_EXIT'
        )}
      />
    </div>
  );
};

export default FormPage;
