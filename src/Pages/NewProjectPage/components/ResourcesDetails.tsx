import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { Typography, Dropdown, FormItem } from '@getsynapse/design-system';
import { NewProject, ProjectVendor } from 'utils/customTypes';
import { selectVendors, getVendors } from 'state/Vendors/vendorsSlice';
import { MultipleOptionLI } from '../helpers/snippets';
import handleFieldChange from '../helpers/handleFieldChange';
import { useSelector, useDispatch } from 'react-redux';
import {
  NEW_PROJECT_FORM_FIELDS,
  PROJECT_RESOURCING_TYPE,
} from 'utils/constants';

type ResourcesDetailsrops = {
  data: NewProject;
  setData: Dispatch<SetStateAction<NewProject>>;
};

type Option = {
  label: string;
  value: any;
};

const getInitialValueForDropDown = (
  options: Option[],
  values: string[] | string
) => {
  if (!values) {
    return [];
  }
  return options.filter(
    (option) => values === option.value || values.includes(option.value)
  );
};

const ResourcesDetails: React.FC<ResourcesDetailsrops> = ({
  data,
  setData,
}) => {
  const dispatch = useDispatch();
  const [resourcingType, setResourcingType] = useState('');
  const projectVendors = useSelector(selectVendors);

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  const vendorOptions = useMemo(
    () =>
      projectVendors.map((vendor: ProjectVendor) => ({
        label: vendor.vendorName,
        value: vendor.id,
      })),
    [projectVendors]
  );

  const handleFormFieldChange = (fieldName: string, fieldValue: any) => {
    handleFieldChange(fieldName, fieldValue, setData);
  };

  const resourcingTypeOptions = useMemo(
    () =>
      Object.keys(PROJECT_RESOURCING_TYPE).map((key) => ({
        label: intl.get(`PROJECT_DETAIL.RESOURCING_TYPE_OPTIONS.${key}`),
        value: PROJECT_RESOURCING_TYPE[key],
      })),
    []
  );
  return (
    <div className='mt-8'>
      <Typography variant='h5'>
        {intl.get('PROJECT_DETAIL.RESOURCE_INFORMATION_TITLE')}
      </Typography>
      <Typography variant='caption'>
        {intl.get('PROJECT_DETAIL.RESOURCE_INFORMATION_SUBTITLE')}
      </Typography>
      <div className='grid gap-y-6 gap-x-10% grid-cols-2 mt-4'>
        <FormItem
          label={intl.get('PROJECT_DETAIL.RESOURCING_TYPE')}
          className='mt-4'
        >
          <Dropdown
            placeholder={intl.get('PROJECT_DETAIL.RESOURCING_TYPE_PLACEHOLDER')}
            onChange={(option: Option) => {
              handleFormFieldChange(
                NEW_PROJECT_FORM_FIELDS.RESOURCING_TYPE,
                option.value
              );
              setResourcingType(option.value);
            }}
            options={resourcingTypeOptions}
            triggerProps={{ 'data-testid': 'project-resource-input' }}
          />
        </FormItem>
        {(resourcingType === PROJECT_RESOURCING_TYPE.VENDOR ||
          resourcingType === PROJECT_RESOURCING_TYPE.MIXED) && (
          <FormItem label={intl.get('PROJECT_DETAIL.VENDOR')} className='mt-4'>
            <Dropdown
              multiple
              placeholder={intl.get('PROJECT_DETAIL.VENDOR_PLACEHOLDER')}
              onChange={(options: Option[]) =>
                handleFormFieldChange(NEW_PROJECT_FORM_FIELDS.VENDORS, options)
              }
              options={vendorOptions}
              values={getInitialValueForDropDown(
                vendorOptions,
                data.vendors.map((vendor: ProjectVendor) => vendor.id)
              )}
              renderOption={(
                option: Option,
                isSelected: boolean,
                selectOption,
                { className, ...otherProps }
              ) => (
                <li
                  {...otherProps}
                  className={classnames('group', className, {
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
            />
          </FormItem>
        )}
      </div>
    </div>
  );
};

export default ResourcesDetails;
