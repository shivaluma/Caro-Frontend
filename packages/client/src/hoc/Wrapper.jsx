import { useEffect, memo } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, notification } from 'antd';

import socket from 'configs/socket';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from 'slices/online';

const Wrapper = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    socket.on('user-change', ({ online, data }) => {
      if (online) {
        dispatch(addItem(data));
      } else {
        dispatch(removeItem(data));
      }
    });

    if (user && user.email) {
      socket.on('game-invite', (data) => {
        if (user._id !== data.userId) return;
        if (Number.isInteger(user.room)) return;
        const key = `open${Date.now()}`;
        const btn = (
          <div className="flex">
            <Button size="medium" onClick={() => notification.close(key)}>
              Decline
            </Button>
            <Button
              className="ml-2"
              type="primary"
              size="medium"
              onClick={() => {
                notification.close(key);
                history.push(`/${data.roomId}`, { requirepass: false });
              }}>
              Accept
            </Button>
          </div>
        );

        notification.open({
          duration: 30,
          message: 'Game Invitation',
          description: `Player ${data.inviteName} has invited you to play at room #${data.roomId}.`,
          btn,
          key
        });
      });

      const emitOffline = () => {
        socket.emit('user-offline', user);
      };

      window.onbeforeunload = (ev) => {
        ev.preventDefault();
        emitOffline();
      };
    }

    return () => {
      socket.off('game-invite');
      socket.off('user-change');
    };
  }, [dispatch, user, history]);

  return props.children;
};

export default memo(Wrapper);
