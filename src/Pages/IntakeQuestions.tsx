import cloneDeep from 'lodash/cloneDeep';
import { debounce, get } from 'lodash';
import set from 'lodash/set';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { PickerFileMetadata } from 'filestack-js';
import classnames from 'classnames';
import RadioQuestion from './Questions/RadioQuestion';
import CheckboxQuestion from './Questions/CheckboxQuestion';
import RangeQuestion from './Questions/RangeQuestion';
import DateQuestion from './Questions/DateQuestion';
import DropdownQuestion from './Questions/DropdownQuestion';
import NumberQuestion from './Questions/NumberQuestion';
import TextAreaQuestion from './Questions/TextAreaQuestion';
import UrlQuestion from './Questions/UrlQuestion';
import Comments from 'Organisms/Comments/Comments';
import {
  deleteQuestionComment,
  getQuestionComments,
  postQuestionComment,
  selectQuestionComments,
  updateQuestionComment,
} from 'state/RequestComments/requestCommentsSlice';
import {
  deleteRequestQuestions,
  updateRequestQuestions,
} from 'state/ActiveRequest/activeRequestSlice';
import {
  OverflowMenu,
  OverflowMenuItem,
  Button,
} from '@getsynapse/design-system';
import FileUploadQuestion from './Questions/FileUploadQuestion';
import { intakeQuestionWrapper } from 'utils/customTypes';

type qnsComponentMap = {
  [key: string]: (props: intakeQuestionWrapper) => JSX.Element;
};

export const IntakeQuestions = ({
  questions,
  requestId,
  sectionName,
  showComment,
  setUpdatedReqData,
  disableFields,
  questionIdParam,
}: {
  questions: any;
  requestId: string;
  sectionName?: string;
  showComment?: boolean;
  setUpdatedReqData: any;
  disableFields: boolean;
  testId?: string;
  questionIdParam?: string;
}) => {
  const dispatch = useDispatch();
  const commentsSelector = useSelector(selectQuestionComments);
  const [qnsInEdit, setQnsInEdit] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    dispatch(getQuestionComments(requestId));
  }, [dispatch, requestId]);

  const submitChangeHandler = debounce(
    (
      question: any,
      value: string | boolean | number | Array<PickerFileMetadata>,
      path: string
    ) => {
      setUpdatedReqData((prevState: any) => {
        let updatedQuestion;
        if (question.id in prevState.requestQuestions) {
          updatedQuestion = cloneDeep(prevState.requestQuestions[question.id]);
        } else {
          updatedQuestion = cloneDeep(question);
        }
        set(updatedQuestion, path, value);
        return {
          ...prevState,
          ...{
            requestQuestions: {
              ...prevState.requestQuestions,
              ...{ [updatedQuestion.id]: updatedQuestion },
            },
          },
        };
      });
    },
    500
  );

  const questionComponent: qnsComponentMap = {
    radio: RadioQuestion,
    checkbox: CheckboxQuestion,
    range: RangeQuestion,
    date: DateQuestion,
    dropdown: DropdownQuestion,
    number: NumberQuestion,
    customTextArea: TextAreaQuestion,
    url: UrlQuestion,
    file: FileUploadQuestion,
  };

  const getComment = (questionId: string) => {
    const questionComments = commentsSelector.find(
      (question: any) => question.id === questionId
    );
    return get(questionComments, 'comments', []).map((comment) => ({
      id: comment.id,
      content: comment.content,
      author: comment.author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  };

  const onEditComment = ({
    commentId,
    content,
    questionId,
  }: {
    commentId: string;
    content: string;
    questionId: string;
  }) => {
    dispatch(updateQuestionComment({ commentId, content, questionId }));
  };

  const onDeleteComment = (commentId: string, questionId: string) => {
    const questionComments = commentsSelector.find(
      (question: any) => question.id === questionId
    );
    dispatch(
      deleteQuestionComment({ commentId, threadId: questionComments!.id })
    );
  };

  const deleteQuestion = async (questionId: string) => {
    await dispatch(deleteRequestQuestions({ questionId, requestId }));
  };

  const onEdit = async (questionId: string, questionTitle: string) => {
    setQnsInEdit(questionId);
    setNewTitle(questionTitle);
  };

  const saveQuestionTitle = async (questionId: string) => {
    let qnsToEdit = questions.find(
      (qns: { id: string }) => qns.id === questionId
    );
    let questionClone = cloneDeep(qnsToEdit);
    questionClone.data.label = newTitle;
    await dispatch(
      updateRequestQuestions({
        requestId,
        updateData: [questionClone],
      })
    );
    setQnsInEdit('');
  };

  const onTitleChange = debounce((value: string) => {
    setNewTitle(value);
  }, 500);

  const onCreateComment = async (questionId: string, content: string) => {
    dispatch(postQuestionComment({ questionId, content }));
  };

  return questions.map((question: any) => {
    const Question = questionComponent[question.type];
    const isEditing = qnsInEdit === question.id;

    return Question ? (
      <div className='mt-4 relative' key={question.id}>
        {!isEditing && showComment && (
          <Comments
            className={classnames('absolute', 'right-6')}
            comments={getComment(question.id)}
            onEdit={({ commentId, content }) =>
              onEditComment({ commentId, content, questionId: question.id })
            }
            onDelete={(commentId) => onDeleteComment(commentId, question.id)}
            onCreate={(content) => onCreateComment(question.id, content)}
            testId={question.id}
            isPopupOpen={questionIdParam === question.id}
          />
        )}

        {!isEditing && question.section === 'additionalDetails' ? (
          <OverflowMenu
            menuButtonProps={{
              'data-testid': `${question.id}-menu-ellipsis`,
              className: classnames('absolute', 'right-0'),
            }}
            menuListProps={{
              className: classnames('z-50', 'mb-4', 'relative'),
            }}
          >
            <OverflowMenuItem
              data-testid={`${question.id}-edit-option`}
              onSelect={() => onEdit(question.id, question.data.label)}
            >
              {intl.get('COMMENT.EDIT')}
            </OverflowMenuItem>
            <OverflowMenuItem
              data-testid={`${question.id}-delete-option`}
              onSelect={() => deleteQuestion(question.id)}
            >
              {intl.get('COMMENT.DELETE')}
            </OverflowMenuItem>
          </OverflowMenu>
        ) : (
          isEditing && (
            <div className='flex h-7'>
              <div
                contentEditable
                id='editable-question'
                suppressContentEditableWarning
                className={classnames('focus:outline-none w-64')}
                style={{ backgroundColor: '#D0E3FF' }}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onTitleChange(event.target.innerHTML)
                }
              >
                {question.data.label}
              </div>
              <Button
                variant='tertiary'
                className='ml-auto'
                data-testid={`${question.id}-save-option`}
                onClick={() => saveQuestionTitle(qnsInEdit)}
              >
                Save
              </Button>
            </div>
          )
        )}
        <Question
          question={question}
          className={classnames({
            'mt-6': sectionName === 'additionalDetails',
          })}
          handler={submitChangeHandler}
          disabled={disableFields}
          isEditing={isEditing}
        />
      </div>
    ) : null;
  });
};

export default IntakeQuestions;
