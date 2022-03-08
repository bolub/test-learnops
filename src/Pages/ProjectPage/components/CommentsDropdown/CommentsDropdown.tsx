import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { usePopper } from 'react-popper';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { Button, useElevation, Typography } from '@getsynapse/design-system';
import {
  fetchComments,
  formattedComments,
  addComment,
  updateComment,
  removeComment,
} from 'state/ProjectComments/projectCommentsSlice';

import NewComment from 'Organisms/Comments/NewComment/NewComment';
import CommentsList from 'Organisms/Comments/CommentsList';

const CommentsDropdown: React.FC<{ projectId: string }> = ({ projectId }) => {
  const dispatch = useDispatch();
  const commentsList = useSelector(formattedComments);
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonElement, setButtonElement] = useState<HTMLDivElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const overflowMenuOptions = useMemo<string[]>(
    () => [intl.get('COMMENT.EDIT'), intl.get('COMMENT.DELETE')],
    []
  );

  const handleClickOutside = useCallback(
    (event: Event) => {
      const target = event.target as Element;
      if (
        !overflowMenuOptions.includes(
          target.getAttribute('data-valuetext') as string
        ) &&
        !containerRef?.current?.contains(target) &&
        !containerRef?.current?.contains(target) &&
        showPopper
      ) {
        setShowPopper(false);
      }
    },
    [showPopper, overflowMenuOptions]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClickOutside]);

  const handleEscape = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === 'Escape' || key === 'Esc') {
      setShowPopper(false);
    }
  };

  const togglePopper = () => {
    setShowPopper((prevState) => !prevState);
  };

  const popperElevation = useElevation(2);
  const { styles, attributes, update } = usePopper(
    buttonElement,
    popperElement,
    {
      placement: 'bottom-end',
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: [0, 4],
          },
        },
      ],
    }
  );

  useEffect(() => {
    if (showPopper && update) {
      update();
    }
  }, [showPopper, update]);

  useEffect(() => {
    dispatch(fetchComments(projectId));
  }, [projectId, dispatch]);

  const addCommentHandle = (content: string) =>
    dispatch(addComment({ projectId, content }));

  const updateCommentHandle = (params: {
    commentId: string;
    content: string;
  }) => dispatch(updateComment(params));

  const removeCommentHandle = (commentId: string) =>
    dispatch(removeComment(commentId));

  return (
    <div ref={containerRef} className='relative bg-neutral-white h-auto mr-2.5'>
      <div ref={setButtonElement} className='h-auto'>
        <Button
          data-cy='project-comments-trigger'
          size='small'
          variant='tertiary'
          onClick={togglePopper}
          iconName='chatbox'
          className={classnames('relative', {
            'bg-neutral-lightest border-transparent': showPopper,
          })}
        >
          <React.Fragment>
            {commentsList.length > 0 && (
              <span className='text-neutral-white text-tiny absolute ml-2 -mt-1.5 font-bold'>
                {commentsList.length > 9 ? '9+' : commentsList.length}
              </span>
            )}
            <Typography variant='body2'>
              {intl.get('PROJECT_DETAIL.COMMENTS')}
            </Typography>
          </React.Fragment>
        </Button>
      </div>
      <div
        hidden={!showPopper}
        ref={setPopperElement}
        style={styles.popper}
        className={classnames(
          'rounded z-20 w-100 bg-neutral-white',
          popperElevation
        )}
        {...attributes.popper}
      >
        <CommentsList
          comments={commentsList}
          onDelete={removeCommentHandle}
          onEdit={updateCommentHandle}
          emptyListMessage={intl.get('PROJECT_DETAIL.NO_COMMENTS')}
          testId='project-comments-list'
        />
        <NewComment
          setOpen={setShowPopper}
          isOpen={showPopper}
          onCreate={addCommentHandle}
          placeholder={intl.get('PROJECT_DETAIL.ADD_COMMENT')}
          submitButtonLabel={intl.get('PROJECT_DETAIL.SUBMIT_COMMENT')}
        />
      </div>
    </div>
  );
};

export default CommentsDropdown;
