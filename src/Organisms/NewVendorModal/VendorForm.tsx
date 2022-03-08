import {
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
  FormEvent,
  useCallback,
} from 'react';
import {
  FormItem,
  TextField,
  TextArea,
  Dropdown,
  tailwindOverride,
} from '@getsynapse/design-system';
import { useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import { State } from 'country-state-city';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { COUNTRIES } from 'utils/constants';
import { FormOption, ProjectVendor, Option } from 'utils/customTypes';
import { selectOrganizationId } from 'state/User/userSlice';

type Vendor = Partial<ProjectVendor>;

type VendorFormProps = {
  vendor?: ProjectVendor;
  onSubmit: (vendor: Vendor) => void;
  formId: string;
  onNameChange?: (isUnlocked: boolean) => void;
  onDataChange?: (dataChanged: boolean) => void;
  className?: string;
};

const VendorForm = ({
  vendor,
  onSubmit,
  formId,
  onNameChange = () => {},
  onDataChange = () => {},
  className,
}: VendorFormProps) => {
  const organizationId = useSelector(selectOrganizationId);
  const defaultVendor = useMemo(
    () => ({
      vendorName: '',
      description: '',
      organization_id: organizationId || '',
      country_iso_3166_1_alpha_2_code: '',
      data: {
        province: '',
        address: '',
        website: '',
        contactName: '',
        email: '',
        phone: '',
      },
      enabled: false,
      updatedAt: '',
    }),
    [organizationId]
  );
  const [newVendor, setNewVendor] = useState<Vendor>({
    ...defaultVendor,
    ...vendor,
  });
  const [hasError, setHasError] = useState<boolean>(false);

  const countryOptions = useMemo<FormOption[]>(() => {
    return COUNTRIES.map((country) => ({
      value: country,
      label: intl.get(`COUNTRIES.${country}`),
    }));
  }, []);

  const selectedCountryOption = useMemo<FormOption[] | []>(() => {
    if (get(newVendor, 'country_iso_3166_1_alpha_2_code', false)) {
      const value = countryOptions.find(
        (country) => country.value === newVendor.country_iso_3166_1_alpha_2_code
      );
      return !isEmpty(value) ? [value!] : [];
    } else {
      return [];
    }
  }, [countryOptions, newVendor]);

  const provinceOptions = useMemo<FormOption[]>(() => {
    const provinces = State.getStatesOfCountry(
      get(newVendor, 'country_iso_3166_1_alpha_2_code', '')
    );
    return provinces.map((province) => ({
      value: province.name,
      label: province.name,
    }));
  }, [newVendor]);

  const selectedProvinceOption = useMemo<FormOption[] | []>(() => {
    if (get(newVendor, 'data.province', false)) {
      const value = provinceOptions.find(
        (province) => province.value === newVendor!.data!.province
      );
      return !isEmpty(value) ? [value!] : [];
    } else {
      return [];
    }
  }, [provinceOptions, newVendor]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const vendorName = get(newVendor, 'vendorName', '').trim();
    onSubmit({ ...newVendor, vendorName });
    if (vendorName) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  useEffect(() => {
    if (!isEmpty(vendor)) {
      const initializedVendor = {
        ...vendor,
        enabled: defaultVendor.enabled,
        updatedAt: defaultVendor.updatedAt,
        data: { ...defaultVendor.data, ...vendor!.data },
      };
      const initializedNewVendor = {
        ...newVendor,
        enabled: defaultVendor.enabled,
        updatedAt: defaultVendor.updatedAt,
        data: { ...defaultVendor.data, ...newVendor.data },
      };
      onDataChange(!isEqual(initializedVendor, initializedNewVendor));
    }
  }, [vendor, newVendor, onDataChange, defaultVendor]);

  useEffect(() => {
    onNameChange(get(vendor, 'vendorName.length', 0) > 0);
  }, [onNameChange, vendor]);

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const vendorName = get(e, 'target.value', '').trim();
      setNewVendor((prev) => ({ ...prev, vendorName }));
      onNameChange(get(vendorName, 'length', 0) > 0);
      if (hasError) {
        setHasError(false);
      }
    },
    [onNameChange, hasError]
  );

  return (
    <form
      id={formId}
      className={tailwindOverride(
        'grid grid-cols-2',
        'gap-y-4 gap-x-10',
        className
      )}
      onSubmit={handleSubmit}
    >
      <FormItem
        component='div'
        labelProps={{ required: true, state: hasError ? 'error' : 'default' }}
        label={intl.get('VENDORS_PAGE.TABLE.HEAD.VENDOR_NAME')}
        helpText={
          hasError &&
          intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
        }
        helpTextProps={{
          state: hasError ? 'error' : 'default',
        }}
      >
        <TextField
          placeholder={intl.get('VENDORS_PAGE.VENDOR_NAME')}
          onChange={handleNameChange}
          data-cy='vendor-name-input'
          defaultValue={get(newVendor, 'vendorName', '')}
          state={hasError ? 'error' : 'default'}
        />
      </FormItem>

      <FormItem
        component='div'
        className='row-span-2'
        label={intl.get('VENDORS_PAGE.TABLE.HEAD.DESCRIPTION')}
      >
        <TextArea
          textAreaProps={{
            className: 'h-31',
            placeholder: intl.get('VENDORS_PAGE.VENDOR_DESCRIPTION'),
            'data-cy': 'vendor-description-input',
            defaultValue: get(newVendor, 'description', ''),
          }}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setNewVendor((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </FormItem>

      <FormItem component='div' label={intl.get('VENDORS_PAGE.ADDRESS')}>
        <TextField
          placeholder={intl.get('VENDORS_PAGE.VENDOR_ADDRESS')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewVendor((prev) => ({
              ...prev,
              data: { ...prev.data, address: e.target.value },
            }))
          }
          data-cy='vendor-address-input'
          defaultValue={get(newVendor, 'data.address', '')}
        />
      </FormItem>

      <FormItem
        component='div'
        label={intl.get('VENDORS_PAGE.TABLE.HEAD.COUNTRY')}
      >
        <Dropdown
          options={countryOptions}
          values={selectedCountryOption}
          filterable
          onChange={(option: Option) =>
            setNewVendor((prev) => ({
              ...prev,
              country_iso_3166_1_alpha_2_code: option.value,
            }))
          }
          triggerProps={{
            className: 'h-10',
            placeholder: intl.get('VENDORS_PAGE.VENDOR_COUNTRY'),
            'data-cy': 'vendor-country-input',
          }}
        />
      </FormItem>

      <FormItem component='div' label={intl.get('VENDORS_PAGE.PROVINCE')}>
        {provinceOptions.length > 0 ? (
          <Dropdown
            controlled
            filterable
            triggerProps={{
              className: 'h-10',
              placeholder: intl.get('VENDORS_PAGE.VENDOR_PROVINCE'),
              'data-cy': 'vendor-province-input',
            }}
            options={provinceOptions}
            values={selectedProvinceOption}
            onChange={(option: Option) =>
              setNewVendor((prev) => ({
                ...prev,
                data: { ...prev.data, province: option.value },
              }))
            }
          />
        ) : (
          <TextField
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewVendor((prev) => ({
                ...prev,
                data: { ...prev.data, province: e.target.value },
              }));
            }}
            placeholder={intl.get(
              'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.PROVINCE_TEXT_PLACEHOLDER'
            )}
            defaultValue={get(newVendor, 'data.province', '')}
          />
        )}
      </FormItem>

      <FormItem component='div' label={intl.get('VENDORS_PAGE.WEBSITE')}>
        <TextField
          placeholder={intl.get('VENDORS_PAGE.VENDOR_WEBSITE')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewVendor((prev) => ({
              ...prev,
              data: { ...prev.data, website: e.target.value },
            }))
          }
          data-cy='vendor-website-input'
          defaultValue={get(newVendor, 'data.website', '')}
        />
      </FormItem>

      <FormItem component='div' label={intl.get('VENDORS_PAGE.CONTACT_NAME')}>
        <TextField
          placeholder={intl.get('VENDORS_PAGE.VENDOR_CONTACT_NAME')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewVendor((prev) => ({
              ...prev,
              data: { ...prev.data, contactName: e.target.value },
            }))
          }
          data-cy='vendor-contact-input'
          defaultValue={get(newVendor, 'data.contactName', '')}
        />
      </FormItem>

      <FormItem component='div' label={intl.get('VENDORS_PAGE.EMAIL')}>
        <TextField
          placeholder={intl.get('VENDORS_PAGE.VENDOR_EMAIL')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewVendor((prev) => ({
              ...prev,
              data: { ...prev.data, email: e.target.value },
            }))
          }
          data-cy='vendor-email-input'
          defaultValue={get(newVendor, 'data.email', '')}
        />
      </FormItem>

      <FormItem component='div' label={intl.get('VENDORS_PAGE.PHONE')}>
        <TextField
          placeholder={intl.get('VENDORS_PAGE.VENDOR_PHONE')}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewVendor((prev) => ({
              ...prev,
              data: { ...prev.data, phone: e.target.value },
            }))
          }
          data-cy='vendor-phone-input'
          defaultValue={get(newVendor, 'data.phone', '')}
        />
      </FormItem>
    </form>
  );
};

export default VendorForm;
