import { Typography } from '@getsynapse/design-system';
import UserAvatar from 'Atoms/UserAvatar';

type TableAvatarType = {
  avatar_url?: string;
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

type TableAvatarProps = {
  user: TableAvatarType;
};
const TableAvatar = ({ user }: TableAvatarProps) => {
  return (
    <div className='flex items-start'>
      <UserAvatar user={user} />
      <div className='pl-2'>
        <Typography variant='body2'>{`${user.data.firstName} ${user.data.lastName}`}</Typography>
        <Typography variant='body2' className='text-neutral'>
          {user.data.email}
        </Typography>
      </div>
    </div>
  );
};

export default TableAvatar;
