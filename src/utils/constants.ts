import { objKeyAsString } from 'utils/customTypes';

export const PATHS = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  CHANGE_PASSWORD: '/change-password',
  ROOT: '/',
  REQUEST_PAGE: '/request',
  SSO_AUTHENTICATION_PAGE: '/sso',
  SSO_AUTHENTICATION_CALLBACK: '/callback',
  REQUESTS_LIST_PAGE: '/requests-list',
  INSIGHTS: '/insights',
  DESIGN: '/design',
  TEAMS: '/teams',
  PROJECTS_LIST_PAGE: '/projects-list',
  NEW_PROJECT_PAGE: '/new-project',
  PROJECT_PAGE: '/project',
  SETTINGS: '/settings',
  EDIT_TEAM: '/settings/team',
  USER_PAGE: '/settings/user',
  VENDOR_PAGE: '/settings/vendor',
  FORMS_PAGE: '/forms',
};

export const FOOTER = {
  COPYRIGHT: `© ${new Date().getFullYear()} `,
  COMPANY_NAME: 'Get Synapse, Inc.',
  LINK: 'https://getsynapse.com/',
};

export const AUTH_CONSTANTS = {
  SCOPE: ['email', 'openid', 'aws.cognito.signin.user.admin'],
  RESPONSE_TYPE: 'code',
};

export const REQUEST_TYPE = [
  'TRAINING',
  'CONSULTING',
  'ASSESSMENT_EVALUATION',
  'EMPLOYEE_RESEARCH',
  'COACHING_MENTORING',
  'FACILITATION',
  'EVENTS',
  'OTHERS',
] as const;

export const DATE = {
  SHORT_FORMAT: 'MMM D, yyyy',
  EXPORT_CSV_FORMAT: 'YYYYMMDD',
  MONTH_DATE_YEAR_FORMAT: 'll',
  TASK_TABLE_FORMAT: 'MMM D, yyyy',
  FULL_MONTH_YEAR_FORMAT: 'LL',
  LONG_FORMAT: 'MMMM D, yyyy',
};

export const USER_TYPES = {
  BUSINESS: 'business',
  EXTERNAL: 'external',
  L_D: 'ld',
  ALL: 'bus_ld',
};

export const USER_TYPE_TEXT: objKeyAsString = {
  BUSINESS: 'Business User',
  LD: 'Learning User',
  EXTERNAL: 'External User',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const TABLE_FILTERS_OPERATORS = {
  CONTAINS: 'CONTAINS',
  DOESNT_CONTAIN: 'DOESNT_CONTAIN',
  EQUAL: 'EQUAL',
  NOT_EQUAL: 'NOT_EQUAL',
  GREATER: 'GREATER',
  GREATER_OR_EQUAL: 'GREATER_OR_EQUAL',
  LESS: 'LESS',
  LESS_OR_EQUAL: 'LESS_OR_EQUAL',
  BETWEEN: 'BETWEEN',
};

const DATE_COMPARATOR = [
  TABLE_FILTERS_OPERATORS.EQUAL,
  TABLE_FILTERS_OPERATORS.GREATER,
  TABLE_FILTERS_OPERATORS.GREATER_OR_EQUAL,
  TABLE_FILTERS_OPERATORS.LESS,
  TABLE_FILTERS_OPERATORS.LESS_OR_EQUAL,
  TABLE_FILTERS_OPERATORS.BETWEEN,
];

const STRING_COMPARATOR = [
  TABLE_FILTERS_OPERATORS.CONTAINS,
  TABLE_FILTERS_OPERATORS.DOESNT_CONTAIN,
];

export const COLUMN_OPTION_TYPES = {
  TEXT: 'text',
  OPTIONS: 'options',
  NUMBER: 'number',
  DATE: 'date',
};

export const REQUEST_COLUMNS = [
  {
    value: 'requestIdentifier',
    operators: [
      TABLE_FILTERS_OPERATORS.CONTAINS,
      TABLE_FILTERS_OPERATORS.DOESNT_CONTAIN,
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.GREATER,
      TABLE_FILTERS_OPERATORS.GREATER_OR_EQUAL,
      TABLE_FILTERS_OPERATORS.LESS,
      TABLE_FILTERS_OPERATORS.LESS_OR_EQUAL,
    ],
  },
  {
    value: 'requester',
    operators: STRING_COMPARATOR,
  },
  { value: 'title', operators: STRING_COMPARATOR },
  {
    value: 'submittedAt',
    operators: DATE_COMPARATOR,
    type: COLUMN_OPTION_TYPES.DATE,
  },
  { value: 'status', operators: STRING_COMPARATOR },
];

export const LD_USER_PERMISSIONS = [
  {
    value: 'owners',
    operators: STRING_COMPARATOR,
  },
  { value: 'businessTeam.title', operators: STRING_COMPARATOR },
];

export const BUSINESS_USER_PERMISSIONS = [
  {
    value: 'updatedAt',
    operators: DATE_COMPARATOR,
    type: COLUMN_OPTION_TYPES.DATE,
  },
];

export const REQUEST_SECTIONS = {
  BASIC_DETAILS: 'basicDetail',
  REQUEST_DETAILS: 'requestDetails',
  ADDITIONAL_DETAILS: 'additionalDetails',
  LD_DETAILS: 'ldDetails',
} as const;

export const REQUEST_PROPERTIES = {
  ADDITONAL_INFORMATION: 'additionalInformation',
  EFFORT: 'effort',
  COST: 'cost',
  LD_PRIORITY: 'ldPriority',
  REQUEST_IDENTIFIER: 'requestIdentifier',
  BUSINESS_UNIT: 'businessUnit',
  REQUEST_TITLE: 'requestTitle',
  REQUEST_OWNER: 'requestOwner',
  REQUEST_DESC: 'requestDescription',
  COMPLIANCE: 'compliance',
};

export const REQUEST_STATUS = {
  SUBMITTED: 'submitted',
  DRAFT: 'draft',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING_CANCEL: 'pending_cancellation',
  CANCELED: 'canceled',
};

export const REQUEST_LD_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  UNASSIGNED: 'unassigned',
} as const;

export const REQUEST_USER_LEVELS = {
  REQUESTER: 'requester',
  OWNER: 'owner',
  TEAM_MEMBER: 'teamMember',
};

export const REQUEST_REQUIRED_FIELDS = {
  TITLE: 'title',
  LD_PRIORITY: 'ldPriority',
} as const;

export const NEW_PROJECT_FORM_FIELDS = {
  TITLE: 'title',
  BUSINESS_UNIT: 'businessUnitId',
  CATEGORY: 'category_id',
  DESCRIPTION: 'description',
  START_DATE: 'startDate',
  TARGET_COMPLETION_DATE: 'targetCompletionDate',
  TARGET_LAUNCH_DATE: 'targetLaunchDate',
  ACTUAL_COMPLETION_DATE: 'actualDate',
  PROCESS: 'process_id',
  STATUS: 'status',
  STAGE: 'stage_id',
  PRIVACY: 'privacy',
  PRIORITY: 'priority',
  PROJECT_OWNERS: 'owners',
  RESOURCING_TYPE: 'resourcing_type',
  ESTIMATED_EFFORT: 'estimatedEffort',
  BUDGET_SOURCE: 'budget_source',
  ESTIMATED_COST: 'estimated_cost',
  ALLOCATED_BUDGET: 'allocated_budget',
  HEALTH: 'health',
  PROJECT_REQUESTS: 'projectRequests',
  VENDORS: 'vendors',
  TEAMS: 'learningTeams',
};

export const PROJECT_PRIVACY: objKeyAsString = {
  PRIVATE: 'private',
  TEAM: 'team',
  PUBLIC: 'public',
};

export const PROJECT_HEALTH: objKeyAsString = {
  ON_TRACK: 'green',
  OFF_TRACK: 'red',
  AT_RISK: 'orange',
};

export const PROJECT_RESOURCING_TYPE: objKeyAsString = {
  INTERNAL: 'internal',
  VENDOR: 'vendor',
  MIXED: 'mixed',
};

export const PROJECT_BUDGET_SOURCE: objKeyAsString = {
  LD: 'ld_budget',
  BUSINESS: 'business_budget',
  SPECIAL: 'special',
  MIXED: 'mixed',
  OTHERS: 'others',
};

export const PROJECT_PRIORITY: objKeyAsString = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const PROJECT_STATUS: objKeyAsString = {
  NEW: 'new',
  IN_PLANNING: 'in_planning',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  ON_HOLD: 'on_hold',
  CLOSED: 'closed',
};

export const UPDATE_PROJECT_TABS: objKeyAsString = {
  OVERVIEW: 'overview',
  TASKS: 'tasks',
  PEOPLE: 'people',
  BUDGET: 'budget',
  FILES: 'files',
};

export const PROJECT_CANCEL_REASONS: objKeyAsString = {
  PRIORITY_CHANGE: 'Priority change',
  LACK_OF_RESOURCE: 'Lack of resource',
  TIMELINE_CONFLICT: 'Timeline conflict',
  PROCUREMENT_ISSUE: 'Procurement issue',
  TECHNICAL_ISSUE: 'Technical issue',
  VENDOR_ISSUE: 'Vendor issue',
  OTHER: 'Other',
};

export const REQUEST_ACTIONS: objKeyAsString = {
  DOWNLOAD_REQUEST: 'DOWNLOAD_REQUEST',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
  CREATE_PROJECT: 'CREATE_PROJECT',
  LINK_PROJECT: 'LINK_PROJECT',
};

export const REASONS_OF_CANCELLATION = [
  'PRIORITY_CHANGE',
  'LACK_OF_RESOURCE',
  'OTHER',
] as const;

export const REASONS_OF_DECLINATION = [
  'PRIORITY_CHANGE',
  'LACK_OF_RESOURCE',
  'OTHER',
] as const;

export const PROJECTS_TABLE_COLUMNS = {
  PROJECT_NUMBER: 'PROJECT_NUMBER',
  PROJECT_NAME: 'PROJECT_NAME',
  STATUS: 'STATUS',
  BUSINESS_UNIT: 'BUSINESS_UNIT',
  PROJECT_CATEGORY: 'PROJECT_CATEGORY',
  PRIORITY: 'PRIORITY',
  PROJECT_OWNER: 'PROJECT_OWNER',
  START_DATE: 'START_DATE',
  TARGET_COMPLETION_DATE: 'TARGET_COMPLETION_DATE',
  ACTUAL_COMPLETION_DATE: 'ACTUAL_COMPLETION_DATE',
  RESOURCING_TYPE: 'RESOURCING_TYPE',
  BUGGET_SOURCE: 'BUGGET_SOURCE',
  PROCESS_STAGE: 'PROCESS_STAGE',
  HEALTH: 'HEALTH',
  PROJECT_ROLE: 'PROJECT_ROLE',
};

export const TEAM_PROJECTS_TABLE_COLUMNS = [
  PROJECTS_TABLE_COLUMNS.PROJECT_NUMBER,
  PROJECTS_TABLE_COLUMNS.PROJECT_NAME,
  PROJECTS_TABLE_COLUMNS.STATUS,
  PROJECTS_TABLE_COLUMNS.BUSINESS_UNIT,
  PROJECTS_TABLE_COLUMNS.PROJECT_CATEGORY,
  PROJECTS_TABLE_COLUMNS.PRIORITY,
  PROJECTS_TABLE_COLUMNS.PROJECT_OWNER,
  PROJECTS_TABLE_COLUMNS.START_DATE,
  PROJECTS_TABLE_COLUMNS.TARGET_COMPLETION_DATE,
  PROJECTS_TABLE_COLUMNS.ACTUAL_COMPLETION_DATE,
  PROJECTS_TABLE_COLUMNS.RESOURCING_TYPE,
  PROJECTS_TABLE_COLUMNS.BUGGET_SOURCE,
  PROJECTS_TABLE_COLUMNS.PROCESS_STAGE,
  PROJECTS_TABLE_COLUMNS.HEALTH,
];

export const USER_PROJECTS_TABLE_COLUMNS = [
  PROJECTS_TABLE_COLUMNS.PROJECT_NUMBER,
  PROJECTS_TABLE_COLUMNS.PROJECT_NAME,
  PROJECTS_TABLE_COLUMNS.PROJECT_CATEGORY,
  PROJECTS_TABLE_COLUMNS.BUSINESS_UNIT,
  PROJECTS_TABLE_COLUMNS.PROJECT_ROLE,
  PROJECTS_TABLE_COLUMNS.PRIORITY,
  PROJECTS_TABLE_COLUMNS.STATUS,
  PROJECTS_TABLE_COLUMNS.HEALTH,
];

export const PROJECTS_TABLE_FILTER_OPTIONS = {
  PROJECT_NUMBER: {
    value: 'projectNumber',
    operators: [
      TABLE_FILTERS_OPERATORS.CONTAINS,
      TABLE_FILTERS_OPERATORS.DOESNT_CONTAIN,
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.GREATER,
      TABLE_FILTERS_OPERATORS.GREATER_OR_EQUAL,
      TABLE_FILTERS_OPERATORS.LESS,
      TABLE_FILTERS_OPERATORS.LESS_OR_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  PROJECT_NAME: {
    value: 'title',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  BUSINESS_UNIT: {
    value: 'businessUnit',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  PROJECT_CATEGORY: {
    value: 'category',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  PRIORITY: {
    value: 'priority',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  PROJECT_OWNER: {
    value: 'owners',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  START_DATE: {
    value: 'startDate',
    operators: DATE_COMPARATOR,
    type: COLUMN_OPTION_TYPES.DATE,
  },
  TARGET_COMPLETION_DATE: {
    value: 'targetCompletionDate',
    operators: DATE_COMPARATOR,
    type: COLUMN_OPTION_TYPES.DATE,
  },
  ACTUAL_COMPLETION_DATE: {
    value: 'actualDate',
    operators: DATE_COMPARATOR,
    type: COLUMN_OPTION_TYPES.DATE,
  },
  PROCESS_STAGE: {
    value: 'process',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  HEALTH: {
    value: 'health',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  BUGGET_SOURCE: {
    value: 'budget_source',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  STATUS: {
    value: 'status',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  RESOURCING_TYPE: {
    value: 'resourcing_type',
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  PROJECT_ROLE: {
    value: 'project_role',
    operators: [
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.NOT_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.TEXT,
  },
} as const;

export const MEMBER_VALUES = {
  TEAM_MEMBERS: 'ldTeamMembers',
  JOB_TITLE: 'data.jobTitle',
  EMPLOYMENT_TYPE: 'data.employmentType',
  COUNTRY: 'country_iso_3166_1_alpha_2_code',
  HOURLY_RATE: 'data.rateHour',
};

export const TEAM_MEMBER_COLUMNS = [
  {
    labelKey: 'TEAM_MEMBERS',
    value: MEMBER_VALUES.TEAM_MEMBERS,
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  {
    labelKey: 'JOB_TITLE',
    value: MEMBER_VALUES.JOB_TITLE,
    operators: STRING_COMPARATOR,
    type: COLUMN_OPTION_TYPES.TEXT,
  },
  {
    labelKey: 'EMPLOYMENT_TYPE',
    value: MEMBER_VALUES.EMPLOYMENT_TYPE,
    operators: [
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.NOT_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.OPTIONS,
  },
  {
    labelKey: 'COUNTRY',
    value: MEMBER_VALUES.COUNTRY,
    operators: [
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.NOT_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.OPTIONS,
  },
  {
    labelKey: 'HOURLY_RATE',
    value: MEMBER_VALUES.HOURLY_RATE,
    operators: [
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.NOT_EQUAL,
      TABLE_FILTERS_OPERATORS.GREATER,
      TABLE_FILTERS_OPERATORS.GREATER_OR_EQUAL,
      TABLE_FILTERS_OPERATORS.LESS,
      TABLE_FILTERS_OPERATORS.LESS_OR_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.NUMBER,
  },
];

export const PROJECTS_BOARD_FILTER_OPTIONS: objKeyAsString = {
  PROJECT_NAME: {
    value: 'title',
    operators: STRING_COMPARATOR,
    type: 'text',
  },
  BUSINESS_UNIT: {
    value: 'businessUnit',
    operators: STRING_COMPARATOR,
    type: 'text',
  },
  STATUS: {
    value: 'status',
    operators: STRING_COMPARATOR,
    type: 'text',
  },
  PRIORITY: {
    value: 'priority',
    operators: STRING_COMPARATOR,
    type: 'text',
  },
  HEALTH: {
    value: 'health',
    operators: STRING_COMPARATOR,
    type: 'text',
  },
  TARGET_COMPLETION_DATE: {
    value: 'targetCompletionDate',
    operators: DATE_COMPARATOR,
    type: 'date',
  },
  PROJECT_OWNER: {
    value: 'owners',
    operators: STRING_COMPARATOR,
    type: 'text',
  },
} as const;

export const PROJECTS_TABLE_TABS = {
  TEAM_PROJECTS: 'teamProjectsTable',
  MY_PROJECTS: 'myProjectsTable',
} as const;

export const PROJECT_USER_ROLE = {
  OWNER: 'Owner',
  MEMBER: 'Member',
  COLLABORATOR: 'Collaborator',
};

export const SLICE_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  FAILED: 'failed',
} as const;

export const NOTIFICATION_STATUS = {
  NEW: 'new',
  UNREAD: 'unread',
  READ: 'read',
} as const;

export const PROJECT_FILES_PICKER = {
  ATTACH_FILE: 'ATTACH_FILE',
  LINK_FILE: 'LINK_FILE',
};

export const PROJECT_LINK_FILE_TYPE = 'link';

export const FILE_SIZE_UNITS = [
  'B',
  'KB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
];

export const UPDATE_MEMBER_OPTIONS = [
  'UPDATE_INFO',
  'VIEW_ALL_PROJECTS',
  'MANAGE_TIME_OFF',
  'REMOVE_MEMBER',
] as const;

export const EMPLOYMENT_TYPE = [
  'FULL_TIME',
  'PART_TIME',
  'INTERN',
  'CONTRACTOR',
] as const;

export const PROJECT_MORE_ACTIONS = {
  CANCEL: 'CANCEL',
  DELETE: 'DELETE',
  CLOSE: 'CLOSE',
};

export const NOTIFICATION_TYPE = {
  REQUEST_STATUS_UPDATED: 'request-status-updated',
  REQUEST_ATTRIBUTES_UPDATED: 'request-attributes-updated',
  REQUEST_QUESTIONS_UPDATED: 'request-questions-updated',
  ASSIGN_NEW_OWNER: 'request-owner-assigned',
  QUESTION_COMMENTED: 'question-commented',
  REQUEST_PROPERTY_COMMENTED: 'request-property-commented',
  TASK_USER_ASSIGNED: 'task-user-assigned',
  TASK_USER_UNASSIGNED: 'task-user-unassigned',
  TASK_UPDATED: 'task-updated',
  TASK_STATUS_UPDATED: 'task-status-updated',
  TASK_DISABLED: 'task-disabled',
  TASK_DELETED: 'task-deleted',
  TASK_DUE_DATE: 'task-due-date',
  PROJECT_OWNER_ASSIGNED: 'project-owner-assigned',
  PROJECT_OWNER_UNASSIGNED: 'project-owner-unassigned',
  PROJECT_STATUS_UPDATED: 'project-status-updated',
  PROJECT_UPDATED: 'project-updated',
  PROJECT_COMMENTED: 'project-commented',
} as const;

export const PROJECTS_LIST_VIEW_MODE = {
  TABLE: 'TABLE',
  BOARD: 'BOARD',
};

export const PROJECTS_BOARD_TABS = {
  TEAM_BOARD: 'teamProjectsBoard',
  MY_BOARD: 'myProjectsBoard',
} as const;

export const STAGE_COLORS = [
  'bg-primary-lighter text-primary-dark',
  'bg-purple-lighter text-purple-dark',
  'bg-error-lighter text-error-dark',
  'bg-fire-lighter text-fire-dark',
  'bg-warning-lighter text-warning-dark',
  'bg-success-lighter text-success-dark',
];

export const STAGE_ON_DRAG_COLORS = [
  'bg-primary-lightest',
  'bg-purple-lightest',
  'bg-error-lightest',
  'bg-fire-lightest',
  'bg-warning-lightest',
  'bg-success-lightest',
];

export const STAGE_ON_DRAG_BORDER_COLORS = [
  'border-primary-light',
  'border-purple-light',
  'border-error-light',
  'border-fire-light',
  'border-warning-light',
  'border-success-light',
];

export const QUESTIONNAIRE_TYPE = {
  REQUEST: 'request',
  FORM: 'form',
} as const;

export const JOB_FUNCTIONS = [
  'BUSINESS_RELATIONSHIP_MANAGEMENT',
  'COACHING',
  'CONSULTING',
  'COORDINATION',
  'DATA_REPORTING_ANALYSIS',
  'FACILITATION',
  'INSTRUCTIONAL_DESIGN',
  'INTAKE_MANAGEMENT',
  'LEARNING_DEVELOPMENT',
  'LEARNING_PLATFORM_ADMINISTRATION',
  'LEARNING_STRATEGY',
  'LEARNING_SUPPORT',
  'LEADERSHIP_DEVELOPMENT',
  'MEASUREMENT',
  'PLANNING',
  'PROGRAM_MANAGEMENT',
  'PROJECT_MANAGER',
  'RESOURCE_MANAGEMENT',
  'TALENT_DEVELOPMENT',
  'TEAM_MANAGEMENT',
  'OTHERS',
] as const;

export const LANGUAGES = [
  'aa',
  'ab',
  'ae',
  'af',
  'ak',
  'am',
  'an',
  'ar',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cu',
  'cv',
  'cy',
  'da',
  'de',
  'dv',
  'dz',
  'ee',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fj',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gn',
  'gu',
  'gv',
  'ha',
  'he',
  'hi',
  'ho',
  'hr',
  'ht',
  'hu',
  'hy',
  'hz',
  'ia',
  'id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'it',
  'iu',
  'ja',
  'jv',
  'ka',
  'kg',
  'ki',
  'kj',
  'kk',
  'kl',
  'km',
  'kn',
  'ko',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lu',
  'lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'na',
  'nb',
  'nd',
  'ne',
  'ng',
  'nl',
  'nn',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pi',
  'pl',
  'ps',
  'pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ru',
  'rw',
  'sa',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'ts',
  'tt',
  'tw',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zu',
  'UNDEFINED',
];

export const USER_STATUS = {
  REGISTERED: 'registered',
  INVITED: 'invited',
  REGISTERED_DISABLED: 'registered_disabled',
  INVITED_DISABLED: 'invited_disabled',
};

export const COUNTRIES = [
  'AF',
  'AX',
  'AL',
  'DZ',
  'AS',
  'AD',
  'AO',
  'AI',
  'AQ',
  'AG',
  'AR',
  'AM',
  'AW',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BH',
  'BD',
  'BB',
  'BY',
  'BE',
  'BZ',
  'BJ',
  'BM',
  'BT',
  'BO',
  'BQ',
  'BA',
  'BW',
  'BV',
  'BR',
  'IO',
  'BN',
  'BG',
  'BF',
  'BI',
  'KH',
  'CM',
  'CA',
  'IC',
  'CV',
  'KY',
  'CF',
  'TD',
  'CL',
  'CN',
  'CX',
  'CC',
  'CO',
  'KM',
  'CG',
  'CD',
  'CK',
  'CR',
  'CI',
  'HR',
  'CU',
  'CW',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'EC',
  'EG',
  'SV',
  'GQ',
  'ER',
  'EE',
  'ET',
  'FK',
  'FO',
  'FJ',
  'FI',
  'FR',
  'GF',
  'PF',
  'TF',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GI',
  'GR',
  'GL',
  'GD',
  'GP',
  'GU',
  'GT',
  'GG',
  'GN',
  'GW',
  'GY',
  'HT',
  'HM',
  'VA',
  'HN',
  'HK',
  'HU',
  'IS',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IE',
  'IM',
  'IL',
  'IT',
  'JM',
  'JP',
  'JE',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KR',
  'KP',
  'KW',
  'KG',
  'LA',
  'LV',
  'LB',
  'LS',
  'LR',
  'LY',
  'LI',
  'LT',
  'LU',
  'MO',
  'MK',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MQ',
  'MR',
  'MU',
  'YT',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'ME',
  'MS',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'NC',
  'NZ',
  'NI',
  'NE',
  'NG',
  'NU',
  'NF',
  'MP',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PY',
  'PE',
  'PH',
  'PN',
  'PL',
  'PT',
  'PR',
  'QA',
  'RE',
  'RO',
  'RU',
  'RW',
  'BL',
  'SH',
  'KN',
  'LC',
  'MF',
  'PM',
  'VC',
  'WS',
  'SM',
  'ST',
  'SA',
  'SN',
  'RS',
  'SC',
  'SL',
  'SG',
  'SX',
  'SK',
  'SI',
  'SB',
  'SO',
  'ZA',
  'GS',
  'SS',
  'ES',
  'LK',
  'SD',
  'SR',
  'SJ',
  'SZ',
  'SE',
  'CH',
  'SY',
  'TW',
  'TJ',
  'TZ',
  'TH',
  'TL',
  'TG',
  'TK',
  'TO',
  'TT',
  'TN',
  'TR',
  'TM',
  'TC',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UM',
  'UY',
  'UZ',
  'VU',
  'VE',
  'VN',
  'VG',
  'VI',
  'WF',
  'EH',
  'YE',
  'XK',
  'ZM',
  'ZW',
];

export const UPDATE_MEMBER_FORM = 'update_member_form';

export const TIME_OFF_TYPE = {
  paid_time_off: 'paid_time_off',
  sick_day_off: 'sick_day_off',
  custom_holiday: 'custom_holiday',
} as const;

export const BOARD_SORTING_OPTIONS: objKeyAsString = {
  NEWEST: {
    order: 'desc',
    orderBy: 'targetCompletionDate',
  },
  OLDEST: {
    order: 'asc',
    orderBy: 'targetCompletionDate',
  },
  TITLE_DESC: {
    order: 'desc',
    orderBy: 'title',
  },
  TITLE_ASC: {
    order: 'asc',
    orderBy: 'title',
  },
};

export const TASK_TYPES = [
  'Research',
  'Analysis',
  'Design',
  'Content Creation',
  'Development',
  'Evaluation',
  'Review',
  'Publish',
  'Scheduling/Registration',
  'Delivery/Facilitation',
  'LMS',
  'Communication',
  'Other',
];

export const TASK_STATUS: objKeyAsString = {
  NEW: 'new',
  ON_HOLD: 'on_hold',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const TASKS_TABLE_TABS = {
  TEAM_TASKS: 'teamTasksTable',
  MY_TASKS: 'myTasksTable',
} as const;

export const TASK_FIELDS = {
  NAME: 'name',
  START_DATE: 'start_date',
  DUE_DATE: 'due_date',
  TASK_TYPE: 'type',
  ASSIGNEE_ADD: 'assignedUserIds',
  ASSIGNEE_UPDATE: 'assignedUsers',
  DESCRIPTION: 'description',
  ESTIMATED_HOURS: 'estimate_hours',
  STATUS: 'status',
  DISABLED: 'disabled',
  ACTUAL_HOURS: 'actual_hours',
  COMPLETION_DATE: 'completion_date',
};

export const TASKS_TABLE_COLUMN_REFERENCE = {
  DISABLED: 'DISABLED',
  NAME: 'NAME',
  ASSIGNEE_UPDATE: 'ASSIGNEE_UPDATE',
  TASK_TYPE: 'TASK_TYPE',
  START_DATE: 'START_DATE',
  DUE_DATE: 'DUE_DATE',
  STATUS: 'STATUS',
};

export const TASKS_TABLE_COLUMNS = [
  TASKS_TABLE_COLUMN_REFERENCE.DISABLED,
  TASKS_TABLE_COLUMN_REFERENCE.NAME,
  TASKS_TABLE_COLUMN_REFERENCE.ASSIGNEE_UPDATE,
  TASKS_TABLE_COLUMN_REFERENCE.TASK_TYPE,
  TASKS_TABLE_COLUMN_REFERENCE.START_DATE,
  TASKS_TABLE_COLUMN_REFERENCE.DUE_DATE,
  TASKS_TABLE_COLUMN_REFERENCE.STATUS,
];

export const TASKS_TABLE_FILTER: objKeyAsString = {
  TASK_TYPE: {
    value: TASK_FIELDS.TASK_TYPE,
    operators: [
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.NOT_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.OPTIONS,
  },
  STATUS: {
    value: TASK_FIELDS.STATUS,
    operators: [
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.NOT_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.OPTIONS,
  },
  ASSIGNEE_UPDATE: {
    value: TASK_FIELDS.ASSIGNEE_UPDATE,
    operators: [
      TABLE_FILTERS_OPERATORS.EQUAL,
      TABLE_FILTERS_OPERATORS.NOT_EQUAL,
    ],
    type: COLUMN_OPTION_TYPES.OPTIONS,
  },
  START_DATE: {
    value: TASK_FIELDS.START_DATE,
    operators: DATE_COMPARATOR,
    type: COLUMN_OPTION_TYPES.DATE,
  },
  DUE_DATE: {
    value: TASK_FIELDS.DUE_DATE,
    operators: DATE_COMPARATOR,
    type: COLUMN_OPTION_TYPES.DATE,
  },
  DISABLED: {
    value: TASK_FIELDS.DISABLED,
    operators: [TABLE_FILTERS_OPERATORS.EQUAL],
    type: COLUMN_OPTION_TYPES.OPTIONS,
  },
};

export const TASKS_MORE_ACTIONS = {
  DELETE: 'DELETE',
};

export const PROJECT_PROCESS_FIELDS = {
  PROCESS_NAME: 'processName',
  DESCRIPTION: 'description',
  ORGANIZATION_ID: 'organization_id',
  CREATED_BY: 'createdBy',
  STAGES: 'projectStages',
  DATA: 'data',
};

export const PROJECT_STAGE_FIELDS: objKeyAsString = {
  STAGE_NAME: 'stageName',
  DESCRIPTION: 'description',
  PROCESS_ID: 'process_id',
  MAX_COMPLETON_TIME: 'maxCompletionTime',
  MIN_COMPLETION_TIME: 'minCompletionTime',
  DATA: 'data',
};

export const FORMS_FILTER_OPTIONS = {
  TITLE: 'title',
  REQUEST_TYPE: 'request_type',
  FORM_CREATOR: 'formCreator.data.firstName',
  CREATION_DATE: 'createdAt',
  LAST_UPDATE: 'updatedAt',
  STATUS: 'data.published',
};

export const CREATE_TEAM_FORM = 'create_team_form';

export const BUDGET_DETAILS_FIELDS = {
  ALLOCATED_BUDGET: 'allocated_budget',
  NOTES: 'notes',
  COST_TO_DATE: 'cost_to_date',
};
