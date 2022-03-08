import { useEffect } from 'react';
import { Typography } from '@getsynapse/design-system';
import VendorsTable from './VendorsTable';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { getVendors, selectVendors } from 'state/Vendors/vendorsSlice';
import NewVendorModal from 'Organisms/NewVendorModal/NewVendorModal';

const VendorsPage = () => {
  const dispatch = useDispatch();
  const vendors = useSelector(selectVendors);

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  return (
    <div className='px-4'>
      <div className='flex justify-between items-baseline'>
        <Typography variant='h5' className='py-4'>
          {intl.get('VENDORS_PAGE.TITLE')}
        </Typography>

        <NewVendorModal />
      </div>

      <VendorsTable data={vendors} />
    </div>
  );
};

export default VendorsPage;
