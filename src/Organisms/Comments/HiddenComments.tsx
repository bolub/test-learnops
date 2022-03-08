import { Fragment, useState } from 'react';
import { Button } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import CommentBlock from './CommentBlock';
import { QuestionCommentType, ProjectComment } from 'utils/customTypes';

const HiddenComments = ({
  comments = [],
  onEdit = () => {},
  onDelete = () => {},
  testId = '',
}: {
  comments: QuestionCommentType[] | ProjectComment[];
  onEdit?: ({
    commentId,
    content,
  }: {
    commentId: string;
    content: string;
  }) => void;
  onDelete?: (commentId: string) => void;
  testId: string;
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setExpanded((prevState) => !prevState);
  };

  return (
    <Fragment>
      <Button
        variant='tertiary'
        onClick={toggleExpanded}
        className='w-full'
        data-testid={`${testId}-hidden-comments-button`}
      >
        {expanded
          ? intl.get('COMMENT.HIDE_COMMENTS')
          : `${comments.length - 1} ${
              comments.length > 2
                ? intl.get('COMMENT.HIDDEN_COMMENTS')
                : intl.get('COMMENT.HIDDEN_COMMENT')
            }`}
      </Button>
      {expanded && (
        <div
          className='max-h-100 overflow-y-auto'
          data-testid={`${testId}-hidden-comments-list`}
        >
          {comments.map((comment) => (
            <CommentBlock
              key={comment.id}
              comment={comment}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      {!expanded && (
        <CommentBlock
          comment={comments[comments.length - 1]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </Fragment>
  );
};

export default HiddenComments;
