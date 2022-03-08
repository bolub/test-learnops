import { BudgetPlanType, ResourcePlanType } from 'utils/customTypes';

export const budgetPlanFields: BudgetPlanType = {
  estimated_cost: '',
  budget_source: '',
  allocated_budget: '',
};

export const ResourcePlanFields: ResourcePlanType = {
  resourcing_type: '',
  vendors: [],
};

export const budgetDetailsValues = {
  id: '',
  category_id: '',
  project_id: '',
  category_name: '',
  organization_id: '',
  category_currency: '',
  allocated_budget: 0,
  cost_to_date: 0,
  notes: '',
  createdAt: '',
};
