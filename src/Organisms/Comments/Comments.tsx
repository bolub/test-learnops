import { IconButton, useElevation } from '@getsynapse/design-system';
import { usePopper } from 'react-popper';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import NewComment from './NewComment/NewComment';
import CommentsList from './CommentsList';
import { QuestionCommentType } from 'utils/customTypes';

const Comments = ({
  comments = [],
  className = '',
  onEdit = () => {},
  onDelete = () => {},
  onCreate = () => {},
  testId,
  isPopupOpen = false,
}: {
  comments: QuestionCommentType[];
  className?: string;
  testId?: string;
  onEdit?: ({
    commentId,
    content,
  }: {
    commentId: string;
    content: string;
  }) => void;
  onDelete?: (commentId: string) => void;
  onCreate?: (content: string) => void;
  isPopupOpen?: boolean;
}) => {
  const overflowMenuOptions = useMemo<string[]>(
    () => [intl.get('COMMENT.EDIT'), intl.get('COMMENT.DELETE')],
    []
  );
  const element = document.querySelector('#request-tabs-container');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isPopupUpdated, setIsPopupUpdated] = useState<boolean>(false);
  const buttonElement = useRef<HTMLDivElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);

  const popperElevation = useElevation(2);
  const customModifier = useMemo(
    () => ({
      name: 'flip',
      options: {
        fallbackPlacements: ['top', 'right'],
        boundary: element,
      },
    }),
    [element]
  );
  const {
    styles,
    attributes,
    update: UpdatePopup,
  } = usePopper(buttonElement.current, popperElement.current, {
    placement: 'auto-start',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [0, 4],
        },
      },
      customModifier,
    ],
  });

  const handleClickOutside = useCallback(
    (event: Event) => {
      const target = event.target as Element;
      if (
        !overflowMenuOptions.includes(
          target.getAttribute('data-valuetext') as string
        ) &&
        !popperElement.current?.contains(target) &&
        !buttonElement.current?.contains(target) &&
        showPopup
      ) {
        setShowPopup(false);
        setIsPopupUpdated(false);
      }
    },
    [overflowMenuOptions, showPopup]
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

  useEffect(() => {
    if (isPopupOpen) {
      setShowPopup(true);
    }
  }, [isPopupOpen]);

  useEffect(() => {
    if (showPopup && UpdatePopup) {
      UpdatePopup();
      setIsPopupUpdated(true);
    }
  }, [showPopup, UpdatePopup]);

  const handleEscape = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === 'Escape' || key === 'Esc') {
      setShowPopup(false);
      setIsPopupUpdated(false);
    }
  };

  return (
    <div className={className}>
      <div
        ref={buttonElement}
        className={classnames('relative', 'cursor-pointer')}
        onClick={() => setShowPopup((isOpen) => !isOpen)}
        data-testid={`${testId}-comments_icon-button`}
      >
        <IconButton
          name={showPopup ? 'chatbox' : 'chatbox-outline'}
          description='comment'
          hasASize={false}
          color={showPopup ? 'primary' : 'default'}
        />

        <span
          className={classnames(
            `${showPopup ? 'text-neutral-white' : 'text-neutral'} `,
            'absolute',
            'left-6px',
            'bottom-1',
            'text-8',
            'leading-3'
          )}
          data-testid='comment-button'
        >
          {comments.length <= 9 ? comments.length : '9+'}
        </span>
      </div>
      <div
        ref={popperElement}
        style={styles.popper}
        {...attributes.popper}
        className={classnames(
          'w-96',
          { invisible: !isPopupUpdated },
          'z-10',
          'bg-neutral-white',
          'rounded',
          'text-neutral-black',
          popperElevation
        )}
        hidden={!showPopup}
      >
        <CommentsList
          comments={comments}
          onDelete={onDelete}
          onEdit={onEdit}
          emptyListMessage={intl.get('PROJECT_DETAIL.NO_COMMENTS')}
        />
        <NewComment
          onCreate={onCreate}
          setOpen={setShowPopup}
          isOpen={showPopup}
          submitButtonLabel={intl.get('COMMENT.POST')}
          placeholder={
            comments.length > 0
              ? intl.get('COMMENT.REPLY')
              : intl.get('COMMENT.WRITE_COMMENT')
          }
        />
      </div>
    </div>
  );
};

export default Comments;
