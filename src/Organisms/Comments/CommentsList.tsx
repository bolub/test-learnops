import React, { Fragment } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ProjectComment, QuestionCommentType } from 'utils/customTypes';
import { Typography } from '@getsynapse/design-system';
import CommentBlock from './CommentBlock';
import HiddenComments from './HiddenComments';

const CommentsList: React.FC<{
  comments: ProjectComment[] | QuestionCommentType[];
  onEdit?: (params: { commentId: string; content: string }) => void;
  onDelete: (commentId: string) => void;
  testId?: string;
  emptyListMessage: string;
}> = ({ comments, onEdit, onDelete, testId, emptyListMessage }) => {
  return (
    <div data-cy={testId}>
      {!isEmpty(comments) ? (
        comments.length <= 2 ? (
          comments.map(
            (comment: QuestionCommentType | ProjectComment, index: number) => (
              <CommentBlock
                key={index}
                comment={comment}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          )
        ) : (
          <Fragment>
            <CommentBlock
              comment={comments[0]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <HiddenComments
              comments={comments.slice(1)}
              onEdit={onEdit}
              onDelete={onDelete}
              testId={testId!}
            />
          </Fragment>
        )
      ) : (
        <div className='w-full h-20 py-4 px-6 flex items-center justify-start'>
          <Typography variant='body' className='text-neutral'>
            {emptyListMessage}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
