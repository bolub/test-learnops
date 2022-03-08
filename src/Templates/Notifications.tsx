import { useState } from 'react';
import { PushNotification } from '@getsynapse/design-system';
import { Link } from 'react-router-dom';
import useNotifications from 'Hooks/useNotifications';

const Notifications = () => {
  const { list, setList } = useNotifications();
  const [hiddenIndices, setHiddenIndices] = useState<string[]>([]);

  const handleRemove = (index: string) => {
    setHiddenIndices((prevState) => prevState.concat(index));
    setList((prevState) =>
      prevState.filter((notification) => notification.id !== index)
    );
  };

  return (
    <div className='top-14 fixed right-0 z-50'>
      {list.map((item) => {
        return (
          <Link
            to={item.link}
            key={item.id}
            onClick={() => handleRemove(item.id)}
            hidden={hiddenIndices.includes(item.id)}
          >
            <PushNotification
              timeout={4000}
              onTimeout={() => handleRemove(item.id)}
              className='mb-2 relative animate-pushNotify leading-4
               text-neutral-black'
            >
              {item.content}
            </PushNotification>
          </Link>
        );
      })}
    </div>
  );
};

export default Notifications;
