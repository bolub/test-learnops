import React, { Dispatch, SetStateAction, useMemo } from 'react';
import intl from 'react-intl-universal';
import {
  Typography,
  FormItem,
  NumericInput,
  Dropdown,
} from '@getsynapse/design-system';
import {
  NEW_PROJECT_FORM_FIELDS,
  PROJECT_BUDGET_SOURCE,
} from 'utils/constants';
import { NewProject } from 'utils/customTypes';

type BudgetDetailsProps = {
  data: NewProject;
  setData: Dispatch<SetStateAction<NewProject>>;
};

type Option = {
  label: string;
  value: any;
};

const BudgetDetails: React.FC<BudgetDetailsProps> = ({ data, setData }) => {
  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    setData((prevData) => ({ ...prevData, [fieldName]: fieldValue }));
  };

  const budgetSourceOptions = useMemo(
    () =>
      Object.keys(PROJECT_BUDGET_SOURCE).map((key) => ({
        label: intl.get(`PROJECT_DETAIL.BUDGET_SOURCE_OPTIONS.${key}`),
        value: PROJECT_BUDGET_SOURCE[key],
      })),
    []
  );

  return (
    <div className='mt-8'>
      <Typography variant='h5'>
        {intl.get('PROJECT_DETAIL.BUDGET_INFORMATION_TITLE')}
      </Typography>
      <Typography variant='caption'>
        {intl.get('PROJECT_DETAIL.BUDGET_INFORMATION_SUBTITLE')}
      </Typography>
      <div className='grid gap-y-6 gap-x-10% grid-cols-2 mt-8'>
        <FormItem label={intl.get('PROJECT_DETAIL.BUDGET_SOURCE')}>
          <Dropdown
            placeholder={intl.get('PROJECT_DETAIL.BUDGET_SOURCE_PLACEHOLDER')}
            onChange={(option: Option) =>
              handleFieldChange(
                NEW_PROJECT_FORM_FIELDS.BUDGET_SOURCE,
                option.value
              )
            }
            options={budgetSourceOptions}
            triggerProps={{ 'data-cy': 'project-budget-source' }}
          />
        </FormItem>
        <FormItem label={intl.get('PROJECT_DETAIL.ESTIMATED_COST')}>
          <div className='flex items-center w-full'>
            <span className='mr-2'>$</span>
            <NumericInput
              divProps={{ className: 'flex-1' }}
              placeholder='0'
              value={data.estimatedCost}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleFieldChange(
                  NEW_PROJECT_FORM_FIELDS.ESTIMATED_COST,
                  event.target.value
                )
              }
              data-cy='project-estimated-cost'
            />
            <span className='ml-2'>USD</span>
          </div>
        </FormItem>
        <FormItem label={intl.get('PROJECT_DETAIL.ALLOCATED_BUDGET')}>
          <div className='flex items-center w-full'>
            <span className='mr-2'>$</span>
            <NumericInput
              divProps={{ className: 'flex-1' }}
              placeholder='0'
              value={data.allocatedBudget}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleFieldChange(
                  NEW_PROJECT_FORM_FIELDS.ALLOCATED_BUDGET,
                  event.target.value
                )
              }
              data-cy='project-allocated-budget'
            />
            <span className='ml-2'>USD</span>
          </div>
        </FormItem>
      </div>
    </div>
  );
};

export default BudgetDetails;
