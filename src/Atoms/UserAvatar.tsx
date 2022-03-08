import { Avatar } from '@getsynapse/design-system';
import get from 'lodash/get';
import { AvatarUser } from 'utils/customTypes';

interface Props {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  user?: AvatarUser;
}

const UserAvatar = ({ className, size, user }: Props) => {
  return (
    <Avatar
      className={className}
      imageSrc={get(user, 'avatar_url')}
      initial={`${get(user, 'data.firstName[0]', '')}${get(
        user,
        'data.lastName[0]',
        ''
      )}`}
      size={size}
    />
  );
};

export default UserAvatar;
