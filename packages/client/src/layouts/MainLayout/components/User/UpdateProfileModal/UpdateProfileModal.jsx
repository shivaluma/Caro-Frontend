import { Modal } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeMode } from '../../app/slices/profileSlice';
import { ProfileForm } from './components';

const UpdateProfileModal = () => {
  const profileShowing = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const handleCancel = () => dispatch(changeMode());
  return (
    <Modal
      title="My Profile Settings."
      visible={profileShowing}
      okText="Save"
      footer={null}
      width={700}
      onCancel={handleCancel}>
      <ProfileForm handleToggleModal={handleCancel} />
    </Modal>
  );
};

export default UpdateProfileModal;
