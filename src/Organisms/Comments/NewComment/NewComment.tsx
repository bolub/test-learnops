import React, { useRef, useEffect, useState } from 'react';
import { TextArea, Button } from '@getsynapse/design-system';
import intl from 'react-intl-universal';

type NewCommentProps = {
  onCreate?: (content: string) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  placeholder: string;
  submitButtonLabel: string;
};

const NewComment = ({
  onCreate = () => {},
  setOpen,
  isOpen,
  placeholder,
  submitButtonLabel,
}: NewCommentProps) => {
  const [value, setValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleClear = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setValue('');
    }
  }, [isOpen]);

  const handleCreateComment = (event: React.FormEvent) => {
    event && event.preventDefault();
    if (value.trim().length > 0) {
      onCreate(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleCreateComment} ref={formRef}>
      <TextArea
        value={value}
        onChange={handleChange}
        className='px-6 py-4 shadow-form-wrapper'
        textAreaProps={{
          className: 'h-auto min-h-10 max-h-26 px-4 py-3',
          placeholder: placeholder,
          'data-cy': 'add-new-comment',
        }}
      />
      {value.length > 0 && (
        <div className='flex space-x-4 px-6 pb-4'>
          <Button size='small' type='submit' data-cy='post-comment-button'>
            {submitButtonLabel}
          </Button>
          <Button
            variant='secondary'
            size='small'
            type='reset'
            onClick={handleClear}
            data-cy='cancel-comment-button'
          >
            {intl.get('COMMENT.CANCEL_BUTTON')}
          </Button>
        </div>
      )}
    </form>
  );
};

export default NewComment;
