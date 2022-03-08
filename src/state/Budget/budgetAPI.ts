import { AxiosInstance } from 'axios';
import config from 'config/Config';
import { initAxios } from 'utils/axios';
import { NewBudget, BudgetCategory } from 'utils/customTypes';
class BudgetAPI {
  instance: AxiosInstance;
  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  fetchProjectBudgetCategories = async () => {
    const { data } = await this.instance.get('budgetCategory/');
    return data;
  };

  fetchProjectBudgets = async () => {
    const { data } = await this.instance.get('budget/');
    return data;
  };

  fetchSingleProjectBudgets = async (projectId: string) => {
    const { data } = await this.instance.get(
      `budgetCategory/projectBudgets/${projectId}`
    );
    return data;
  };

  createBudget = async (newBudgetData: NewBudget) => {
    const { data } = await this.instance.post('/budget', {
      ...newBudgetData,
    });
    return data;
  };

  updateBudget = async (budgetId: string, updateBudgetData: any) => {
    const { data } = await this.instance.put(`budget/${budgetId}`, {
      updateFields: { ...updateBudgetData },
    });
    return data;
  };

  createBudgetCategory = async (newBudgetData: BudgetCategory) => {
    const { data } = await this.instance.post('/budgetCategory', {
      ...newBudgetData,
    });
    return data;
  };
}

export default new BudgetAPI();
