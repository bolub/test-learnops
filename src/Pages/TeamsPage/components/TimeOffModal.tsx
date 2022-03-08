import { useState, useMemo, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import intl from 'react-intl-universal';
import {
  Modal,
  Typography,
  Table,
  Button,
  Datepicker,
  Dropdown,
} from '@getsynapse/design-system';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import moment from 'moment';
import {
  getUserTimeOffs,
  userCreateTimeOff,
  selectTimeOffs,
  deleteUserTimeOff,
} from 'state/TimeOff/TimeOffSlice';
import { UPDATE_MEMBER_FORM, TIME_OFF_TYPE } from 'utils/constants';
import { TimeOff, FormOption, TimeOffData } from 'utils/customTypes';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';

type TimeOffModalProps = {
  username: string;
  userId?: string;
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
};

const TimeOffModal = ({
  username,
  userId,
  isOpen = false,
  setIsOpen,
}: TimeOffModalProps) => {
  const dispatch = useDispatch();
  const [newDate, setNewDate] = useState<TimeOff | null>();
  const [hasNewDate, setHasNewDate] = useState<boolean>(false);
  const timeOffData = useSelector(selectTimeOffs);
  const [timeOffs, setTimeOffs] = useState<TimeOffData[]>([]);

  useLayoutEffect(() => {
    if (userId) {
      dispatch(getUserTimeOffs(userId));
    }
  }, [dispatch, userId]);

  useLayoutEffect(() => {
    setTimeOffs(timeOffData);
  }, [timeOffData, isOpen]);

  const onPersistTimeOffs = () => {
    const deletedDates = timeOffData.filter(
      (timeOff) => !timeOffs.includes(timeOff)
    );
    if (!isEmpty(deletedDates)) {
      deletedDates!.forEach((date) => {
        dispatch(deleteUserTimeOff(date.id || ''));
      });
      dispatch(
        setNotificationText(
          intl.get('TIMEOFF_DELETION_SUCCESS.TIMEOFF_DELETED')
        )
      );
      dispatch(setNotificationVariant('success'));
      dispatch(setNotificationTimeout(4000));
      dispatch(displayNotification());
    }
    const newDates = timeOffs.filter((timeOff) => !get(timeOff, 'id', false));
    if (!isEmpty(newDates)) {
      newDates.forEach((date) => {
        dispatch(userCreateTimeOff({ ...date!, userId }));
      });
    }
    onCancel();
  };

  const timeOffTypeOptions = useMemo(() => {
    return Object.keys(TIME_OFF_TYPE).map((type) => ({
      value: type,
      label: intl.get(`TEAMS.TIME_OFF.TIME_OFF_TYPES.${type}`),
    }));
  }, []);

  const onRemoveTimeOffs = (index: number) => {
    if (!isEmpty(timeOffs)) {
      setTimeOffs((timeOffs) => [
        ...timeOffs.slice(0, index),
        ...timeOffs.slice(index + 1),
      ]);
    }
  };

  const onCancel = () => {
    setHasNewDate(false);
    setNewDate({});
    setTimeOffs([]);
    setIsOpen(false);
  };

  const onAddNewDate = () => {
    if (!isEmpty(newDate)) {
      const data: TimeOffData = {
        ...newDate,
        time_off_type: get(newDate, 'timeOffType'),
        user_id: userId,
        start_date: get(newDate, 'startDate', ''),
        end_date: get(newDate, 'endDate', ''),
      };
      setTimeOffs((prevData) => [...prevData, data]);
      setHasNewDate(false);
      setNewDate({});
    }
  };

  const onRemoveNewDate = () => {
    setNewDate({});
    setHasNewDate(false);
  };

  const dayOffsChanged = useMemo(() => {
    const equals = timeOffs.filter((timeOff) => timeOffData.includes(timeOff));
    return timeOffs
      ? timeOffData.length === timeOffs.length &&
          timeOffs.length === equals?.length
      : false;
  }, [timeOffData, timeOffs]);
  return (
    <Modal
      isOpen={isOpen}
      closeModal={onCancel}
      aria-label='member-time-off'
      data-cy='member-time-off'
      title={intl.get('TEAMS.TIME_OFF.TITLE', {
        user: username,
      })}
      size='large'
      actionButtons={[
        {
          children: intl.get('TEAMS.SAVE'),
          variant: 'primary',
          'data-cy': 'confirm-button',
          type: 'submit',
          form: UPDATE_MEMBER_FORM,
          onClick: onPersistTimeOffs,
          disabled: dayOffsChanged,
        },
        {
          children: intl.get('PROJECT_DETAIL.DELETE_PROJECT.CANCEL'),
          variant: 'tertiary',
          onClick: onCancel,
          'data-cy': 'cancel-button',
        },
      ]}
    >
      <Typography>{intl.get('TEAMS.TIME_OFF.ADD_REMOVE_TIME_OFF')}</Typography>
      <Table
        className='w-full mt-8'
        canSelectRows={false}
        data={{
          headData: {
            headCells: [
              {
                content: intl.get('TEAMS.TIME_OFF.TABLE_HEAD.DATES'),
                colSpan: 4,
              },
              {
                content: intl.get('TEAMS.TIME_OFF.TABLE_HEAD.TIME_OFF_TYPE'),
                colSpan: 5,
              },
              {
                colSpan: 1,
                content: '',
              },
            ],
          },
          rows: [
            ...timeOffs.map((timeOff, index) => ({
              id: get(timeOff, 'id'),
              cells: [
                {
                  content: `${moment(get(timeOff, 'start_date'))
                    .utc()
                    .format('MMM D, YYYY')} - ${moment(get(timeOff, 'end_date'))
                    .utc()
                    .format('MMM D, YYYY')}`,
                  colSpan: 4,
                },
                {
                  content: intl.get(
                    `TEAMS.TIME_OFF.TIME_OFF_TYPES.${get(
                      timeOff,
                      'time_off_type',
                      'UNDEFINED'
                    )}`
                  ),
                  colSpan: 5,
                },
                {
                  colSpan: 1,
                  content: (
                    <Button
                      variant='tertiary'
                      onClick={() => onRemoveTimeOffs(index)}
                    >
                      {intl.get('TEAMS.TIME_OFF.REMOVE')}
                    </Button>
                  ),
                },
              ],
            })),
            ...(hasNewDate
              ? [
                  {
                    id: 'new',
                    cells: [
                      {
                        colSpan: 2,
                        content: (
                          <Datepicker
                            canSelectRange
                            onPickDate={(dates: TimeOff) => {
                              setNewDate((prevData) => ({
                                ...prevData,
                                ...dates,
                              }));
                            }}
                            startPlaceHolder={intl.get('TEAMS.TIME_OFF.START')}
                            endPlaceHolder={intl.get('TEAMS.TIME_OFF.END')}
                            className='bg-transparent'
                          />
                        ),
                      },
                      {
                        content: (
                          <Dropdown
                            onChange={(value: FormOption) => {
                              setNewDate((prevData) => ({
                                ...prevData,
                                timeOffType: value.value,
                              }));
                            }}
                            options={timeOffTypeOptions}
                            triggerProps={{
                              placeholder: intl.get(
                                'TEAMS.TIME_OFF.SELECT_TYPE'
                              ),
                            }}
                          />
                        ),
                        colSpan: 7,
                        className: 'w-full',
                      },
                      {
                        colSpan: 1,
                        content: (
                          <div className='flex'>
                            <Button
                              variant='tertiary'
                              disabled={isEmpty(newDate)}
                              onClick={onAddNewDate}
                            >
                              {intl.get('TEAMS.TIME_OFF.ADD')}
                            </Button>
                            <Button
                              variant='tertiary'
                              disabled={isEmpty(newDate)}
                              onClick={onRemoveNewDate}
                            >
                              {intl.get('TEAMS.TIME_OFF.REMOVE')}
                            </Button>
                          </div>
                        ),
                      },
                    ],
                  },
                ]
              : []),
          ],
        }}
      />
      {!hasNewDate && (
        <Button
          variant='tertiary'
          iconName='add-circle'
          className='mt-5'
          onClick={() => setHasNewDate((prevHasNewDate) => !prevHasNewDate)}
        >
          {intl.get('TEAMS.TIME_OFF.ADD_NEW_TIME_OFF')}
        </Button>
      )}
    </Modal>
  );
};

export default TimeOffModal;
