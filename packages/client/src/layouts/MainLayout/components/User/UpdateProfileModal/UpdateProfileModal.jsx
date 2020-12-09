import { Modal } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleProfileSetting } from 'slices/profile';
import { ProfileForm } from './components';

const UpdateProfileModal = () => {
  const profileShowing = useSelector((state) => state.profile.showProfile);
  const dispatch = useDispatch();
  const handleCancel = () => dispatch(toggleProfileSetting());
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
