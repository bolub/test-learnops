import {
  createAsyncThunk,
  createSlice,
  createSelector,
  createAction,
} from '@reduxjs/toolkit';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { RootState } from 'state/store';
import { Form, FormOption, Status, SortingOrderType } from 'utils/customTypes';
import { SLICE_STATUS } from 'utils/constants';
import { selectLDUsers } from 'state/UsersManagement/usersManagementSlice';
import FormAPI from './formAPI';

interface Forms {
  forms: Form[];
  form: Form;
  pagination: {
    limit: number;
    offset: number;
  };
  sorting: SortingOrderType;
  searchParam: string;
  status: Status;
}

const formAPI = FormAPI;

/* ============================= INITIAL STATE ============================== */
const initialState: Forms = {
  forms: [],
  form: {},
  pagination: {
    limit: 15,
    offset: 0,
  },
  sorting: {
    order: 'asc',
    orderBy: '',
  },
  searchParam: '',
  status: SLICE_STATUS.IDLE,
};

/* ============================== REDUX THUNK =============================== */
export const getForm = createAsyncThunk(
  'forms/GET_FORM',
  async (formId: string) => {
    const response = await formAPI.fetchForm(formId);
    return response.data;
  }
);

export const getForms = createAsyncThunk(
  'forms/GET_FORMS',
  async (params: { organizationId: string; published?: boolean }) => {
    const { data } = await formAPI.fetchOrganizationForms(params);
    return data;
  }
);

/* ================================ ACTIONS ================================= */
export const setPagination = createAction<{
  limit: number;
  offset: number;
}>('forms/SET_PAGINATION');

export const setSearchParam = createAction<string>('forms/SET_SEARCH_PARAM');

export const setSorting = createAction<SortingOrderType>('forms/SET_ORDERS');

/* ================================= REDUCER ================================ */
const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getForms.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getForms.fulfilled, (state, action) => {
        state.forms = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getForms.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(getForm.pending, (state) => {
        state.status = SLICE_STATUS.LOADING;
      })
      .addCase(getForm.fulfilled, (state, action) => {
        state.form = action.payload;
        state.status = SLICE_STATUS.IDLE;
      })
      .addCase(getForm.rejected, (state) => {
        state.status = SLICE_STATUS.FAILED;
      })
      .addCase(setPagination, (state, action) => {
        state.pagination.limit = action.payload.limit;
        state.pagination.offset = action.payload.offset;
      })
      .addCase(setSearchParam, (state, action) => {
        state.searchParam = action.payload.toLocaleLowerCase().trim();
      })
      .addCase(setSorting, (state, action) => {
        state.sorting = action.payload;
      });
  },
});

/* =============================== SELECTORS ================================ */
export const selectForm = (state: RootState) => state.forms.form;
export const selectForms = (state: RootState) => state.forms.forms;
export const selectHasForms = (state: RootState) =>
  state.forms.forms.length > 0;
const selectFormsPagination = (state: RootState) => state.forms.pagination;
const selectSearchParam = (state: RootState) => state.forms.searchParam;
export const formsSorting = (state: RootState) => state.forms.sorting;
export const selectFormStatus = (state: RootState) => state.forms.status;

export const selectFormsOptions = createSelector([selectForms], (forms) => {
  return forms.map((form) => ({
    label: form.title,
    value: form.id,
  })) as FormOption[];
});

export const selectFormsForTable = createSelector(
  [
    selectForms,
    selectLDUsers,
    selectFormsPagination,
    selectSearchParam,
    formsSorting,
  ],
  (forms, users, pagination, searchParam, sorting) => {
    const rows = forms
      .filter((form) => {
        if (searchParam) {
          return get(form, 'title', false)
            ? form.title!.toLocaleLowerCase().includes(searchParam)
              ? true
              : false
            : false;
        } else {
          return true;
        }
      })
      .map((form) => {
        if (form.form_creator_id) {
          return {
            ...form,
            formCreator: users.find((user) => user.id === form.form_creator_id),
          };
        } else {
          return form;
        }
      });
    return {
      data: orderBy(
        rows.slice(pagination.offset, pagination.limit),
        [sorting.orderBy],
        [sorting.order]
      ),
      total: rows.length,
    };
  }
);

export default formsSlice.reducer;
