import {
  Typography,
  OverflowMenu,
  OverflowMenuItem,
  TextArea,
  Button,
} from '@getsynapse/design-system';
import classnames from 'classnames';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Fragment, useMemo, useState, useEffect } from 'react';
import { selectUserId } from 'state/User/userSlice';
import { useAppSelector } from 'state/hooks';
import { QuestionCommentType, ProjectComment } from 'utils/customTypes';

const CommentBlock = ({
  comment,
  onEdit = () => {},
  onDelete = () => {},
}: {
  comment: QuestionCommentType | ProjectComment;
  onEdit?: ({
    commentId,
    content,
  }: {
    commentId: string;
    content: string;
  }) => void;
  onDelete?: (commentId: string) => void;
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>(comment.content);
  const userId = useAppSelector(selectUserId);
  const isOwner = useMemo(
    () => (comment.author ? comment.author.userId === userId : false),
    [comment?.author, userId]
  );

  const updateComment = () => {
    onEdit({ commentId: comment.id, content: commentContent });
    setEditMode(false);
  };

  useEffect(() => {
    if (editMode) {
      setCommentContent(comment.content);
    }
  }, [editMode, comment.content]);

  return (
    <div
      className={classnames('pt-4', 'pb-6', 'px-6')}
      data-cy={`comment-${comment.id}`}
    >
      <div
        className={classnames(
          'flex',
          'items-center',
          'mb-4',
          'justify-between'
        )}
      >
        <div className={classnames('flex', 'items-center')}>
          <Typography variant='h6' weight='medium'>
            {comment.author ? comment.author.name : ''}
          </Typography>
          <span className={classnames('text-neutral-light', 'text-xs', 'ml-4')}>
            {comment.createdAt === comment.updatedAt
              ? moment(comment.createdAt).fromNow()
              : intl.get('COMMENT.EDITED') +
                ' ' +
                moment(comment.updatedAt).fromNow()}
          </span>
        </div>

        {isOwner && (
          <OverflowMenu
            menuListProps={{
              className: classnames('z-50', 'relative'),
            }}
            menuButtonProps={{
              'data-cy': 'overflow-button',
            }}
          >
            <OverflowMenuItem
              onSelect={() => {
                setEditMode(true);
              }}
              data-testid='edit-button'
            >
              {intl.get('COMMENT.EDIT')}
            </OverflowMenuItem>
            <OverflowMenuItem
              onSelect={() => onDelete(comment.id)}
              data-testid='delete-button'
            >
              {intl.get('COMMENT.DELETE')}
            </OverflowMenuItem>
          </OverflowMenu>
        )}
      </div>

      {!editMode ? (
        <div>{comment.content}</div>
      ) : (
        <Fragment>
          <TextArea
            value={commentContent}
            textAreaProps={{
              className: 'h-auto min-h-10 max-h-30 px-4 py-3',
              'data-cy': 'edit-comment-input',
            }}
            onChange={(event) => setCommentContent(event.target.value)}
            data-cy='input-comment'
          />

          <div className={classnames('flex', 'space-x-4', 'mt-4')}>
            <Button
              size='small'
              onClick={updateComment}
              data-testid='update-button'
            >
              {intl.get('COMMENT.UPDATE_BUTTON')}
            </Button>

            <Button
              size='small'
              variant='secondary'
              onClick={() => setEditMode(false)}
            >
              {intl.get('COMMENT.CANCEL_BUTTON')}
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default CommentBlock;
