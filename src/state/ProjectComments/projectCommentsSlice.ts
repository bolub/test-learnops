import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import get from 'lodash/get';
import { RootState } from 'state/store';
import { selectUserId } from 'state/User/userSlice';
import { ProjectComment, Status } from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';
import ProjectCommentsApi from './projectCommentsApi';

interface ProjectCommentsState {
  value: ProjectComment[];
  status: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: ProjectCommentsState = {
  value: [],
  status: SLICE_STATUS.IDLE,
};

const projectCommentsApi = ProjectCommentsApi;

/* ============================== REDUX THUNK =============================== */
export const fetchComments = createAsyncThunk(
  'project/FETCH_COMMENTS',
  async (projectId: string) => {
    const response = await projectCommentsApi.fetchProjectComments(projectId);
    return response.projectComments;
  }
);

export const addComment = createAsyncThunk(
  'project/ADD_COMMENT',
  async (params: { projectId: string; content: string }, { getState }) => {
    const state = getState() as RootState;
    const currentUserId = selectUserId(state);
    const newComment = await projectCommentsApi.addNewProjectComment(
      params.projectId,
      currentUserId!,
      params.content
    );
    return newComment;
  }
);

export const updateComment = createAsyncThunk(
  'project/UPDATE_COMMENT',
  async (params: { commentId: string; content: string }) => {
    const updatedComment = await projectCommentsApi.updateProjectComment(
      params.commentId,
      params.content
    );
    return { commentId: params.commentId, updatedComment };
  }
);

export const removeComment = createAsyncThunk(
  'project/REMOVE_COMMENT',
  async (commentId: string) => {
    await projectCommentsApi.removeProjectComment(commentId);
    return commentId;
  }
);

/* ================================= REDUCER ================================ */
const projectCommentsSlice = createSlice({
  name: 'projectComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.value = state.value.concat(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.value = state.value.map((comment: ProjectComment) =>
          comment.id === action.payload.commentId
            ? {
                ...action.payload.updatedComment,
                commentCreator: { ...comment.commentCreator },
              }
            : comment
        );
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.value = state.value.filter(
          (comment: ProjectComment) => comment.id !== action.payload
        );
      });
  },
});

/* =============================== SELECTORS ================================ */
const getComments = (state: RootState) => state.projectComments.value;

export const formattedComments = createSelector(
  [getComments],
  (comments: ProjectComment[]) =>
    comments.map((comment: ProjectComment) => ({
      ...comment,
      author: {
        userId: get(comment, 'commentCreator.id'),
        name: `${get(comment, 'commentCreator.data.firstName')} ${get(
          comment,
          'commentCreator.data.lastName'
        )}`,
      },
    }))
);

export default projectCommentsSlice.reducer;
