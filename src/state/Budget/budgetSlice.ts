import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { selectOrganizationId } from 'state/User/userSlice';
import {
  BudgetDetail,
  Budget,
  NewBudget,
  BudgetCategory,
} from 'utils/customTypes';
import { RootState } from 'state/store';
import BudgetAPI from './budgetAPI';
import isEmpty from 'lodash/isEmpty';

interface BudgetState {
  budgetCategories: BudgetDetail[];
}

/* ============================= INITIAL STATE ============================== */
const initialState: BudgetState = {
  budgetCategories: [],
};

const budgetAPI = BudgetAPI;

/* ============================== REDUX THUNK =============================== */

export const fetchProjectBudgetCategories = createAsyncThunk(
  'budget/FETCH_PROJECT_CATEGORIES',
  async () => {
    const response = await budgetAPI.fetchProjectBudgetCategories();
    return response.data.budgetCategories;
  }
);

export const fetchProjectBudgets = createAsyncThunk(
  'budget/FETCH_PROJECT_BUDGETS',
  async () => {
    const response = await budgetAPI.fetchProjectBudgets();
    return response.data.budgets;
  }
);

export const fetchBudgetCategoriesAndBudgets = createAsyncThunk(
  'budget/FETCH_PROJECT_CATEGORY_WITH_BUDGETS',
  async (projectId: string) => {
    const response = await budgetAPI.fetchSingleProjectBudgets(projectId);
    return response.data.budgets;
  }
);

export const createNewBudget = createAsyncThunk(
  'budget/CREATE_BUDGET',
  async (newBudgetData: NewBudget, { getState }) => {
    const state = getState() as RootState;
    const organizationId = selectOrganizationId(state);
    const response = await budgetAPI.createBudget({
      ...newBudgetData,
      organization_id: organizationId,
    });
    return response.data.budget;
  }
);

export const updateBudget = createAsyncThunk(
  'budget/UPDATE_BUDGET',
  async (updateData: { budgetId: string; data: Budget | any }) => {
    let fieldsToUpdate = { ...updateData.data };

    let updatedBudget = fieldsToUpdate;
    if (!isEmpty(fieldsToUpdate)) {
      updatedBudget = await budgetAPI.updateBudget(
        updateData.budgetId,
        fieldsToUpdate
      );
    }
    return { ...updatedBudget };
  }
);

export const createNewBudgetCategory = createAsyncThunk(
  'budget/CREATE_BUDGET_CATEGORY',
  async (newBudgetCategoryData: BudgetCategory, { getState }) => {
    const state = getState() as RootState;
    const organizationId = selectOrganizationId(state);
    const response = await budgetAPI.createBudgetCategory({
      ...newBudgetCategoryData,
      organization_id: organizationId,
    });
    return response.data.budget;
  }
);

/* ================================= REDUCER ================================ */
const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewBudget.fulfilled, (state, action) => {
        state.budgetCategories = [...state.budgetCategories, action.payload];
      })
      .addCase(fetchBudgetCategoriesAndBudgets.fulfilled, (state, action) => {
        state.budgetCategories = [...action.payload];
      })
      .addCase(createNewBudgetCategory.fulfilled, (state, action) => {
        state.budgetCategories = [...state.budgetCategories, action.payload];
      });
  },
});

/* =============================== SELECTORS ================================ */
export const selectProjectBudgetCategories = (state: RootState) =>
  state.budgets.budgetCategories;

export default budgetSlice.reducer;
