import intl from 'react-intl-universal';
import React, { useMemo, useState } from 'react';
import {
  FormItem,
  Toggle,
  Typography,
  TextField,
  Dropdown,
  Button,
  FileUpload,
} from '@getsynapse/design-system';
import { COUNTRIES, USER_TYPES, USER_ROLES } from 'utils/constants';
import {
  Option,
  AllUsersType,
  objKeyAsString,
  AvatarUser,
} from 'utils/customTypes';
import get from 'lodash/get';
import config from 'config/Config';
import { State } from 'country-state-city';
import { PickerFileMetadata } from 'filestack-js';
import UserAvatar from 'Atoms/UserAvatar';
import { useSelector } from 'react-redux';
import { selectUserId } from 'state/User/userSlice';

const BasicInformation = ({
  user,
  userType,
  handleChangeField,
  country,
  setCountry,
  errors,
}: {
  user?: Partial<AllUsersType>;
  userType: string;
  handleChangeField: (eventTargetValue: string, pathToUpdate: string) => void;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  errors: objKeyAsString;
}) => {
  const [displayEditPicture, setEditPictureButton] = useState(true);
  const currentUserId = useSelector(selectUserId);
  const countryOptions = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        value: country,
        label: intl.get(`COUNTRIES.${country}`),
      })),
    []
  );
  const firstName = get(user, 'data.firstName');
  const lastName = get(user, 'data.lastName');
  const email = get(user, 'data.email');
  const userRole = get(user, 'role');
  const [currentUserData, setCurrentUserData] = useState<AvatarUser>({
    avatar_url: get(user, 'avatar_url'),
    data: {
      firstName,
      lastName,
    },
  });
  const [province, setProvince] = useState(get(user, 'data.province'));
  const provinceOptions = useMemo(() => {
    const provinces = State.getStatesOfCountry(country);
    return provinces.map((province) => ({
      value: province.name,
      label: province.name,
    }));
  }, [country]);

  return (
    <div className='grid grid-cols-2 gap-x-20 gap-y-4'>
      <div className='ml-4 col-span-2'>
        <Typography variant='h5' className='mt-8 text-neutral-black'>
          {intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.TITLE')}
        </Typography>
        <Typography variant='caption' className='block text-neutral-light'>
          {intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.CAPTION')}
        </Typography>
      </div>
      <div className='flex ml-4'>
        <UserAvatar
          user={currentUserData}
          size='large'
          className='w-24 h-24 bg-center'
        />
        <div className='flex-grow'>
          <Typography
            variant='body2'
            className='font-semibold text-tiny mt-4 ml-3 text-neutral-black'
          >
            {intl.get(
              'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.PROFILE_PICTURE'
            )}
          </Typography>
          {displayEditPicture ? (
            <Button
              variant='secondary'
              size='default'
              onClick={() => {
                setEditPictureButton(false);
              }}
              className='mt-2 ml-3'
              data-cy='edit-picture_button'
            >
              {intl.get(
                'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.EDIT_PICTURE'
              )}
            </Button>
          ) : (
            <>
              <div className='flex py-2 pl-3'>
                <FileUpload
                  className='m-0 flex-grow'
                  config={config.get('fileStack')}
                  displayUploadedFiles={false}
                  onFileUploadHandle={(files: Array<PickerFileMetadata>) => {
                    setCurrentUserData((userData) => {
                      handleChangeField(files[0].url, 'avatar_url');
                      setEditPictureButton(true);
                      return {
                        ...userData,
                        avatar_url: files[0].url,
                      };
                    });
                  }}
                  onFileDropHandle={() => setEditPictureButton(false)}
                  onFileRejectHandle={() => setEditPictureButton(true)}
                  hidePickerWhenUploading
                  files={currentUserData.avatar_url}
                  data-cy='basicInformation-file-picker'
                />
                <Button
                  variant='tertiary'
                  size='small'
                  className='ml-2'
                  onClick={() => {
                    setEditPictureButton(true);
                  }}
                  data-cy='cancel-file-attach-button'
                >
                  {intl.get('PROJECT_DETAIL.FILES_TAB.CANCEL')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className='flex mt-4 mr-4'>
        {user?.id && (
          <div className='inline-block mr-14'>
            <Typography
              variant='body2'
              className='m-0 leading-5 font-semibold text-tiny text-neutral-black'
            >
              {intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.USER_TYPE')}
            </Typography>
            <Typography
              variant='body2'
              className='m-0 leading-6 pt-4 font-normal text-tiny text-neutral-black'
            >
              {intl.get(
                `USERS_PAGE.TABLE.USER_TYPE.${userType.toLocaleUpperCase()}`
              )}
            </Typography>
          </div>
        )}
        {userType === USER_TYPES.L_D && (
          <Toggle
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.TOGGLE_LABEL'
            )}
            offText={intl.get(
              'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.TOGGLE_OFF_TEXT'
            )}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChangeField(
                e.target.checked ? USER_ROLES.ADMIN : USER_ROLES.USER,
                'role'
              );
            }}
            checked={userRole === USER_ROLES.ADMIN}
            onText={intl.get(
              'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.TOGGLE_ON_TEXT'
            )}
            className='m-0 text-neutral-black text-sm font-semibold'
            labelProps={{
              className: 'mb-5',
              'data-testid': 'make-admin_toggle',
            }}
            isSmall
            id='make-admin-toggle'
          />
        )}
      </div>
      <FormItem
        label={intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.FIRST_NAME')}
        data-cy='label__first-name'
        labelProps={{
          required: true,
          state: errors.firstName ? 'error' : 'default',
        }}
        helpText={
          errors.firstName &&
          intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
        }
        helpTextProps={{ state: errors.firstName ? 'error' : 'default' }}
        className='ml-4 mt-2'
      >
        <TextField
          variant='text'
          length='medium'
          placeholder={intl.get(
            'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.FIRST_NAME_PLACEHOLDER'
          )}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentUserData((userData) => {
              handleChangeField(e.target.value, 'data.firstName');
              return {
                ...userData,
                data: {
                  ...userData.data,
                  firstName: e.target.value,
                },
              };
            });
          }}
          defaultValue={firstName}
          data-cy='field__first-name'
          state={errors.firstName ? 'error' : 'default'}
        />
      </FormItem>
      <FormItem
        label={intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.LAST_NAME')}
        data-cy='label__last-name'
        labelProps={{
          required: true,
          state: errors.lastName ? 'error' : 'default',
        }}
        helpText={
          errors.lastName &&
          intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
        }
        helpTextProps={{ state: errors.lastName ? 'error' : 'default' }}
        className='mr-4 mt-2'
      >
        <TextField
          variant='text'
          length='medium'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentUserData((userData) => {
              handleChangeField(e.target.value, 'data.lastName');
              return {
                ...userData,
                data: {
                  ...userData.data,
                  lastName: e.target.value,
                },
              };
            });
          }}
          placeholder={intl.get(
            'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.LAST_NAME_PLACEHOLDER'
          )}
          defaultValue={lastName}
          data-cy='field__last-name'
          state={errors.lastName ? 'error' : 'default'}
        />
      </FormItem>
      <FormItem
        label={intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.EMAIL')}
        data-cy='label__email'
        labelProps={{
          required: true,
          state: errors.email ? 'error' : 'default',
        }}
        helpText={
          errors.email &&
          intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
        }
        helpTextProps={{ state: errors.email ? 'error' : 'default' }}
        className='ml-4 mt-4 col-start-1 col-end-1 col-span-2'
      >
        <TextField
          variant='text'
          length='medium'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChangeField(e.target.value, 'data.email');
          }}
          defaultValue={email}
          data-cy='field__email'
          state={errors.email ? 'error' : 'default'}
          placeholder={intl.get(
            'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.EMAIL_PLACEHOLDER'
          )}
          disabled={user?.id && user.id !== currentUserId}
        />
      </FormItem>
      <FormItem
        label={intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.COUNTRY')}
        labelProps={{
          required: true,
          state: errors.country ? 'error' : 'default',
        }}
        helpText={
          errors.country &&
          intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
        }
        helpTextProps={{ state: errors.country ? 'error' : 'default' }}
        data-cy='label__country'
        className='ml-4 mt-4 col-start-1 col-end-1 col-span-2'
      >
        <Dropdown
          options={countryOptions}
          filterable
          values={[
            {
              label: intl.get(`COUNTRIES.${country}`),
              value: country,
            },
          ]}
          triggerProps={{
            className: 'h-6',
            'data-cy': 'field__country',
            placeholder: intl.get(
              'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.COUNTRY_PLACEHOLDER'
            ),
          }}
          onChange={(option: Option) => {
            setCountry(option.value);
            setProvince('');
            handleChangeField(option.value, 'country_iso_3166_1_alpha_2_code');
            handleChangeField('', 'data.province');
          }}
          state={errors.country ? 'error' : 'default'}
        />
      </FormItem>
      <FormItem
        label={intl.get('SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.PROVINCE')}
        className='mt-4 mr-4'
      >
        {provinceOptions.length > 0 ? (
          <Dropdown
            controlled
            filterable
            values={[
              {
                label: province,
                value: province,
              },
            ]}
            triggerProps={{
              className: 'h-6',
              placeholder: intl.get(
                'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.PROVINCE_LIST_PLACEHOLDER'
              ),
            }}
            options={provinceOptions}
            onChange={(option: Option) => {
              setProvince(option.value);
              handleChangeField(option.value, 'data.province');
            }}
          />
        ) : (
          <TextField
            variant='text'
            length='medium'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChangeField(e.target.value, 'data.province');
            }}
            placeholder={intl.get(
              'SETTINGS_PAGE.USER_PAGE.BASIC_INFORMATION.PROVINCE_TEXT_PLACEHOLDER'
            )}
            defaultValue={province}
          />
        )}
      </FormItem>
    </div>
  );
};

export default BasicInformation;
