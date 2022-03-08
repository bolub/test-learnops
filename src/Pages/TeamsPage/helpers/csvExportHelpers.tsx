import intl from 'react-intl-universal';
import get from 'lodash/get';
import moment from 'moment';
import { LearningTeam, Owner } from 'utils/customTypes';
import { DATE } from 'utils/constants';

const generateCsvHeaders = () => {
  let csvHeaders = [
    intl.get('TEAMS.TABLE.TEAM_MEMBERS'),
    intl.get('TEAMS.TABLE.JOB_TITLE'),
    intl.get('TEAMS.TABLE.EMPLOYMENT_TYPE'),
    intl.get('TEAMS.TABLE.COUNTRY'),
    intl.get('TEAMS.TABLE.HOURLY_RATE'),
  ];
  return csvHeaders;
};

const generateCsvData = (teamMembers: (string | LearningTeam | Owner)[]) => {
  const csvArray = teamMembers.map((element) => {
    return {
      [intl.get('TEAMS.TABLE.TEAM_MEMBERS')]: `${get(
        element,
        'data.firstName'
      )} ${get(element, 'data.lastName')} ${get(element, 'data.email')}`,
      [intl.get('TEAMS.TABLE.JOB_TITLE')]: get(element, 'data.jobTitle'),
      [intl.get('TEAMS.TABLE.EMPLOYMENT_TYPE')]: intl.get(
        `TEAMS.EMPLOYMENT_TYPE.${get(element, 'data.employmentType', 'NONE')}`
      ),
      [intl.get('TEAMS.TABLE.COUNTRY')]: intl.get(
        `COUNTRIES.${get(element, 'country_iso_3166_1_alpha_2_code', 'NONE')}`
      ),
      [intl.get('TEAMS.TABLE.HOURLY_RATE')]:
        get(element, 'data.rateHour') &&
        `${get(element, 'data.rateHour')} ${intl.get('TEAMS.CURRENCY')}`,
    };
  });
  return csvArray;
};

const getFileName = () =>
  `team_members_${moment(new Date()).format(DATE.EXPORT_CSV_FORMAT)}.csv`;

const csvExportHelpers = { generateCsvHeaders, generateCsvData, getFileName };
export default csvExportHelpers;
