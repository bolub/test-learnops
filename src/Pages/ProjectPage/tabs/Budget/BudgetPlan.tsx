import {
  Button,
  Dropdown,
  FormItem,
  NumericInput,
  Typography,
  useElevation,
} from '@getsynapse/design-system';
import classNames from 'classnames';
import useInlineNotification from 'Hooks/useInlineNotification';
import { isEqual } from 'lodash';
import { budgetPlanFields } from 'Pages/ProjectPage/helpers/types';
import { useEffect, useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  getCurrentProjectData,
  updateProject,
} from 'state/Project/projectSlice';
import {
  NEW_PROJECT_FORM_FIELDS,
  PATHS,
  PROJECT_BUDGET_SOURCE,
} from 'utils/constants';
import { BudgetPlanType, Option } from 'utils/customTypes';
import { getInitialValueForDropDown } from 'utils/functions';

const BudgetPlan = () => {
  const [disableSave, setDisableSave] = useState(true);

  const history = useHistory();
  const footerElevation = useElevation(1);

  const projectData = useSelector(getCurrentProjectData);
  const { projectId } = useParams<{ projectId: string }>();

  const [data, setData] = useState<BudgetPlanType>(budgetPlanFields);
  const [dataToCompare, setDataToCompare] = useState<BudgetPlanType>();

  useEffect(() => {
    setData({
      budget_source: projectData?.budget_source,
      allocated_budget: projectData?.allocated_budget,
      estimated_cost: projectData.estimated_cost,
    });

    setDataToCompare({
      budget_source: projectData?.budget_source,
      allocated_budget: projectData?.allocated_budget,
      estimated_cost: projectData.estimated_cost,
    });
  }, [projectData]);

  useEffect(() => {
    if (!isEqual(data, budgetPlanFields)) {
      const changesDetected = !isEqual(dataToCompare, data);
      if (changesDetected && disableSave) {
        setDisableSave(false);
      }
      if (!changesDetected && !disableSave) {
        setDisableSave(true);
      }
    }
  }, [data, disableSave, dataToCompare]);

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

  const handleCancel = () => {
    history.push(`${PATHS.PROJECT_PAGE}/${projectId}?tab=overview`);
  };

  const dispatch = useDispatch();
  const { showInlineNotification } = useInlineNotification();

  const updateBudgetPlanHandler = async () => {
    await dispatch(
      updateProject({
        projectId: projectId,
        data: {
          budget_source: data.budget_source,
          allocated_budget: data.allocated_budget,
          estimated_cost: data.estimated_cost,
        },
      })
    );

    showInlineNotification('success', intl.get('BUDGET.UPDATE_SUCCESS'));
  };

  return (
    <div className='py-4'>
      <div className='bg-neutral-white h-project overflow-y-auto px-6 py-6'>
        <Typography variant='h5'>{intl.get('BUDGET.BUDGET_PLAN')}</Typography>
        <Typography variant='caption' className='mb-4 text-neutral-light'>
          {intl.get('BUDGET.BUDGET_PLAN_DESCRIPTION')}
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
              values={getInitialValueForDropDown(
                budgetSourceOptions,
                data.budget_source
              )}
              triggerProps={{ 'data-cy': 'project-budget-source' }}
            />
          </FormItem>

          <FormItem label={intl.get('PROJECT_DETAIL.ESTIMATED_COST')}>
            <div className='flex items-center w-full'>
              <span className='mr-2'>$</span>
              <NumericInput
                divProps={{ className: 'flex-1' }}
                placeholder='0'
                value={data.estimated_cost}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(
                    NEW_PROJECT_FORM_FIELDS.ESTIMATED_COST,
                    event.target.value
                  )
                }
                data-cy='project-estimated-cost'
              />
              <span className='ml-2'>{intl.get('CURRENCY')}</span>
            </div>
          </FormItem>

          <FormItem label={intl.get('PROJECT_DETAIL.ALLOCATED_BUDGET')}>
            <div className='flex items-center w-full'>
              <span className='mr-2'>$</span>
              <NumericInput
                divProps={{ className: 'flex-1' }}
                placeholder='0'
                value={data.allocated_budget}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(
                    NEW_PROJECT_FORM_FIELDS.ALLOCATED_BUDGET,
                    event.target.value
                  )
                }
                data-cy='project-allocated-budget'
              />
              <span className='ml-2'>{intl.get('CURRENCY')}</span>
            </div>
          </FormItem>
        </div>
      </div>

      <div
        className={classNames(
          'w-full bg-neutral-white flex py-2 z-5 absolute bottom-0 left-0 ',
          footerElevation
        )}
      >
        <div className='flex ml-auto mr-12 gap-x-4 '>
          <Button
            variant='secondary'
            onClick={handleCancel}
            data-cy='budget-plan-cancel-button'
          >
            {intl.get('CANCEL')}
          </Button>

          <Button
            data-cy='budget-plan-save-button'
            disabled={disableSave}
            onClick={updateBudgetPlanHandler}
          >
            {intl.get('BUDGET.UPDATE_BUDGET_BUTTON')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlan;
