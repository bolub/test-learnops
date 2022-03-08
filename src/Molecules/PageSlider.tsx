import { IconButton } from '@getsynapse/design-system';
import classnames from 'classnames';
import usePagination from 'Hooks/usePagination';

type PageSliderProps = {
  total: number;
  pages: number;
  offset: number;
  limit: number;
  setOffset: (value: number) => void;
};

const PageSlider = ({
  total,
  pages,
  offset,
  limit,
  setOffset,
}: PageSliderProps) => {
  const paginationRange = usePagination({
    totalCount: total,
    currentPage: offset,
    pageSize: limit,
  });

  const handlePageChange = (isForward: boolean) => {
    if (isForward) {
      if (offset < pages) {
        setOffset(offset + 1);
      }
    } else {
      if (offset > 1) {
        setOffset(offset - 1);
      }
    }
  };

  return (
    <div className='flex justify-center mx-6'>
      <IconButton
        className='w-4 h-4'
        name='caret-back-outline'
        onClick={() => handlePageChange(false)}
        disabled={offset <= 1}
      />

      <div className='w-24 flex justify-center'>
        {paginationRange &&
          paginationRange.map((item, key) => (
            <span
              key={key}
              className={classnames('pr-1', {
                'text-primary font-bold': item === offset,
              })}
            >
              {item}
            </span>
          ))}
      </div>

      <IconButton
        className='w-4 h-4'
        name='caret-forward-outline'
        onClick={() => handlePageChange(true)}
        disabled={offset >= pages}
      />
    </div>
  );
};

export default PageSlider;
