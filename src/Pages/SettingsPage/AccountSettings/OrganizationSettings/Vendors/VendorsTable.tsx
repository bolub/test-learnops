import { ProjectVendor } from 'utils/customTypes';
import { Table, Typography } from '@getsynapse/design-system';
import { useHistory, Link } from 'react-router-dom';
import VendorsTableHead from './VendorsTableHead';
import intl from 'react-intl-universal';
import moment from 'moment';
import { DATE, PATHS } from 'utils/constants';
import get from 'lodash/get';

type VendorsTableProps = {
  data: ProjectVendor[];
};

const VendorsTable = ({ data }: VendorsTableProps) => {
  const history = useHistory();

  return (
    <Table
      className='w-full'
      canSelectRows={false}
      emptyComponent={
        <Typography
          variant='body2'
          className='flex justify-center items-center h-12 text-neutral'
        >
          {intl.get('VENDORS_PAGE.TABLE.EMPTY_STATE')}
        </Typography>
      }
      data={{
        headData: {
          headCells: VendorsTableHead(),
        },
        rows: data.map((vendor) => {
          return {
            id: vendor.id,
            'data-cy': `vendor_row-${vendor.id}`,
            className: 'cursor-pointer',
            onClick: (event: any) => {
              event.preventDefault();
              event.stopPropagation();
              history.push(`${PATHS.VENDOR_PAGE}/${vendor.id}`);
            },
            cells: [
              {
                content: (
                  <Link to={`${PATHS.VENDOR_PAGE}/${vendor.id}`}>
                    {vendor.vendorName}
                  </Link>
                ),
                className: 'leading-4',
              },
              {
                content: vendor.description,
                className: 'leading-4',
              },
              {
                content: intl.get(
                  `COUNTRIES.${vendor.country_iso_3166_1_alpha_2_code}`
                ),
                className: 'leading-4',
              },
              {
                content: get(
                  vendor,
                  'data.province',
                  intl.get('VENDORS_PAGE.TABLE.NOT_ASSIGNED')
                ),
                className: 'leading-4',
              },
              {
                content:
                  vendor.createdAt &&
                  moment(new Date(vendor.createdAt)).format(DATE.SHORT_FORMAT),
                className: 'leading-4',
              },
              {
                content: (
                  <Typography variant='body2'>
                    {get(vendor, 'enabled')
                      ? intl.get('VENDORS_PAGE.TABLE.HEAD.ENABLED')
                      : intl.get('TASKS.TABLE.HEAD.DISABLED')}
                  </Typography>
                ),
              },
            ],
          };
        }),
      }}
    />
  );
};

export default VendorsTable;
