import {
  Button,
  Dropdown,
  FormItem,
  Typography,
  useElevation,
} from '@getsynapse/design-system';
import classNames from 'classnames';
import useInlineNotification from 'Hooks/useInlineNotification';
import { isEqual, isEqualWith } from 'lodash';
import { MultipleOptionLI } from 'Pages/NewProjectPage/helpers/snippets';
import { ResourcePlanFields } from 'Pages/ProjectPage/helpers/types';
import { useEffect, useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  getCurrentProjectData,
  updateProject,
} from 'state/Project/projectSlice';
import { getVendors, selectVendors } from 'state/Vendors/vendorsSlice';
import {
  NEW_PROJECT_FORM_FIELDS,
  PATHS,
  PROJECT_RESOURCING_TYPE,
} from 'utils/constants';
import {
  FormOption,
  Option,
  ProjectVendor,
  ResourcePlanType,
} from 'utils/customTypes';
import { getInitialValueForDropDown } from 'utils/functions';

const ResourcePlan = () => {
  const footerElevation = useElevation(1);
  const [disableSave, setDisableSave] = useState(true);

  const dispatch = useDispatch();
  const { showInlineNotification } = useInlineNotification();

  const [data, setData] = useState<ResourcePlanType>(ResourcePlanFields);
  const [dataToCompare, setDataToCompare] = useState<ResourcePlanType>();
  const [updatedVendors, setUpdatedVendors] = useState<FormOption[]>([]);
  const [vendorDisable, setVendorDisable] = useState<boolean>(true);

  const projectVendors = useSelector(selectVendors);

  const projectData = useSelector(getCurrentProjectData);
  const { projectId } = useParams<{ projectId: string }>();

  const history = useHistory();

  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    setData((prevData) => ({ ...prevData, [fieldName]: fieldValue }));
  };

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  useEffect(() => {
    setData({
      vendors: projectData?.vendors,
      resourcing_type: projectData?.resourcing_type,
    });

    setDataToCompare({
      vendors: projectData?.vendors,
      resourcing_type: projectData?.resourcing_type,
    });
  }, [projectData]);

  useEffect(() => {
    if (!isEqual(data, ResourcePlanFields) || vendorDisable) {
      const changesDetected = !isEqual(dataToCompare, data);
      if (changesDetected && disableSave) {
        setDisableSave(false);
      }
      if (!changesDetected && !disableSave) {
        setDisableSave(true);
      }
      if (!vendorDisable) {
        setDisableSave(false);
      }
    }
  }, [data, disableSave, dataToCompare, updatedVendors, vendorDisable]);

  const vendorOptions = useMemo(
    () =>
      projectVendors.map((vendor: ProjectVendor) => ({
        label: vendor.vendorName,
        value: vendor.id,
      })),
    [projectVendors]
  );

  const resourcingTypeOptions = useMemo(
    () =>
      Object.keys(PROJECT_RESOURCING_TYPE).map((key) => ({
        label: intl.get(`PROJECT_DETAIL.RESOURCING_TYPE_OPTIONS.${key}`),
        value: PROJECT_RESOURCING_TYPE[key],
      })),
    []
  );

  const handleCancel = () => {
    history.push(`${PATHS.PROJECT_PAGE}/${projectId}?tab=overview`);
  };

  const updateResourcePlanHandler = async () => {
    await dispatch(
      updateProject({
        projectId: projectId,
        data: {
          [NEW_PROJECT_FORM_FIELDS.RESOURCING_TYPE]: data.resourcing_type,
          [NEW_PROJECT_FORM_FIELDS.VENDORS]: updatedVendors.map(
            (vendor: FormOption) => vendor?.value
          ),
        },
      })
    );

    showInlineNotification(
      'success',
      intl.get('PEOPLE.RESOURCE_PLAN.UPDATE_SUCCESS')
    );
    setVendorDisable(true);
  };

  return (
    <div className='py-4'>
      <div className='bg-neutral-white h-project overflow-y-auto px-6 py-6'>
        <Typography variant='h5'>
          {intl.get('PEOPLE.TABS.RESOURCE_PLAN')}
        </Typography>

        <div className='grid gap-y-6 gap-x-10% grid-cols-2 mt-8'>
          <FormItem
            label={intl.get('PROJECT_DETAIL.RESOURCING_TYPE')}
            className='mt-4'
          >
            <Dropdown
              placeholder={intl.get(
                'PROJECT_DETAIL.RESOURCING_TYPE_PLACEHOLDER'
              )}
              onChange={(option: Option) => {
                handleFieldChange(
                  NEW_PROJECT_FORM_FIELDS.RESOURCING_TYPE,
                  option.value
                );
              }}
              options={resourcingTypeOptions}
              values={getInitialValueForDropDown(
                resourcingTypeOptions,
                projectData?.resourcing_type
              )}
              triggerProps={{ 'data-cy': 'project-resource-input' }}
            />
          </FormItem>

          {(data.resourcing_type === PROJECT_RESOURCING_TYPE.VENDOR ||
            data.resourcing_type === PROJECT_RESOURCING_TYPE.MIXED) && (
            <FormItem
              label={intl.get('PROJECT_DETAIL.VENDOR')}
              className='mt-4'
            >
              <Dropdown
                multiple
                placeholder={intl.get('PROJECT_DETAIL.VENDOR_PLACEHOLDER')}
                onChange={(options: Option[]) => {
                  setUpdatedVendors(options);

                  const optionsIds = options?.map(
                    (vendor: FormOption) => vendor.value
                  );

                  const initialVendorsIds = projectData?.vendors?.map(
                    (vendor: ProjectVendor) => vendor.id
                  );

                  const compare = isEqualWith(
                    optionsIds.sort(),
                    initialVendorsIds.sort()
                  );

                  setVendorDisable(compare);
                }}
                options={vendorOptions}
                values={getInitialValueForDropDown(
                  vendorOptions,
                  projectData?.vendors?.map(
                    (vendor: ProjectVendor) => vendor.id
                  )
                )}
                renderOption={(
                  option: Option,
                  isSelected: boolean,
                  selectOption,
                  { className, ...otherProps }
                ) => (
                  <li
                    {...otherProps}
                    className={classNames('group', className, {
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
                triggerProps={{ 'data-cy': 'project-vendor-dropdown' }}
              />
            </FormItem>
          )}
        </div>
      </div>

      <div
        className={classNames(
          'w-full bg-neutral-white flex py-2 z-5 absolute bottom-0 left-0 ',
          footerElevation
        )}
      >
        <div className='flex ml-auto mr-12 gap-x-4 '>
          <Button
            variant='secondary'
            onClick={handleCancel}
            data-cy='resource-plan-cancel-button'
          >
            {intl.get('CANCEL')}
          </Button>

          <Button
            data-cy='resource-plan-update-button'
            disabled={disableSave}
            aria-disabled={disableSave}
            onClick={updateResourcePlanHandler}
          >
            {intl.get('PEOPLE.RESOURCE_PLAN.UPDATE_RESOURCES_BUTTON')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlan;
