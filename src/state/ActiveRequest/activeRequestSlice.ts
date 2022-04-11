import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import requestAPI from 'state/Requests/requestAPI';
import { RootState } from 'state/store';
import { selectOrganizationId, selectUserId } from 'state/User/userSlice';
import { selectFormsOptions } from 'state/Forms/formSlice';
import { Project, Request, RequestQuestion, Status } from 'utils/customTypes';
import { SLICE_STATUS, QUESTIONNAIRE_TYPE } from 'utils/constants';

interface RequestState {
  value: {
    request: Request;
    requestQuestions: RequestQuestion[];
  };
  status: Status;
}

/* ============================= INITIAL STATE ============================== */
const initialState: RequestState = {
  value: {
    request: {},
    requestQuestions: [],
  },
  status: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const newRequest = createAsyncThunk(
  'activeRequest/CREATE_REQUEST',
  async (
    {
      formId,
      requestTypeId,
    }: {
      formId: string;
      requestTypeId: string;
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const userEmail = selectUserId(state);
    const organizationId = selectOrganizationId(state);

    if (userEmail && organizationId) {
      const response = await requestAPI.createRequest(
        formId,
        requestTypeId,
        userEmail,
        organizationId
      );
      return response.data;
    } else {
      return '';
    }
  }
);

export const getRequest = createAsyncThunk(
  'activeRequest/GET_REQUEST',
  async (requestId: string) => {
    const response = await requestAPI.fetchRequest(requestId);
    return response.data;
  }
);

export const getRequestQuestions = createAsyncThunk(
  'activeRequest/GET_REQUEST_QUESTIONS',
  async (requestId: string) => {
    const response = await requestAPI.fetchRequestQuestions(requestId);
    return response.data;
  }
);

export const editRequest = createAsyncThunk(
  'activeRequest/EDIT_REQUEST',
  async ({
    request,
    updateData,
  }: {
    request: Request;
    updateData: Request;
  }) => {
    const requestId = request.id;
    const updatedRequest = { ...request, ...updateData };
    if (requestId) {
      const response = await requestAPI.updateRequest(
        requestId,
        updatedRequest
      );
      return response.data;
    }
  }
);

export const updateRequestQuestions = createAsyncThunk(
  'activeRequest/UPDATE_REQUEST_QUESTIONS',
  async ({ requestId, updateData }: { requestId: string; updateData: any }) => {
    const { data } = await requestAPI.updateQuestions(requestId, {
      data: Object.values(updateData),
    });
    return data[0];
  }
);

export const createRequestQuestions = createAsyncThunk(
  'activeRequest/CREATE_REQUEST_QUESTIONS',
  async ({
    requestId,
    questionType,
  }: {
    requestId: string;
    questionType: string;
  }) => {
    const response = await requestAPI.createQuestion(requestId, questionType);
    return response;
  }
);

export const deleteRequestQuestions = createAsyncThunk(
  'activeRequest/DELETE_REQUEST_QUESTIONS',
  async ({
    questionId,
    requestId,
  }: {
    questionId: string;
    requestId: string;
  }) => {
    const response = await requestAPI.deleteQuestion(questionId);
    return response;
  }
);

export const updateOwners = createAsyncThunk(
  'activeRequest/UPDATE_OWNERS',
  async ({
    requestId,
    ownersIds,
  }: {
    requestId: string;
    ownersIds: string[];
  }) => {
    await requestAPI.setOwners(requestId, ownersIds);
    const response = await requestAPI.fetchRequest(requestId);
    return response.data;
  }
);

export const linkProjectsToRequest = createAsyncThunk(
  'projects/LINK_REQUESTS',
  async ({
    projects,
    requestId,
  }: {
    projects: Project[];
    requestId: string;
  }) => {
    const projectIds = projects.map((project) => project.id);
    await requestAPI.linkProjectsToRequest(projectIds, requestId);
    return { projects };
  }
);

/* ================================= REDUCER ================================ */
const activeRequestSlice = createSlice({
  name: 'activeRequest',
  initialState,
  reducers: {
    RESET_ACTIVE_REQUEST: (state) => {
      state.value = initialState.value;
      state.status = initialState.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newRequest.fulfilled, (state, action) => {
        state.value.request = action.payload as Request;
      })
      .addCase(getRequest.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getRequest.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getRequest.fulfilled, (state, action) => {
        state.value.request = action.payload as Request;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getRequestQuestions.fulfilled, (state, action) => {
        state.value.requestQuestions = action.payload;
      })
      .addCase(editRequest.fulfilled, (state, action) => {
        state.value.request = action.payload;
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(editRequest.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(createRequestQuestions.fulfilled, (state, action) => {
        state.value.requestQuestions = [
          ...state.value.requestQuestions,
          action.payload,
        ];
      })
      .addCase(deleteRequestQuestions.fulfilled, (state, action) => {
        state.value.requestQuestions = state.value.requestQuestions.filter(
          (question) => question.id !== action.payload.id
        );
      })
      .addCase(updateRequestQuestions.fulfilled, (state, action) => {
        state.value.requestQuestions = state.value.requestQuestions.map(
          (question) =>
            question.id === action.payload.id ? action.payload : question
        );
      })
      .addCase(updateOwners.fulfilled, (state, action) => {
        state.value.request = action.payload;
      })
      .addCase(linkProjectsToRequest.fulfilled, (state, action) => {
        state.value.request = {
          ...state.value.request,
          requestProjects: [...action.payload.projects],
        };
      });
  },
});

/* ================================ ACTIONS ================================= */
export const { RESET_ACTIVE_REQUEST: resetActiveRequest } =
  activeRequestSlice.actions;

/* =============================== SELECTORS ================================ */
export const selectActiveRequestSliceStatus = (state: RootState) =>
  state.activeRequest.status;

export const selectActiveRequest = (state: RootState) =>
  state.activeRequest.value.request;

export const selectActiveRequestQuestions = (state: RootState) =>
  state.activeRequest.value.requestQuestions;

export const selectActiveRequestId = createSelector(
  [selectActiveRequest],
  (request) => request.id
);

export const selectActiveRequestForm = createSelector(
  [selectActiveRequest, selectFormsOptions],
  (request, forms) => {
    if (request.data?.baseFormId) {
      const form = forms.find(
        (form) => form.value === request.data?.baseFormId
      );
      if (form !== undefined) {
        return { label: form.label, value: form.value };
      }
    }
    return { label: '', value: '' };
  }
);

export const selectActiveRequestType = createSelector(
  [selectActiveRequest],
  (request) => request.request_type
);

export const selectIsActiveRequestAForm = createSelector(
  [selectActiveRequest],
  (request) => request.type === QUESTIONNAIRE_TYPE.FORM
);

export default activeRequestSlice.reducer;
