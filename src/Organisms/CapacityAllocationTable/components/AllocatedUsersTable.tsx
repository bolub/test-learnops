import React from 'react';
import classnames from 'classnames';
import { Checkbox, Typography } from '@getsynapse/design-system';
import {
  Column,
  Assignment,
  AllocatedUser,
  AllocatedUserColumn,
} from '../helpers';

export const TableHeaders: React.FC<{
  headers: Column[];
}> = ({ headers }) => {
  return (
    <div className='flex flex-1 h-full'>
      <div className='w-12 py-2'>
        <Checkbox
          value=''
          label=''
          className='justify-end'
          inputProps={{ className: 'mr-3' }}
        />
      </div>
      {headers.map((header: Column, index: number) => {
        const { content, ...otherProps } = header;
        return (
          <div {...otherProps} key={index}>
            <Typography
              variant='caption'
              className='font-semibold text-primary-dark'
            >
              {content}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export const AllocatedUserDetails: React.FC<{
  user: AllocatedUser;
  onToggleSection: (id: string) => void;
  isSectionOpen: boolean;
}> = ({ user, onToggleSection, isSectionOpen }) => {
  return (
    <div
      key={user.id}
      className='flex flex-1 h-full shadow-allocation-table-inner'
    >
      <div className='w-12 py-2 shadow-table-column'>
        <Checkbox
          value=''
          label=''
          className='justify-end'
          inputProps={{ className: 'mr-3' }}
        />
      </div>
      {user.columns.map((column: AllocatedUserColumn, index: number) => {
        const { children, className, ...otherProps } = column;
        return (
          <div
            key={index}
            {...otherProps}
            className={classnames('shadow-table-column', className)}
          >
            {children({
              toggleSection: () => onToggleSection(user.id),
              isOpen: isSectionOpen,
            })}
          </div>
        );
      })}
    </div>
  );
};

export const AllocatedUserAssignments: React.FC<{
  assignments: Assignment[];
}> = ({ assignments }) => {
  return (
    <div className='h-full flex shadow-allocation-table-inner'>
      <div className='w-12' />
      <div className='h-full flex flex-1 flex-col shadow-table-column'>
        {assignments.map((assignment: Assignment, index: number) => {
          return (
            <div key={index}>
              {assignment.columns.map((column: Column, index: number) => {
                const { content, ...otherProps } = column;
                return (
                  <div key={index} {...otherProps}>
                    {content}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
