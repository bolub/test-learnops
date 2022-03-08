import intl from 'react-intl-universal';
import { Typography } from '@getsynapse/design-system';
import get from 'lodash/get';
import { Owner } from 'utils/customTypes';
import UserAvatar from 'Atoms/UserAvatar';

type MemberInfoProps = { user: Owner };

const MemberInfo = ({ user }: MemberInfoProps) => (
  <div className='flex space-x-6 items-center'>
    <div className='flex flex-col w-24'>
      <UserAvatar
        size='large'
        user={{
          avatar_url: user.avatar_url,
          data: {
            firstName: get(user, 'data.firstName'),
            lastName: get(user, 'data.lastName'),
          },
        }}
      />
    </div>
    <div className='grid grid-cols-3 gap-6 flex-wrap w-full'>
      <div className='flex flex-col'>
        <Typography variant='label' weight='medium'>
          {intl.get('TEAMS.UPDATE_MODAL.EMAIL_ID')}
        </Typography>
        <Typography>{get(user, 'data.email')}</Typography>
      </div>
      <div className='flex flex-col'>
        <Typography variant='label' weight='medium'>
          {intl.get('TEAMS.UPDATE_MODAL.JOB_TITLE')}
        </Typography>
        <Typography>{get(user, 'data.jobTitle')}</Typography>
      </div>
      <div className='flex flex-col'>
        <Typography variant='label' weight='medium'>
          {intl.get('TEAMS.UPDATE_MODAL.RATE_PER_HOUR')}
        </Typography>
        <Typography>
          {get(user, 'data.rateHour')
            ? `${intl.get('TEAMS.CURRENCY')} ${get(user, 'data.rateHour')}`
            : intl.get('TEAMS.EMPLOYMENT_TYPE.UNDEFINED')}
        </Typography>
      </div>
      <div className='flex flex-col'>
        <Typography variant='label' weight='medium'>
          {intl.get('TEAMS.UPDATE_MODAL.COUNTRY')}
        </Typography>
        <Typography>
          {intl.get(
            `COUNTRIES.${get(
              user,
              'country_iso_3166_1_alpha_2_code',
              'UNDEFINED'
            )}`
          )}
        </Typography>
      </div>
      <div className='flex flex-col'>
        <Typography variant='label' weight='medium'>
          {intl.get('TEAMS.UPDATE_MODAL.EMPLOYMENT_TYPE')}
        </Typography>
        <Typography>
          {intl.get(
            `TEAMS.EMPLOYMENT_TYPE.${get(
              user,
              'data.employmentType',
              'UNDEFINED'
            )}`
          )}
        </Typography>
      </div>
    </div>
  </div>
);

export default MemberInfo;
