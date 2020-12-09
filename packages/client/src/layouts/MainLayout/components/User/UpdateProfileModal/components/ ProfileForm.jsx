/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import { updateProfile } from 'slices/user';

const ProfileForm = ({ handleToggleModal }) => {
  const { handleSubmit, register, errors } = useForm();
  const [isLoading, changeLoading] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = async ({ displayName }) => {
    changeLoading(true);
    await dispatch(updateProfile(displayName));
    changeLoading(false);

    handleToggleModal();
  };
  const user = useSelector((state) => state.user);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor="displayName">
          <span className="px-0 mb-1 text-left tile-structure-name">Display Name</span>
          <input
            name="displayName"
            id="displayName"
            className={clsx(
              'w-full p-2 border border-gray-300 rounded-md focus:outline-none',
              errors.name && 'border-red-500'
            )}
            defaultValue={user.displayName || ''}
            ref={register({
              required: 'Required',
              pattern: {
                value: /^.{10,40}$/i,
                message: 'Invalid Display Name (at least 10 characters, max 40 characters).',
              },
            })}
          />
        </label>
        {errors.displayName && (
          <span className="mt-1 text-xs font-medium text-red-600">{errors.displayName.message}</span>
        )}

        <label htmlFor="email">
          <span className="px-0 mt-3 mb-1 text-left tile-structure-name">Email</span>
          <input
            name="email"
            id="email"
            defaultValue={user.email}
            className={clsx(
              'w-full p-2 border border-gray-300 rounded-md focus:outline-none cursor-not-allowed',
              errors.name && 'border-red-500'
            )}
            disabled
          />
        </label>

        <button
          className="mt-6 text-xs font-medium text-white border rounded-lg bg-main focus:outline-none"
          type="submit"
          disabled={isLoading}>
          <div className="flex items-center justify-center h-10">
         
            {isLoading ? <Spin className="mt-1" /> : 'Save'}

          </div>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
