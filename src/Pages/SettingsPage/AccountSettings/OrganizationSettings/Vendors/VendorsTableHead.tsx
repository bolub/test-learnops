import intl from 'react-intl-universal';

const VendorsTableHead = () => {
  const headCellsClassNames = 'py-3 font-semibold';

  return [
    {
      'data-cy': 'head_vendor-name',
      content: intl.get('VENDORS_PAGE.TABLE.HEAD.VENDOR_NAME'),
      className: headCellsClassNames,
    },
    {
      'data-cy': 'head_vendor-description',
      content: intl.get('VENDORS_PAGE.TABLE.HEAD.DESCRIPTION'),
      className: headCellsClassNames,
    },
    {
      'data-cy': 'head_vendor-country',
      content: intl.get('VENDORS_PAGE.TABLE.HEAD.COUNTRY'),
      className: headCellsClassNames,
    },
    {
      'data-cy': 'head_vendor-location',
      content: intl.get('VENDORS_PAGE.TABLE.HEAD.LOCATION'),
      className: headCellsClassNames,
    },
    {
      'data-cy': 'head_vendor-creation',
      content: intl.get('VENDORS_PAGE.TABLE.HEAD.CREATION_DATE'),
      className: headCellsClassNames,
    },
    {
      'data-cy': 'head_vendor-enabled',
      content: intl.get('VENDORS_PAGE.TABLE.HEAD.ENABLED'),
      className: headCellsClassNames,
    },
  ];
};

export default VendorsTableHead;
