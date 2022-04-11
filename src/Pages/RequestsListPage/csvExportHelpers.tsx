import intl from 'react-intl-universal';
import { get } from 'lodash';
import moment from 'moment';
import { DATE } from 'utils/constants';
import { isNotEmptyArray } from '../helpers';
import { formatRequestIdentifier } from 'Pages/helpers';

const generateCsvHeaders = (isLdUser: boolean) => {
  let csvHeaders = [
    intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUEST_NO'),
    intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUESTER_NAME'),
    intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUEST_TITLE'),
    intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.SUBMISSION_DATE'),
    intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.STATUS'),
  ];
  if (isLdUser) {
    csvHeaders.splice(
      1,
      0,
      intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.OWNER_NAME')
    );
    csvHeaders.splice(
      4,
      0,
      intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.BUSINESS_UNIT')
    );
    csvHeaders.splice(
      csvHeaders.length,
      0,
      intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.PRIORITY')
    );
  }
  if (!isLdUser) {
    csvHeaders.splice(
      4,
      0,
      intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.UPDATE_DATE')
    );
  }
  return csvHeaders;
};

const generateCsvData = (requests: any[], isLdUser: boolean) => {
  const csvArray = requests.map((request) => {
    const reqIdentifierObj = {
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUEST_NO')]:
        formatRequestIdentifier(get(request, 'requestIdentifier')!),
    };
    const businessUserObj = {
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUESTER_NAME')]:
        request.requester &&
        request.requester.data.firstName +
          ' ' +
          request.requester.data.lastName,
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.REQUEST_TITLE')]: get(
        request,
        'title',
        ''
      ),
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.SUBMISSION_DATE')]: get(
        request,
        'submittedAt',
        ''
      ),
    };
    const updatedDateObj = {
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.UPDATE_DATE')]: get(
        request,
        'updatedAt',
        ''
      ),
    };
    const statusObj = {
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.STATUS')]: get(
        request,
        'status',
        ''
      ),
    };
    const priorityObj = {
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.PRIORITY')]: intl.get(
        `REQUEST_PAGE.L_D_SECTION.PRIORITY_OPTIONS.${get(
          request,
          'ldPriority',
          'unassigned'
        )}`
      ),
    };
    const businessUnitObj = {
      [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.BUSINESS_UNIT')]: get(
        request,
        'businessTeam.title',
        ''
      ),
    };
    const reqOwners = get(request, 'owners', []);
    let reqOwnerObj = {};
    if (isNotEmptyArray(reqOwners)) {
      const ownersList = reqOwners.reduce(
        (
          res: any,
          owner: { data: { firstName: any; lastName: any } },
          currentIndex: number
        ) => {
          let result = `${owner.data.firstName} ${owner.data.lastName}`;
          res =
            reqOwners.length - 1 !== currentIndex
              ? res.concat(result).concat(', ')
              : res.concat(result);
          return res;
        },
        ''
      );
      reqOwnerObj = {
        [intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.OWNER_NAME')]: ownersList,
      };
    }
    return isLdUser
      ? {
          ...reqIdentifierObj,
          ...reqOwnerObj,
          ...businessUserObj,
          ...businessUnitObj,
          ...statusObj,
          ...priorityObj,
        }
      : {
          ...reqIdentifierObj,
          ...businessUserObj,
          ...updatedDateObj,
          ...statusObj,
        };
  });
  return csvArray;
};

const getFileName = () =>
  `requests_${moment(new Date()).format(DATE.EXPORT_CSV_FORMAT)}.csv`;

const csvExportHelpers = { generateCsvHeaders, generateCsvData, getFileName };
export default csvExportHelpers;
