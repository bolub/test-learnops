import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Typography,
  TextField,
  FormItem,
  Tooltip,
  Icon,
} from '@getsynapse/design-system';
import HeadCell from 'Pages/ProjectsListPage/components/HeadCell';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import {
  BUDGET_DETAILS_FIELDS,
  PROJECT_PARTICIPANT_TYPE,
} from 'utils/constants';
import { BudgetDetail } from 'utils/customTypes';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNewBudget,
  updateBudget,
  fetchBudgetCategoriesAndBudgets,
  selectProjectBudgetCategories,
} from 'state/Budget/budgetSlice';
import {
  getCurrentProjectData,
  getCurrentUserParticipantType,
} from 'state/Project/projectSlice';
import { budgetDetailsValues } from 'Pages/ProjectPage/helpers/types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const BudgetDetails = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams<{ projectId: string }>();
  const projectData = useSelector(getCurrentProjectData);
  const participantType = useSelector(getCurrentUserParticipantType);
  const isUserProjectOwner = participantType === PROJECT_PARTICIPANT_TYPE.OWNER;
  const [totalCostToDate, setTotalCostToDate] = useState(0);
  const [totalAllocatedBudget, setAllocatedBudget] = useState(0);
  const [budgetPlan, setBudgetPlan] = useState(0);
  const [renderInput, setRenderInput] = useState(false);
  const [canEditBudget, setCanEditBudget] = useState(false);
  const budgetCategoryData = useSelector(selectProjectBudgetCategories);
  const [updatedBudgetsList, setUpdatedBudgetsList] =
    useState<BudgetDetail[]>(budgetCategoryData);

  useEffect(() => {
    dispatch(fetchBudgetCategoriesAndBudgets(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    setUpdatedBudgetsList(budgetCategoryData);
  }, [budgetCategoryData]);

  useEffect(() => {
    let costToDate = 0;
    let calculateAllocatedBudget = 0;
    updatedBudgetsList.forEach((item) => {
      let cost_to_date = Number(
        get(item, 'categoryBudgets[0].cost_to_date', 0)
      );
      let allocated_budget = Number(
        get(item, 'categoryBudgets[0].allocated_budget', 0)
      );
      costToDate += cost_to_date;
      calculateAllocatedBudget += allocated_budget;
    });

    setTotalCostToDate(costToDate);
    setAllocatedBudget(calculateAllocatedBudget);
    setBudgetPlan(Number(projectData.allocated_budget));
  }, [updatedBudgetsList, projectData.allocated_budget]);

  const totalStub = [
    {
      id: 1,
      category: 'Total',
      allocated_budget: totalAllocatedBudget,
      cost_to_date: totalCostToDate,
    },
  ];

  const [budgetData, setBudgetData] =
    useState<BudgetDetail>(budgetDetailsValues);

  const handleChangeElement = (data: any) => {
    setRenderInput(true);
    setBudgetData(data);
  };

  const [fieldsValues, setFieldsValues] = useState({
    allocated_budget: 0,
    cost_to_date: 0,
    notes: '',
    project_id: projectId,
  });

  const updateValue = (newValue: any) => {
    setFieldsValues((prevData) => ({ ...prevData, ...newValue }));
  };

  useEffect(() => {
    if (renderInput && canEditBudget === false) {
      setCanEditBudget(true);
    }
  }, [renderInput, canEditBudget]);

  const changeButtonText = (data: BudgetDetail) => {
    return intl.get('BUDGET.BUDGET_DETAILS_TABLE.EDIT');
  };

  const handleCancel = () => {
    setRenderInput(false);
    setCanEditBudget(false);
  };

  const handleSave = async (data: BudgetDetail) => {
    let budgetData = { ...fieldsValues };
    const budgetId = get(data, 'categoryBudgets[0].id');

    if (get(data, 'categoryBudgets[0]')) {
      const { notes, cost_to_date, allocated_budget } = budgetData;
      await dispatch(
        updateBudget({
          budgetId,
          data: {
            notes: isEmpty(notes)
              ? get(data, 'categoryBudgets[0].notes')
              : notes,
            cost_to_date: isEmpty(cost_to_date)
              ? get(data, 'categoryBudgets[0].cost_to_date')
              : cost_to_date,
            allocated_budget: isEmpty(allocated_budget)
              ? get(data, 'categoryBudgets[0].allocated_budget')
              : allocated_budget,
            budgetId: budgetId,
            category_currency: data?.currency,
            category_name: data?.name,
          },
        })
      );
    } else {
      await dispatch(
        createNewBudget({
          ...budgetData,
          category_id: data?.id,
          category_currency: data?.currency,
          category_name: data?.name,
        })
      );
    }
    await dispatch(fetchBudgetCategoriesAndBudgets(projectId));
    setFieldsValues({
      allocated_budget: 0,
      cost_to_date: 0,
      notes: '',
      project_id: projectId,
    });
    setRenderInput(false);
    setCanEditBudget(false);
  };

  return (
    <div className='w-full h-full'>
      <div className='bg-neutral-white h-projectTabContent px-4 py-6 flex flex-col'>
        <Typography variant='h4'>
          {intl.get('BUDGET.BUDGET_DETAILS_TABLE.TITLE')}
        </Typography>
        <Typography variant='caption' className='text-neutral pb-4'>
          {intl.get('BUDGET.BUDGET_DETAILS_TABLE.SUBTITLE')}
        </Typography>
        <div className='w-full overflow-y-auto max-h-124 bg-neutral-lightest'>
          <Table
            className='w-full border-separate'
            style={{ borderSpacing: 0 }}
            canSelectRows={false}
            data={{
              headData: {
                headCells: [
                  {
                    content: (
                      <HeadCell testId='header__budget-category'>
                        <React.Fragment>
                          {intl.get(
                            'BUDGET.BUDGET_DETAILS_TABLE.HEAD.CATEGORY'
                          )}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames(
                      'bg-neutral-white w-1/4 sticky top-0 z-1'
                    ),
                  },
                  {
                    content: (
                      <HeadCell testId='header__budget-allocated_budget'>
                        <React.Fragment>
                          {intl.get(
                            'BUDGET.BUDGET_DETAILS_TABLE.HEAD.ALLOCATED_BUDGET'
                          )}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames(
                      'bg-neutral-white w-50 sticky top-0  z-10 z-10'
                    ),
                  },
                  {
                    content: (
                      <HeadCell testId='header__budget-cost_to_date'>
                        <React.Fragment>
                          {intl.get(
                            'BUDGET.BUDGET_DETAILS_TABLE.HEAD.COST_TO_DATE'
                          )}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames(
                      'bg-neutral-white w-50 sticky top-0 z-10 z-10'
                    ),
                  },
                  {
                    content: (
                      <HeadCell testId='header__budget-notes'>
                        <React.Fragment>
                          {intl.get('BUDGET.BUDGET_DETAILS_TABLE.HEAD.NOTES')}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames(
                      'bg-neutral-white sticky top-0 z-10 z-10'
                    ),
                  },
                  {
                    content: <div></div>,
                    className: classnames('bg-neutral-white sticky top-0'),
                  },
                ],
              },

              rows: [
                ...updatedBudgetsList.map((data: BudgetDetail, index) => {
                  return {
                    'data-cy': `budget-details-${data.id}`,
                    id: data.id,
                    className: 'cursor-pointer',
                    cells: [
                      {
                        content: data.name,
                        className: 'capitalize',
                      },
                      {
                        content:
                          data.id === budgetData.id && renderInput === true ? (
                            <FormItem component='div' className='pb-px'>
                              <div className='flex items-center'>
                                <span className='pr-2'>
                                  {intl.get(
                                    'BUDGET.BUDGET_DETAILS_TABLE.DOLLAR_SIGN'
                                  )}
                                </span>
                                <TextField
                                  divProps={{ className: 'w-30' }}
                                  type='number'
                                  height='small'
                                  inputClassName='no-spinner'
                                  defaultValue={
                                    get(
                                      data,
                                      'categoryBudgets[0].allocated_budget',
                                      ''
                                    ) === ''
                                      ? fieldsValues.allocated_budget
                                      : get(
                                          data,
                                          'categoryBudgets[0].allocated_budget'
                                        )
                                  }
                                  onChange={(e: any) =>
                                    updateValue({
                                      [BUDGET_DETAILS_FIELDS.ALLOCATED_BUDGET]:
                                        e.target.value,
                                    })
                                  }
                                  data-cy={`allocated_budget-input-${data.id}`}
                                />
                                <span className='pl-1'>
                                  {intl.get('BUDGET.BUDGET_DETAILS_TABLE.USD')}
                                </span>
                              </div>
                            </FormItem>
                          ) : (
                            <div>
                              {' '}
                              {intl.get(
                                'BUDGET.BUDGET_DETAILS_TABLE.DOLLAR_SIGN'
                              )}
                              {get(
                                data,
                                'categoryBudgets[0].allocated_budget',
                                ''
                              ) === ''
                                ? 0
                                : get(
                                    data,
                                    'categoryBudgets[0].allocated_budget'
                                  )}{' '}
                              {intl.get('BUDGET.BUDGET_DETAILS_TABLE.USD')}
                            </div>
                          ),
                      },
                      {
                        content:
                          data.id === budgetData.id && renderInput === true ? (
                            <FormItem component='div' className='pb-px'>
                              <div className='flex items-center'>
                                <span className='pr-2'>
                                  {intl.get(
                                    'BUDGET.BUDGET_DETAILS_TABLE.DOLLAR_SIGN'
                                  )}
                                </span>
                                <TextField
                                  divProps={{ className: 'w-30' }}
                                  type='number'
                                  height='small'
                                  inputClassName='no-spinner'
                                  defaultValue={
                                    get(
                                      data,
                                      'categoryBudgets[0].cost_to_date',
                                      ''
                                    ) === ''
                                      ? fieldsValues.cost_to_date
                                      : get(
                                          data,
                                          'categoryBudgets[0].cost_to_date'
                                        )
                                  }
                                  onChange={(e: any) =>
                                    updateValue({
                                      [BUDGET_DETAILS_FIELDS.COST_TO_DATE]:
                                        e.target.value,
                                    })
                                  }
                                  data-cy={`cost_to_date-input-${data.id}`}
                                />
                                <span className='pl-1'>
                                  {intl.get('BUDGET.BUDGET_DETAILS_TABLE.USD')}
                                </span>
                              </div>
                            </FormItem>
                          ) : (
                            <div>
                              {' '}
                              {intl.get(
                                'BUDGET.BUDGET_DETAILS_TABLE.DOLLAR_SIGN'
                              )}
                              {get(
                                data,
                                'categoryBudgets[0].cost_to_date',
                                ''
                              ) === ''
                                ? 0
                                : get(
                                    data,
                                    'categoryBudgets[0].cost_to_date'
                                  )}{' '}
                              {intl.get('BUDGET.BUDGET_DETAILS_TABLE.USD')}
                            </div>
                          ),
                      },

                      {
                        content:
                          data.id === budgetData.id && renderInput === true ? (
                            <FormItem>
                              <TextField
                                height='small'
                                defaultValue={
                                  get(data, 'categoryBudgets[0].notes', '') ===
                                  ''
                                    ? fieldsValues.notes
                                    : get(data, 'categoryBudgets[0].notes')
                                }
                                onChange={(e: any) =>
                                  updateValue({
                                    [BUDGET_DETAILS_FIELDS.NOTES]:
                                      e.target.value,
                                  })
                                }
                                className='w-full'
                                data-cy={`notes-input-${data.id}`}
                              />
                            </FormItem>
                          ) : `${get(data, 'categoryBudgets[0].notes')}`
                              .length < 75 ? (
                            <span>{get(data, 'categoryBudgets[0].notes')}</span>
                          ) : (
                            <Tooltip
                              trigger={
                                <p
                                  style={{
                                    width: '450px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {get(data, 'categoryBudgets[0].notes')}
                                </p>
                              }
                              openMode='hover2'
                              timeout={1}
                              ariaId='budget-notes-info'
                              position={
                                index === 0 || index === 1
                                  ? 'bottomLeft'
                                  : 'topCenter'
                              }
                              contentProps={{
                                className: classnames(
                                  'bg-neutral-darker',
                                  'rounded px-4 py-3.5',
                                  'w-max absolute',
                                  'font-normal'
                                ),
                              }}
                            >
                              <span>
                                {get(data, 'categoryBudgets[0].notes')}
                              </span>
                            </Tooltip>
                          ),
                      },
                      {
                        content:
                          renderInput === true && data.id === budgetData.id ? (
                            <div className='flex float-right mr-2'>
                              <Button
                                onClick={() => handleSave(data)}
                                variant='tertiary'
                                size='small'
                                className='hover:bg-neutral-lightest'
                                data-cy={`save-budget-details-button-${data.id}`}
                              >
                                {intl.get('BUDGET.BUDGET_DETAILS_TABLE.SAVE')}
                              </Button>
                              <Button
                                onClick={() => handleCancel()}
                                variant='tertiary'
                                size='small'
                                className='hover:bg-neutral-lightest'
                                data-cy={`cancel-budget-details-button-${data.id}`}
                              >
                                {intl.get('BUDGET.BUDGET_DETAILS_TABLE.CANCEL')}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleChangeElement(data)}
                              variant='tertiary'
                              size='small'
                              disabled={!isUserProjectOwner || canEditBudget}
                              className='hover:bg-neutral-lightest float-right mr-2'
                              data-cy={`edit-budget-details-button-${data.id}`}
                            >
                              {changeButtonText(data)}
                            </Button>
                          ),
                      },
                    ],
                  };
                }),
                ...totalStub.map((item) => {
                  return {
                    id: item.id,
                    className:
                      'sticky bottom-0 hover:bg-neutral-white bg-neutral-white',

                    cells: [
                      {
                        content: item.category,
                        className:
                          'font-bold border-b-2 border-neutral-lightest border-l-2 border-t-2',
                      },
                      {
                        content:
                          item.allocated_budget > budgetPlan ? (
                            <div className='flex items-center'>
                              <Typography
                                variant='body2'
                                className='text-warning-dark font-bold bg-warning-lighter flex'
                              >
                                {intl.get(
                                  'BUDGET.BUDGET_DETAILS_TABLE.DOLLAR_SIGN'
                                )}
                                {item.allocated_budget}{' '}
                                {intl.get('BUDGET.BUDGET_DETAILS_TABLE.USD')}
                              </Typography>
                              <Tooltip
                                className='pl-8 flex'
                                data-cy={`budget-exceeded-tooltip-${item.id}`}
                                trigger={
                                  <Icon
                                    name='information-circle'
                                    className='text-2xl text-warning-dark'
                                  />
                                }
                                openMode='hover1'
                                ariaId='budget-exceeded'
                                position='topCenter'
                                contentProps={{
                                  className: classnames(
                                    'bg-warning-lighter',
                                    'text-warning-dark',
                                    'rounded px-4 py-3.5',
                                    'w-max absolute',
                                    'font-normal'
                                  ),
                                }}
                              >
                                <span>
                                  {intl.get(
                                    'BUDGET.BUDGET_DETAILS_TABLE.BUDGET_EXCEEDED'
                                  )}
                                </span>
                              </Tooltip>
                            </div>
                          ) : (
                            <span className='font-bold'>
                              {intl.get(
                                'BUDGET.BUDGET_DETAILS_TABLE.DOLLAR_SIGN'
                              )}
                              {item.allocated_budget}{' '}
                              {intl.get('BUDGET.BUDGET_DETAILS_TABLE.USD')}
                            </span>
                          ),
                        className:
                          'border-neutral-lightest border-b-2 border-t-2',
                      },
                      {
                        content: (
                          <div className='font-bold'>
                            {intl.get(
                              'BUDGET.BUDGET_DETAILS_TABLE.DOLLAR_SIGN'
                            )}
                            {item.cost_to_date}{' '}
                            {intl.get('BUDGET.BUDGET_DETAILS_TABLE.USD')}
                          </div>
                        ),
                        className:
                          'border-neutral-lightest border-b-2 border-t-2',
                      },
                      {
                        content: <div></div>,
                        className:
                          'border-neutral-lightest border-b-2 border-t-2',
                      },
                      {
                        content: <div></div>,
                        className:
                          'border-neutral-lightest border-r-2 border-b-2 border-t-2',
                      },
                    ],
                  };
                }),
              ],
            }}
            data-cy='budget-details-table'
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetails;
