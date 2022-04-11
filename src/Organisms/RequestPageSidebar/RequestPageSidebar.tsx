import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import {
  Button,
  Dropdown,
  FormLabel,
  Typography,
} from '@getsynapse/design-system';
import isEmpty from 'lodash/isEmpty';
import { PATHS, REQUEST_TYPE } from 'utils/constants';
import { selectFormsOptions, getForms } from 'state/Forms/formSlice';
import { FormOption } from 'utils/customTypes';
import ChangeFormModal from 'Pages/RequestPage/components/ChangeFormModal';
import {
  newRequest,
  selectActiveRequestForm,
  selectActiveRequestId,
  selectActiveRequestType,
  selectIsActiveRequestAForm,
} from 'state/ActiveRequest/activeRequestSlice';
import { useHistory } from 'react-router-dom';
import { selectOrganizationId } from 'state/User/userSlice';

type RequestTypeOption = { value: string; label: string };

const RequestPageSidebar = ({ requestId }: { requestId: string }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({
    requestTypeId: '',
    formId: '',
    newRequestFlag: 0,
  });
  const formOptions: FormOption[] = useSelector(selectFormsOptions);
  const currentRequestBaseForm = useSelector(selectActiveRequestForm);
  const currentRequestType = useSelector(selectActiveRequestType);
  const currentRequestId = useSelector(selectActiveRequestId);
  const isForm = useSelector(selectIsActiveRequestAForm);
  const organizationId = useSelector(selectOrganizationId);

  useEffect(() => {
    if (organizationId) {
      dispatch(getForms({ organizationId, published: true }));
    }
  }, [organizationId, dispatch]);

  useEffect(() => {
    if (
      currentRequestType &&
      !data.requestTypeId &&
      currentRequestBaseForm &&
      !data.formId
    ) {
      setData({
        ...data,
        formId: currentRequestBaseForm.value,
        requestTypeId: currentRequestType,
      });
    }
  }, [currentRequestType, currentRequestBaseForm, data]);

  useEffect(() => {
    if (!requestId && data.newRequestFlag !== 1) {
      setData({
        ...data,
        newRequestFlag: 1,
      });
    }
  }, [requestId, data]);

  useEffect(() => {
    if (currentRequestId && currentRequestId !== requestId && !isForm) {
      history.replace(`${PATHS.REQUEST_PAGE}/${currentRequestId}`);
    }
  }, [currentRequestId, history, requestId, isForm]);

  const setForm = useCallback(
    (form: FormOption) => {
      if (requestId && !isForm && currentRequestBaseForm && data.formId) {
        data.formId !== form.value && setModalOpen(true);
      } else {
        history.replace(`${PATHS.REQUEST_PAGE}/${form.value}`);
      }
      setData({ ...data, formId: form.value });
    },
    [data, requestId, currentRequestBaseForm, history, isForm]
  );

  const requestTypeOptions = useMemo(() => {
    return REQUEST_TYPE.map((type) => ({
      value: type,
      label: intl.get(`REQUEST_PAGE.LEFT_PANEL.REQUEST_TYPE.${type}`),
    }));
  }, []);

  const filteredFormOptions = useMemo(() => {
    return formOptions.filter(
      (form) => form.requestType === data.requestTypeId
    );
  }, [formOptions, data]);

  const selectedRequestType = useMemo(() => {
    const requestType = requestTypeOptions.find(
      (type) => type.value === data.requestTypeId
    );
    if (requestType !== undefined) {
      return requestType;
    }
    return { value: '', label: '' };
  }, [data.requestTypeId, requestTypeOptions]);

  const selectedForm = useMemo(() => {
    const form = formOptions.find((form) => form.value === data.formId);
    if (form !== undefined) {
      return { value: form.value, label: form.label };
    }
    return { value: '', label: '' };
  }, [formOptions, data.formId]);

  const setRequest = useCallback(
    (requestType: RequestTypeOption) => {
      setData({ ...data, requestTypeId: requestType.value });
    },
    [data]
  );

  const createRequest = () => {
    if (data.formId && data.requestTypeId) {
      dispatch(newRequest(data));
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createRequest();
  };

  const resetForm = () => {
    if (currentRequestBaseForm) {
      setForm(currentRequestBaseForm);
    }
  };

  return (
    <div className='w-80 bg-neutral-white px-3 pt-4'>
      <ChangeFormModal
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        requestId={requestId}
        onCreateRequest={createRequest}
        onClose={resetForm}
      />

      <Typography variant='h5'>
        {intl.get('REQUEST_PAGE.LEFT_PANEL.TITLE')}
      </Typography>

      <Typography
        variant='caption'
        className='text-neutral-dark block w-56 mb-6'
      >
        {intl.get('REQUEST_PAGE.LEFT_PANEL.PROMPT')}
      </Typography>

      <form onSubmit={handleFormSubmit}>
        <FormLabel>
          {intl.get('REQUEST_PAGE.LEFT_PANEL.FORM.TRAINING_TYPE_LABEL')}
        </FormLabel>

        <Dropdown
          options={requestTypeOptions}
          onChange={setRequest}
          values={data.requestTypeId ? [selectedRequestType] : []}
          triggerProps={{ 'data-cy': 'training-type' }}
        />

        <div className='mt-6 mb-3.5'>
          <FormLabel>
            {intl.get('REQUEST_PAGE.LEFT_PANEL.FORM.FORM_TYPE_LABEL')}
          </FormLabel>

          <Dropdown
            disabled={isEmpty(data.requestTypeId) ? true : false}
            options={filteredFormOptions}
            onChange={setForm}
            values={data.formId ? [selectedForm] : []}
            controlled
            triggerProps={{ 'data-cy': 'form-type' }}
          />
        </div>

        {data.newRequestFlag === 1 && (
          <Button
            type='submit'
            disabled={
              !data.formId ||
              !data.requestTypeId ||
              (currentRequestId && !isForm)
            }
            data-cy='apply-button'
          >
            {intl.get('REQUEST_PAGE.LEFT_PANEL.FORM.APPLY_BUTTON')}
          </Button>
        )}
      </form>
    </div>
  );
};

export default RequestPageSidebar;
