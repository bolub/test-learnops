import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import { Tab, TabList, Typography } from '@getsynapse/design-system';
import { TabPanel, TabPanels, Tabs } from '@reach/tabs';
import GeneralSettingsFooter from './GeneralSettingsFooter';
import {
  selectOrganizationSettings,
  selectOrganizationSliceStatus,
  updateOrganizationSettings,
} from 'state/Organization/organizationSlice';
import { OrganizationSettings } from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const sliceStatus = useSelector(selectOrganizationSliceStatus);
  const organizationSettings = useSelector(selectOrganizationSettings);
  const [currentSettings, setCurrentSettings] = useState<OrganizationSettings>(
    {}
  );

  useEffect(() => {
    setCurrentSettings(organizationSettings);
  }, [organizationSettings]);

  const isUpdating = useMemo<boolean>(
    () => sliceStatus === SLICE_STATUS.UPDATING,
    [sliceStatus]
  );

  const saveDisabled = useMemo<boolean>(
    () =>
      Boolean(
        get(organizationSettings, 'teamRequestsTab', true) ===
          get(currentSettings, 'teamRequestsTab', true) &&
          get(organizationSettings, 'platformCurrency', '') ===
            get(currentSettings, 'platformCurrency', '') &&
          get(organizationSettings, 'intakePortalName', '') ===
            get(currentSettings, 'intakePortalName', '')
      ),
    [currentSettings, organizationSettings]
  );

  const onCancel = useCallback(() => {
    setCurrentSettings(organizationSettings);
  }, [organizationSettings]);

  // TODO: enable linter when the values are used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (
    property: keyof OrganizationSettings,
    value: boolean | string
  ) => {
    setCurrentSettings((prevSettings) => ({
      ...prevSettings,
      [property]: value,
    }));
  };

  const onSave = () => {
    dispatch(updateOrganizationSettings(currentSettings));
  };

  return (
    <>
      <Tabs>
        <div className='shadow-header px-4'>
          <Typography variant='h4'>{intl.get('GENERAL')}</Typography>

          <Typography variant='caption' className='text-neutral'>
            {intl.get('SETTINGS_PAGE.GENERAL_PAGE_CAPTION')}
          </Typography>

          <TabList type='subHeader'>
            <Tab index={0} type='subHeader'>
              {intl.get('DISPLAY')}
            </Tab>

            <Tab index={1} type='subHeader'>
              {intl.get('INTAKE')}
            </Tab>
          </TabList>
        </div>

        <TabPanels>
          <TabPanel key={0}></TabPanel>

          <TabPanel key={1}></TabPanel>
        </TabPanels>
      </Tabs>

      <GeneralSettingsFooter
        isLoading={isUpdating}
        onCancel={onCancel}
        onSave={onSave}
        saveDisabled={saveDisabled}
      />
    </>
  );
};

export default GeneralSettings;
