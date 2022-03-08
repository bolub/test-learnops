import { useState, useEffect, useMemo } from 'react';
import { Dropdown, Typography, useElevation } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import range from 'lodash/range';
import PageSlider from 'Molecules/PageSlider';

type PaginationProps = {
  total: number;
  onChange: (params: object) => void;
  className?: string;
};

type PageSizeType = 5 | 10 | 15 | 20 | 25;

type PageSizeOption = { value: PageSizeType; label: string };

type PageSliderOption = { value: number; label: string };

const pageSizeOptions: PageSizeOption[] = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 25, label: '25' },
];

const Pagination = ({ total, onChange, className }: PaginationProps) => {
  const skim = useElevation(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>({
    value: 15,
    label: '15',
  });
  const [currentPage, setCurrentPage] = useState<PageSliderOption>({
    value: 1,
    label: '1',
  });

  useEffect(() => {
    onChange({
      limit: pageSize.value * currentPage.value,
      offset: pageSize.value * (currentPage.value - 1),
    });
  }, [currentPage, onChange, pageSize]);

  const pageCount = useMemo<number>(
    () => Math.ceil(total / pageSize.value),
    [pageSize, total]
  );

  const pageSliderOptions = useMemo<PageSliderOption[]>(
    () =>
      range(0, pageCount).map((page) => ({
        value: page + 1,
        label: `${page + 1}`,
      })),
    [pageCount]
  );

  const handleChangePageSize = (option: PageSizeOption) => {
    setCurrentPage({
      value: 1,
      label: '1',
    });
    setPageSize(option);
  };

  return (
    <div
      className={classnames(
        'absolute bottom-0 left-0 py-2',
        'pl-14 pr-4 bg-neutral-white w-full',
        'flex items-center justify-end',
        skim,
        className
      )}
    >
      <Typography variant='body' data-cy={`total_results-${total}`}>
        {intl.get('PAGINATION.RESULTS', { total })}
      </Typography>
      <Typography variant='body' weight='medium' className='ml-4 mr-2'>
        {intl.get('PAGINATION.SHOW')}
      </Typography>
      <Dropdown
        options={pageSizeOptions}
        values={[pageSize]}
        onChange={handleChangePageSize}
        triggerProps={{ size: 'sm' }}
      />

      <PageSlider
        total={total}
        pages={pageCount}
        offset={currentPage.value}
        limit={pageSize.value}
        setOffset={(value: number) =>
          setCurrentPage({ value, label: `${value}` })
        }
      />

      <Typography variant='body' weight='medium' className='mr-2'>
        {intl.get('PAGINATION.JUMP_TO_PAGE')}
      </Typography>
      <Dropdown
        options={pageSliderOptions}
        values={[currentPage]}
        onChange={(option: PageSliderOption) => setCurrentPage(option)}
        triggerProps={{ size: 'sm' }}
      />
    </div>
  );
};

export default Pagination;
