import React, { useEffect } from 'react';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Typography } from '@getsynapse/design-system';
import {
  fetchAllocationSummary,
  getResourceSummary,
} from 'state/Project/projectSlice';
import { ResourceSummaryItem } from 'utils/customTypes';
import HeadCell from 'Pages/ProjectsListPage/components/HeadCell';
import intl from 'react-intl-universal';

const ResourceSummary: React.FC<{ projectId: string }> = ({ projectId }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllocationSummary(projectId));
  }, [projectId, dispatch]);

  const summaryData = useSelector(getResourceSummary);

  return (
    <div className='w-full'>
      <div className='bg-neutral-white h-projectTabContent px-4 py-6 flex flex-col'>
        <Typography variant='h4'>
          {intl.get('PEOPLE.TABS.RESOURCE_SUMMARY')}
        </Typography>
        <Typography variant='caption' className='text-neutral pb-4'>
          {intl.get('PEOPLE.RESOURCE_SUMMARY.PAGE_SUB_TITLE')}
        </Typography>
        <div className='w-1/2 overflow-y-auto max-h-124 bg-neutral-lightest'>
          <Table
            className='w-full border-separate'
            data-cy='resource-summary-table'
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
                            'PEOPLE.RESOURCE_SUMMARY.PROJECT_ROLE_COLUMN'
                          )}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('w-2/5 sticky top-0 z-1'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__budget-allocated_budget'>
                        <React.Fragment>
                          {intl.get(
                            'PEOPLE.RESOURCE_SUMMARY.NO_OF_RESOURCE_COLUMN'
                          )}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('sticky top-0  z-10 z-10'),
                  },
                  {
                    content: (
                      <HeadCell testId='header__budget-cost_to_date'>
                        <React.Fragment>
                          {intl.get(
                            'PEOPLE.RESOURCE_SUMMARY.TOTAL_HOURS_COLUMN'
                          )}
                        </React.Fragment>
                      </HeadCell>
                    ),
                    className: classnames('sticky top-0 z-10 z-10'),
                  },
                ],
              },
              rows: [
                ...summaryData.items.map((summaryItem: ResourceSummaryItem) => {
                  return {
                    id: summaryItem.projectRole,
                    cells: [
                      { content: summaryItem.projectRole },
                      { content: summaryItem.numberOfResource },
                      { content: `${summaryItem.totalHours}h` },
                    ],
                  };
                }),
                {
                  id: 'summary-toal',
                  className:
                    'font-bold sticky bottom-0 hover:bg-neutral-white bg-neutral-white border-neutral-lightest',
                  cells: [
                    {
                      content: intl.get('PEOPLE.RESOURCE_SUMMARY.TOTAL'),
                      className:
                        'border-neutral-lightest border-l-2 border-b-2 border-t-2',
                    },
                    {
                      content: (
                        <div data-cy='resource-summary-total-resource'>
                          {summaryData.total.totalNumberOfResource}
                        </div>
                      ),
                      className:
                        'border-neutral-lightest border-b-2 border-t-2',
                    },
                    {
                      content: (
                        <div data-cy='resource-summary-total-hours'>
                          {summaryData.total.totalHours}h
                        </div>
                      ),
                      className:
                        'border-neutral-lightest border-r-2 border-b-2 border-t-2',
                    },
                  ],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceSummary;
