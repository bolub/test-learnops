import { useEffect, useState, useCallback, Fragment, ChangeEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Button,
  Toggle,
  tailwindOverride,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import {
  getVendor,
  selectVendor,
  selectStatus,
  changeVendor,
} from 'state/Vendors/vendorsSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import { SLICE_STATUS, PATHS } from 'utils/constants';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import Loader from 'Molecules/Loader/Loader';
import VendorForm from 'Organisms/NewVendorModal/VendorForm';
import { ProjectVendor } from 'utils/customTypes';
const EDIT_VENDOR_FORM = 'edit_vendor_form';

const VendorPage = () => {
  const history = useHistory();
  const { vendorId } = useParams<{ vendorId: string }>();
  const dispatch = useDispatch();
  const vendor = useSelector(selectVendor);
  const vendorStatus = useSelector(selectStatus);
  const [hasChanged, setHasChanged] = useState(false);
  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    dispatch(getVendor(vendorId));
  }, [dispatch, vendorId]);

  const onSubmit = useCallback<(newData: Partial<ProjectVendor>) => void>(
    async (newData) => {
      if (hasName) {
        await dispatch(
          changeVendor({
            vendorId,
            newData,
          })
        );

        if (vendorStatus === SLICE_STATUS.IDLE) {
          dispatch(setNotificationText(intl.get('VENDORS_PAGE.EDIT_SUCCESS')));
          dispatch(setNotificationVariant('success'));
          dispatch(setNotificationTimeout(4000));
          dispatch(displayNotification());
          history.push(PATHS.SETTINGS);
        }
      } else {
        dispatch(setNotificationText(intl.get('VENDORS_PAGE.NOT_UPDATED')));
        dispatch(setNotificationVariant('error'));
        dispatch(setNotificationTimeout(4000));
        dispatch(displayNotification());
      }
    },
    [dispatch, vendorId, vendorStatus, history, hasName]
  );

  const handleEnable = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const enabled = e.target.checked;
      await dispatch(
        changeVendor({
          vendorId,
          newData: { enabled },
        })
      );
      if (vendorStatus === SLICE_STATUS.IDLE) {
        dispatch(
          setNotificationText(
            enabled
              ? intl.get('VENDORS_PAGE.ENABLED_NOTIFICATION')
              : intl.get('VENDORS_PAGE.DISABLED_NOTIFICATION')
          )
        );
        dispatch(setNotificationVariant('success'));
        dispatch(setNotificationTimeout(4000));
        dispatch(displayNotification());
      }
    },
    [dispatch, vendorId, vendorStatus]
  );

  const onFormChanged = useCallback((value) => {
    setHasChanged(value);
  }, []);

  const onNameChange = useCallback((value) => {
    setHasName(value);
  }, []);

  return (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={`${intl.get('PROJECT_DETAIL.VENDOR')}/${get(
          vendor,
          'vendorName',
          ''
        )}`}
        className='sticky top-0 left-0 right-0'
        dataCy='vendor-name_title'
      />
      {vendorStatus !== SLICE_STATUS.LOADING && get(vendor, 'id') ? (
        <Fragment>
          <div
            className={tailwindOverride(
              'mx-6 mt-2 p-2',
              'bg-neutral-white relative',
              'z-5 shadow-lifted h-12',
              'flex items-center justify-end'
            )}
          >
            <Toggle
              label={intl.get('VENDORS_PAGE.ENABLE_VENDOR')}
              labelProps={{ className: 'mb-0 mr-2' }}
              className='flex items-center mr-4'
              isSmall
              checked={get(vendor, 'enabled', false)}
              onChange={handleEnable}
              inputProps={{
                'data-cy': 'vendor_enable-disable',
              }}
            />
          </div>
          <div className='px-4 h-full bg-neutral-white overflow-y-auto mx-6'>
            <Typography variant='h5' className='mt-8 mb-4 text-neutral-black'>
              {intl.get('REQUEST_PAGE.BASIC_DETAILS.TITLE')}
            </Typography>
            <VendorForm
              className='gap-x-20'
              vendor={vendor}
              formId={EDIT_VENDOR_FORM}
              onSubmit={onSubmit}
              onDataChange={onFormChanged}
              onNameChange={onNameChange}
            />
          </div>
          <div
            className={tailwindOverride(
              'shadow-lifted h-12 pr-12 py-2',
              'flex items-center justify-end bg-neutral-white',
              'fixed bottom-0 left-0 right-0'
            )}
          >
            <Button
              variant='tertiary'
              className='mr-4'
              onClick={() => history.push(PATHS.SETTINGS)}
              data-cy='cancel-button'
            >
              {intl.get('SETTINGS_PAGE.USER_PAGE.FOOTER.CANCEL_BUTTON')}
            </Button>
            <Button
              type='submit'
              disabled={!hasChanged}
              form={EDIT_VENDOR_FORM}
              data-cy='confirm-button'
            >
              {intl.get('SETTINGS_PAGE.USER_PAGE.FOOTER.UPDATE_BUTTON')}
            </Button>
          </div>
        </Fragment>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default VendorPage;
