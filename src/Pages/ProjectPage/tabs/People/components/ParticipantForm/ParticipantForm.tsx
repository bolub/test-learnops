import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {
  Typography,
  FormItem,
  Dropdown,
  Datepicker,
  UsersPicker,
  NumericInput,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import {
  getOriginalProjectData,
  getAvailableLDUsersForOwnersAndMembers,
  getAvailableUsersForCollaborators,
} from 'state/Project/projectSlice';
import ProjectAPI from 'state/Project/projectAPI';
import {
  PROJECT_PARTICIPANT_TYPE,
  NEW_PROJECT_PARTICIPANT_FIELDS,
  PROJECT_PARTICIPANT_ROLE,
} from 'utils/constants';
import {
  NewProjectParticipant,
  rangeDate,
  UserOption,
  FormOption,
  UserAvatars,
} from 'utils/customTypes';

const ParticipantForm: React.FC<{
  participant: NewProjectParticipant;
  updateParticipant: (key: string, value: string | rangeDate) => void;
}> = ({ participant, updateParticipant }) => {
  const [totalAvailability, setTotalAvailability] = useState(0);
  const projectData = useSelector(getOriginalProjectData);
  const availableMembersUsers = useSelector(
    getAvailableLDUsersForOwnersAndMembers
  );
  const availableCollaboratorsUsers = useSelector(
    getAvailableUsersForCollaborators
  );
  const participantsTypeOptions = useMemo(
    () => [
      {
        value: PROJECT_PARTICIPANT_TYPE.MEMBER,
        label: intl.get(
          'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_TYPE_FIELD_OPTIONS.MEMBER'
        ),
      },
      {
        value: PROJECT_PARTICIPANT_TYPE.COLLABORATOR,
        label: intl.get(
          'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_TYPE_FIELD_OPTIONS.COLLABORATOR'
        ),
      },
    ],
    []
  );
  const participantRolesOptions = useMemo(
    () =>
      PROJECT_PARTICIPANT_ROLE.map((role: string) => ({
        label: role,
        value: role,
      })),
    []
  );
  const usersList = useMemo(() => {
    let resp: UserAvatars[] = [];
    if (participant.type === PROJECT_PARTICIPANT_TYPE.MEMBER) {
      resp = availableMembersUsers;
    }

    if (participant.type === PROJECT_PARTICIPANT_TYPE.COLLABORATOR) {
      resp = availableCollaboratorsUsers;
    }
    return resp;
  }, [participant.type, availableCollaboratorsUsers, availableMembersUsers]);
  const selectedUser = useMemo(
    () =>
      usersList.filter(
        (user: UserAvatars) => user.value === participant.userId
      ),
    [participant.userId, usersList]
  );
  const selectedType = useMemo(
    () =>
      participantsTypeOptions.filter(
        (option: FormOption) => option.value === participant.type
      ),
    [participantsTypeOptions, participant.type]
  );

  const handleFetchTotalAvailability = useCallback(
    async (userId: string, startDate: string, endDate: string) => {
      const { userTotalAvailability } =
        await ProjectAPI.fetchParticipantAvailability(
          userId,
          startDate,
          endDate
        );
      setTotalAvailability(userTotalAvailability);
    },
    []
  );

  useEffect(() => {
    if (
      participant.type === PROJECT_PARTICIPANT_TYPE.MEMBER &&
      !isEmpty(participant.userId) &&
      participant.startDate &&
      participant.endDate
    ) {
      handleFetchTotalAvailability(
        participant.userId,
        participant.startDate,
        participant.endDate
      );
    }
  }, [
    participant.type,
    participant.userId,
    participant.startDate,
    participant.endDate,
    handleFetchTotalAvailability,
  ]);

  return (
    <React.Fragment>
      <Typography variant='body' className='text-neutral-black mb-4'>
        {intl.get(
          'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.DESCRIPTION'
        )}
      </Typography>
      <div className='grid grid-cols-2 gap-x-10 gap-y-4'>
        <div>
          <FormItem
            label={intl.get(
              'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_TYPE_FIELD_LABEL'
            )}
            labelProps={{ required: true }}
            className='mb-3'
          >
            <Dropdown
              options={participantsTypeOptions}
              values={selectedType}
              triggerProps={{
                'data-cy': 'participant-form__type-field',
              }}
              onChange={(option: FormOption) =>
                updateParticipant(
                  NEW_PROJECT_PARTICIPANT_FIELDS.TYPE,
                  option.value
                )
              }
              placeholder={intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_TYPE_FIELD_PLACEHOLDER'
              )}
            />
          </FormItem>
          <FormItem>
            <Datepicker
              className='w-full'
              data-cy='participant-form__date-range-field'
              minDate={projectData.startDate && new Date(projectData.startDate)}
              maxDate={
                projectData.targetCompletionDate &&
                new Date(projectData.targetCompletionDate)
              }
              startDate={
                participant.startDate && new Date(participant.startDate)
              }
              endDate={participant.endDate && new Date(participant.endDate)}
              canSelectRange
              startDateLabel={intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_START_DATE_FIELD_LABEL'
              )}
              startDateLabelProps={{
                required: true,
              }}
              endDateLabel={intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_END_DATE_FIELD_LABEL'
              )}
              endDateLabelProps={{
                required: true,
              }}
              onPickDate={(date: rangeDate) =>
                updateParticipant(
                  NEW_PROJECT_PARTICIPANT_FIELDS.START_DATE,
                  date
                )
              }
            />
          </FormItem>
        </div>
        <FormItem
          label={intl.get(
            'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_ROLE_FIELD_LABEL'
          )}
          labelProps={{ required: true }}
          className='flex-1'
        >
          <Dropdown
            options={participantRolesOptions}
            onChange={(option: FormOption) =>
              updateParticipant(
                NEW_PROJECT_PARTICIPANT_FIELDS.JOB_ROLE,
                option.value
              )
            }
            placeholder={intl.get(
              'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_ROLE_FIELD_PLACEHOLDER'
            )}
            triggerProps={{
              'data-cy': 'participant-form__role-field',
            }}
          />
        </FormItem>
        <FormItem
          label={intl.get(
            'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_USER_FIELD_LABEL'
          )}
          labelProps={{ required: true }}
        >
          <UsersPicker
            triggerText={intl.get(
              'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_USER_FIELD_PLACEHOLDER'
            )}
            usersList={usersList}
            multiple={false}
            selectedUsersList={selectedUser}
            triggerProps={{
              'data-cy': 'participant-form__user-field',
            }}
            onChange={(owner: UserOption) =>
              updateParticipant(
                NEW_PROJECT_PARTICIPANT_FIELDS.USER_ID,
                owner.value
              )
            }
          />
        </FormItem>
        {participant.type === PROJECT_PARTICIPANT_TYPE.MEMBER &&
          participant.userId &&
          participant.startDate &&
          participant.endDate && (
            <div className='flex justify-between'>
              <FormItem
                label={intl.get(
                  'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_TOTAL_AVAILABILITY'
                )}
              >
                <Typography
                  variant='body'
                  className='text-neutral-black'
                  data-cy='project-form__total-availability'
                >
                  {totalAvailability}
                </Typography>
              </FormItem>
              <FormItem
                label={intl.get(
                  'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_TOTAL_ALLOCATED_HOURS'
                )}
              >
                <NumericInput
                  data-cy='participant-form__allocated-hours'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateParticipant(
                      NEW_PROJECT_PARTICIPANT_FIELDS.HOURS_ASSIGNED,
                      event.target.value
                    )
                  }
                />
              </FormItem>
            </div>
          )}
        {participant.userId &&
          participant.type === PROJECT_PARTICIPANT_TYPE.COLLABORATOR && (
            <FormItem
              label={intl.get(
                'PEOPLE.RESOURCE_ALLOCATION.ADD_PARTICIPANT_MODAL.PARTICIPANT_ESTIMATED_HOURS_NEEDED'
              )}
            >
              <NumericInput
                data-cy='participant-form__estimated-hours'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  updateParticipant(
                    NEW_PROJECT_PARTICIPANT_FIELDS.ESTIMATED_HOURS,
                    event.target.value
                  )
                }
              />
            </FormItem>
          )}
      </div>
    </React.Fragment>
  );
};

export default ParticipantForm;
