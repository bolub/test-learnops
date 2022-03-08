import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import get from 'lodash/get';
import { RootState } from 'state/store';
import {
  newPropertyCommentType,
  PropertyCommentType,
  QuestionCommentType,
} from 'utils/customTypes';
import requestCommentsAPI from './requestCommentsAPI';

interface PropertiesComments {
  propertiesComments: {
    [key: string]: PropertyCommentType[];
  };
  questionComments: {
    id: string;
    comments: QuestionCommentType[];
  }[];
}

/* ============================= INITIAL STATE ============================== */
const initialState: PropertiesComments = {
  propertiesComments: {},
  questionComments: [],
};

/* ============================== REDUX THUNK =============================== */
export const getPropertiesComments = createAsyncThunk(
  'requestComments/GET_PROPERTIES_COMMENTS',
  async (requestId: string) => {
    const response = await requestCommentsAPI.fetchPropertiesComments(
      requestId
    );
    return response.data.requestPropertyCommentsByProperty;
  }
);

export const updatePropertiesComment = createAsyncThunk(
  'requestComments/UPDATE_Property_COMMENT',
  async ({ commentId, message }: { commentId: string; message: string }) => {
    const { data } = await requestCommentsAPI.updatePropertyComment(
      commentId,
      message
    );
    return data;
  }
);

export const deletePropertiesComment = createAsyncThunk(
  'requests/DELETE_PROPERTIES_COMMENT',
  async ({
    commentId,
    propertykey,
  }: {
    commentId: string;
    propertykey: string;
  }) => {
    await requestCommentsAPI.deletePropertiesComment(commentId);
    return { commentId, propertykey };
  }
);

export const postPropertiesComment = createAsyncThunk(
  'requestComments/POST_PROPERTIES_COMMENT',
  async (content: newPropertyCommentType, { getState }) => {
    const state = getState() as RootState;
    const user = state.currentUser.value || '';
    if (user && user.id) {
      const { data } = await requestCommentsAPI.postNewPropertiesComment({
        ...content,
        userId: user.id,
      });
      return { data, propertyKey: content.requestProperty };
    }
  }
);

export const getQuestionComments = createAsyncThunk(
  'requestComments/GET_QUESTION_COMMENTS',
  async (questionId: string) => {
    const response = await requestCommentsAPI.fetchQuestionsComments(
      questionId
    );
    return response.intakeQuestions;
  }
);

export const updateQuestionComment = createAsyncThunk(
  'requestComments/UPDATE_QUESTION_COMMENT',
  async ({
    commentId,
    content,
    questionId,
  }: {
    commentId: string;
    content: string;
    questionId: string;
  }) => {
    const response = await requestCommentsAPI.updateQuestionComment(
      commentId,
      content
    );

    return { questionId, comment: response[1] };
  }
);

export const deleteQuestionComment = createAsyncThunk(
  'requestComments/DELETE_QUESTION_COMMENT',
  async ({ commentId, threadId }: { commentId: string; threadId: string }) => {
    await requestCommentsAPI.deleteQuestionComment(commentId);
    return { commentId, threadId };
  }
);

export const postQuestionComment = createAsyncThunk(
  'requestComments/POST_QUESTION_COMMENT',
  async ({ questionId, content }: { questionId: string; content: string }) => {
    const response = await requestCommentsAPI.postNewQuestionComment(
      questionId,
      content
    );
    return { comment: response, questionId };
  }
);

/* ================================= REDUCER ================================ */
const requestCommentsSlice = createSlice({
  name: 'requestComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPropertiesComments.fulfilled, (state, action) => {
        state.propertiesComments = action.payload;
      })
      .addCase(updatePropertiesComment.fulfilled, (state, action) => {
        state.propertiesComments = {
          ...state.propertiesComments,
          [action.payload.requestProperty]: state.propertiesComments[
            action.payload.requestProperty
          ].map((comment) =>
            comment.id === action.payload.id
              ? { ...comment, ...action.payload }
              : comment
          ),
        };
      })
      .addCase(deletePropertiesComment.fulfilled, (state, action) => {
        state.propertiesComments[action.payload.propertykey] =
          state.propertiesComments[action.payload.propertykey].filter(
            (comment) => comment.id !== action.payload.commentId
          );
      })
      .addCase(postPropertiesComment.fulfilled, (state, action) => {
        const propertyKey = get(action, 'payload.propertyKey', '');
        const newComment = get(action, 'payload.data', '');
        if (propertyKey) {
          state.propertiesComments = {
            ...state.propertiesComments,
            [propertyKey]: [
              { ...newComment, commentCreator: { ...newComment.user } },
              ...get(state, `propertiesComments.${propertyKey}`, ''),
            ],
          };
        }
      })
      .addCase(getQuestionComments.fulfilled, (state, action) => {
        state.questionComments = action.payload;
      })
      .addCase(updateQuestionComment.fulfilled, (state, action) => {
        state.questionComments = state.questionComments.map((commentThread) => {
          if (commentThread.id === action.payload.questionId) {
            return {
              ...commentThread,
              comments: commentThread.comments.map((comment) => {
                return comment.id === action.payload.comment.id
                  ? { ...comment, ...action.payload.comment }
                  : comment;
              }),
            };
          } else {
            return commentThread;
          }
        });
      })
      .addCase(deleteQuestionComment.fulfilled, (state, action) => {
        const threadIndex = state.questionComments.findIndex(
          (thread) => thread.id === action.payload.threadId
        );
        state.questionComments[threadIndex].comments = state.questionComments[
          threadIndex
        ].comments.filter((comment) => comment.id !== action.payload.commentId);
      })
      .addCase(postQuestionComment.fulfilled, (state, action) => {
        const threadId = state.questionComments.findIndex(
          (thread) => thread.id === action.payload.questionId
        );
        if (threadId !== -1) {
          state.questionComments = state.questionComments.map(
            (commentThread) => {
              if (commentThread.id === action.payload.questionId) {
                return {
                  ...commentThread,
                  comments: [action.payload.comment, ...commentThread.comments],
                };
              } else {
                return commentThread;
              }
            }
          );
        } else {
          state.questionComments = [
            ...state.questionComments,
            {
              id: action.payload.questionId,
              comments: [action.payload.comment],
            },
          ];
        }
      });
  },
});

/* ================================ ACTIONS ================================= */

/* =============================== SELECTORS ================================ */
export const selectPropertiesComments = (state: RootState) =>
  state.requestComments.propertiesComments;
export const selectQuestionComments = (state: RootState) =>
  state.requestComments.questionComments;

export default requestCommentsSlice.reducer;
