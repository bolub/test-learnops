import get from 'lodash/get';
import { PropertyCommentType, QuestionCommentType } from 'utils/customTypes';

const getPropertyComments: (
  propertiesComments: { [key: string]: PropertyCommentType[] },
  propertykey: string
) => QuestionCommentType[] = (propertiesComments, propertykey) => {
  return get(propertiesComments, propertykey, []).map((comment) => {
    const userName =
      get(comment, 'commentCreator.data.firstName') &&
      get(comment, 'commentCreator.data.lastName')
        ? `${comment.commentCreator.data.firstName} ${comment.commentCreator.data.lastName}`
        : get(comment, 'commentCreator.data.full_name');
    return {
      id: comment.id,
      content: comment.message,
      author: {
        userId: comment.commentCreator.id,
        name: userName,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  });
};

export default getPropertyComments;
