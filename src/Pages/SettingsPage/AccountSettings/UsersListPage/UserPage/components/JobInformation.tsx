import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import {
  FormItem,
  Typography,
  TextField,
  Dropdown,
  TextArea,
} from '@getsynapse/design-system';
import {
  JOB_FUNCTIONS,
  EMPLOYMENT_TYPE,
  LANGUAGES,
  USER_TYPES,
} from 'utils/constants';
import {
  selectLearningTeams,
  getLearningTeams,
} from 'state/LearningTeams/learningTeamsSlice';
import {
  selectBussinessTeams,
  getBusinessTeams,
} from 'state/BusinessTeams/businessTeamsSlice';
import {
  Option,
  FormOption,
  AllUsersType,
  objKeyAsString,
} from 'utils/customTypes';
import get from 'lodash/get';
import MultiSelectDropdown from 'Organisms/MultiSelectDropdow/MultiSelectDropdown';

const JobInformation = ({
  user,
  userType,
  handleChangeField,
  errors,
}: {
  user?: Partial<AllUsersType>;
  userType: string;
  handleChangeField: (
    eventTargetValue: string | string[],
    pathToUpdate: string
  ) => void;
  errors: objKeyAsString;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLearningTeams());
    dispatch(getBusinessTeams());
  }, [dispatch]);

  const learningTeams = useSelector(selectLearningTeams);
  const learningTeamOptions: FormOption[] = useMemo(
    () =>
      learningTeams.reduce((newTeams: FormOption[], team) => {
        if (team.team_manager_id !== user?.id) {
          return newTeams.concat({
            value: team.id,
            label: team.name,
          });
        }

        return newTeams;
      }, []),
    [learningTeams, user?.id]
  );

  const userLearningTeam = get(user, 'registeredLearningTeams');

  const { userLearningTeamName, userLearningTeamId } = useMemo(
    () =>
      userLearningTeam
        ? {
            userLearningTeamName: get(userLearningTeam[0], 'name'),
            userLearningTeamId: get(userLearningTeam[0], 'id'),
          }
        : {},
    [userLearningTeam]
  );

  const businessTeams = useSelector(selectBussinessTeams);
  const businessTeamsOptions = useMemo(() => {
    return businessTeams.map((team) => ({
      value: team.id,
      label: team.title,
    }));
  }, [businessTeams]);

  const userBusinessTeam = businessTeamsOptions.find(
    (team) => team.value === get(user, 'businessTeam_id')
  );

  const { userBusinessTeamName, userBusinessTeamId } = useMemo(() => {
    return {
      userBusinessTeamName: get(userBusinessTeam, 'label'),
      userBusinessTeamId: get(userBusinessTeam, 'value'),
    };
  }, [userBusinessTeam]);

  const userEmploymentType: string = useMemo(
    () => get(user, 'data.employmentType'),
    [user]
  );
  const userEmploymentTypeLabel: string = intl.get(
    `TEAMS.EMPLOYMENT_TYPE.${userEmploymentType}`
  );
  const employmentTypeOptions: { value: string; label: string }[] =
    useMemo(() => {
      return EMPLOYMENT_TYPE.map((empType) => ({
        value: empType,
        label: intl.get(`TEAMS.EMPLOYMENT_TYPE.${empType}`),
      }));
    }, []);

  const userJobFunctions: string[] = get(user, 'data.jobFunctions');
  const userJobFunctionsValues: { value: string; label: string }[] =
    useMemo(() => {
      return userJobFunctions
        ? userJobFunctions.map((jobFunction: string) => ({
            label: intl.get(`TEAMS.JOB_FUNCTIONS.${jobFunction}`),
            value: jobFunction,
          }))
        : [];
    }, [userJobFunctions]);

  const userLanguages: string[] = get(user, 'data.languages');
  const userLanguageValues: { value: string; label: string }[] = useMemo(() => {
    return userLanguages
      ? userLanguages.map((language: string) => ({
          label: intl.get(`LANGUAGES.${language.toLocaleLowerCase()}`),
          value: language,
        }))
      : [];
  }, [userLanguages]);

  const languageOptions: { value: string; label: string }[] = useMemo(() => {
    return LANGUAGES.map((language) => ({
      value: language,
      label: intl.get(`LANGUAGES.${language}`),
    }));
  }, []);

  const jobFunctionOptions: { value: string; label: string }[] = useMemo(() => {
    return JOB_FUNCTIONS.map((jobFunctions) => ({
      value: jobFunctions,
      label: intl.get(`TEAMS.JOB_FUNCTIONS.${jobFunctions}`),
    }));
  }, []);
  const jobTitle: string = get(user, 'data.jobTitle');
  const hourlyRate: Number = get(user, 'data.rateHour');
  const companyName: string = get(user, 'data.companyName');
  return (
    <div className='grid grid-cols-2 gap-x-20 gap-y-6 mx-4'>
      <div className='col-span-2'>
        <Typography variant='h5' className='mt-8 text-neutral-black'>
          {intl.get('SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.TITLE')}
        </Typography>
        <Typography variant='caption' className='block text-neutral-light'>
          {intl.get('SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.CAPTION')}
        </Typography>
      </div>
      {userType === USER_TYPES.L_D && (
        <>
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.JOB_TITLE'
            )}
            data-cy='label__job-title'
            labelProps={{
              required: true,
              state: errors.jobTitle ? 'error' : 'default',
            }}
            helpText={
              errors.jobTitle &&
              intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
            }
            helpTextProps={{ state: errors.jobTitle ? 'error' : 'default' }}
          >
            <TextField
              variant='text'
              length='medium'
              placeholder={intl.get(
                'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.JOB_TITLE_PLACEHOLDER'
              )}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeField(e.target.value, 'data.jobTitle');
              }}
              defaultValue={jobTitle}
              data-cy='field__job-title'
              state={errors.jobTitle ? 'error' : 'default'}
            />
          </FormItem>
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.JOB_FUNCTION'
            )}
            data-cy='label__job-function'
          >
            <MultiSelectDropdown
              options={jobFunctionOptions}
              values={userJobFunctionsValues}
              onChange={(options: FormOption[]) => {
                const values = options.map((item) => {
                  return item.value;
                });
                handleChangeField(values, 'data.jobFunctions');
              }}
              otherProps={{
                filterable: true,
                multiple: true,
                placeholder: intl.get(
                  'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.JOB_FUNCTION_PLACEHOLDER'
                ),
              }}
              triggerProps={{
                className: 'h-6',
              }}
            />
          </FormItem>
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.EMPLOYMENT_TYPE'
            )}
            data-cy='label__employment-type'
            labelProps={{
              required: true,
              state: errors.employmentType ? 'error' : 'default',
            }}
            helpText={
              errors.employmentType &&
              intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
            }
            helpTextProps={{
              state: errors.employmentType ? 'error' : 'default',
            }}
          >
            <Dropdown
              options={employmentTypeOptions}
              values={
                userEmploymentType !== 'UNDEFINED'
                  ? [
                      {
                        label: userEmploymentTypeLabel,
                        value: userEmploymentType,
                      },
                    ]
                  : []
              }
              triggerProps={{
                'data-cy': 'field__employment-type',
                placeholder: intl.get(
                  'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.EMPLOYMENT_TYPE_PLACEHOLDER'
                ),
              }}
              onChange={(option: Option) => {
                handleChangeField(option.value, 'data.employmentType');
              }}
              state={errors.employmentType ? 'error' : 'default'}
            />
          </FormItem>
          <FormItem
            label={intl.get('SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.TEAM')}
            data-cy='label__team'
          >
            <Dropdown
              options={learningTeamOptions}
              values={
                userLearningTeamId
                  ? [{ label: userLearningTeamName, value: userLearningTeamId }]
                  : []
              }
              triggerProps={{
                'data-cy': 'field__team',
                placeholder: intl.get(
                  'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.TEAM_PLACEHOLDER'
                ),
              }}
              onChange={(option: Option) => {
                handleChangeField(
                  option.value,
                  'registeredLearningTeams[0].id'
                );
              }}
            />
          </FormItem>
          <TextArea
            className='row-span-2 flex flex-col'
            label={intl.get('SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.SKILLS')}
            labelProps={{
              'data-cy': 'label__skills-description',
            }}
            textAreaProps={{
              className: 'h-auto flex-grow',
              placeholder: intl.get(
                'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.SKILLS_PLACEHOLDER'
              ),
              defaultValue: get(user, 'data.skills'),
              'data-testid': 'field__skills-description',
            }}
            onChange={(e) => {
              handleChangeField(e.target.value, 'data.skills');
            }}
          />
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.LANGUAGES'
            )}
            data-cy='label__languages'
          >
            <MultiSelectDropdown
              options={languageOptions}
              values={userLanguageValues}
              onChange={(options: FormOption[]) => {
                const values = options.map((item) => {
                  return item.value;
                });
                handleChangeField(values, 'data.languages');
              }}
              otherProps={{
                filterable: true,
                multiple: true,
                placeholder: intl.get(
                  'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.LANGUAGES_PLACEHOLDER'
                ),
              }}
              triggerProps={{
                className: 'h-6',
                'data-cy': 'field__team',
              }}
            />
          </FormItem>
          <div className='flex items-end'>
            <FormItem
              className='flex-grow'
              label={intl.get(
                'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.HOURLY_RATE'
              )}
              data-cy='label__hourly-rate'
              labelProps={{ state: 'default' }}
            >
              <div className='flex items-center'>
                <TextField
                  className='flex-grow'
                  variant='text'
                  length='medium'
                  placeholder={intl.get(
                    'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.HOURLY_RATE_PLACEHOLDER'
                  )}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChangeField(e.target.value, 'data.rateHour');
                  }}
                  defaultValue={hourlyRate}
                  data-cy='field__hourly-rate'
                />

                <span className='flex-end py-0 pl-2 text-neutral-black'>
                  {intl.get('TEAMS.CURRENCY')}
                </span>
              </div>
            </FormItem>
          </div>
        </>
      )}
      {userType === USER_TYPES.BUSINESS && (
        <>
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.JOB_TITLE'
            )}
            data-cy='label__job-title'
            labelProps={{
              required: true,
              state: errors.jobTitle ? 'error' : 'default',
            }}
            helpText={
              errors.jobTitle &&
              intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
            }
            helpTextProps={{ state: errors.jobTitle ? 'error' : 'default' }}
          >
            <TextField
              variant='text'
              length='medium'
              placeholder={intl.get(
                'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.JOB_TITLE_PLACEHOLDER'
              )}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeField(e.target.value, 'data.jobTitle');
              }}
              defaultValue={jobTitle}
              data-cy='field__job-title'
              state={errors.jobTitle ? 'error' : 'default'}
            />
          </FormItem>
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.BUSINESS_TEAM'
            )}
            data-cy='label__business-team'
            labelProps={{
              required: true,
              state: errors.businessTeam ? 'error' : 'default',
            }}
            helpText={
              errors.businessTeam &&
              intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
            }
            helpTextProps={{
              state: errors.businessTeam ? 'error' : 'default',
            }}
          >
            <Dropdown
              options={businessTeamsOptions}
              values={
                userBusinessTeam && [
                  {
                    label: userBusinessTeamName,
                    value: userBusinessTeamId,
                  },
                ]
              }
              triggerProps={{
                'data-cy': 'field__business-team',
                placeholder: intl.get(
                  'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.BUSINESS_TEAM_PLACEHOLDER'
                ),
              }}
              onChange={(option: Option) => {
                handleChangeField(option.value, 'businessTeam_id');
              }}
              state={errors.businessTeam ? 'error' : 'default'}
            />
          </FormItem>
        </>
      )}
      {userType === USER_TYPES.EXTERNAL && (
        <>
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.COMPANY_NAME'
            )}
            data-cy='label__company-name'
            labelProps={{
              required: true,
              state: errors.companyName ? 'error' : 'default',
            }}
            helpText={
              errors.companyName &&
              intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
            }
            helpTextProps={{ state: errors.companyName ? 'error' : 'default' }}
          >
            <TextField
              variant='text'
              length='medium'
              placeholder={intl.get(
                'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.COMPANY_NAME_PLACEHOLDER'
              )}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeField(e.target.value, 'data.companyName');
              }}
              data-cy='field__company-name'
              defaultValue={companyName}
              state={errors.companyName ? 'error' : 'default'}
            />
          </FormItem>
          <FormItem
            label={intl.get(
              'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.JOB_TITLE'
            )}
            data-cy='label__job-title'
            labelProps={{
              required: true,
              state: errors.jobTitle ? 'error' : 'default',
            }}
            helpText={
              errors.jobTitle &&
              intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.MISSING_INFORMATION')
            }
            helpTextProps={{ state: errors.jobTitle ? 'error' : 'default' }}
          >
            <TextField
              variant='text'
              length='medium'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeField(e.target.value, 'data.jobTitle');
              }}
              data-cy='field__job-title'
              defaultValue={jobTitle}
              state={errors.jobTitle ? 'error' : 'default'}
            />
          </FormItem>
          <div className='flex'>
            <FormItem
              label={intl.get(
                'SETTINGS_PAGE.USER_PAGE.JOB_INFORMATION.HOURLY_RATE'
              )}
              data-cy='label__hourly-rate'
              labelProps={{ state: 'default' }}
              className='w-full'
            >
              <TextField
                variant='text'
                length='medium'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeField(e.target.value, 'data.rateHour');
                }}
                data-cy='field__hourly-rate'
                defaultValue={hourlyRate}
              />
            </FormItem>
            <span className='flex-end py-8 pl-2'>
              {intl.get('TEAMS.CURRENCY')}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default JobInformation;
