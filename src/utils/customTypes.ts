import { DebouncedFunc } from 'lodash';
import { PickerFileMetadata } from 'filestack-js';
import {
  NOTIFICATION_TYPE,
  REQUEST_LD_PRIORITY,
  REQUEST_REQUIRED_FIELDS,
  REQUEST_SECTIONS,
  REQUEST_TYPE,
  PROJECTS_TABLE_TABS,
  PROJECT_HEALTH,
  PROJECT_PRIORITY,
  PROJECT_STATUS,
  PROJECT_USER_ROLE,
  SLICE_STATUS,
  PROJECTS_LIST_VIEW_MODE,
  QUESTIONNAIRE_TYPE,
  TIME_OFF_TYPE,
  USER_STATUS,
  PROJECTS_BOARD_TABS,
  TASK_STATUS,
  TASKS_TABLE_TABS,
  UPDATE_PROJECT_TABS,
  LICENSE_TIER,
  REQUEST_PRIORITY,
} from 'utils/constants';
import { ReactNode } from 'react';

export type objKeyAsString = {
  [key: string]: any;
};

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

export type requestType = typeof REQUEST_TYPE[number];

export type Owner = {
  id?: string;
  organization_id?: string;
  ldTeam_id?: string;
  businessTeam_id?: string;
  type?: string;
  status?: string;
  note?: string;
  default_capacity?: number;
  avatar_url?: string;
  data?: {
    role?: string;
    email?: string;
    jobTitle?: string;
    lastName?: string;
    firstName?: string;
    jobFunctions?: string[];
    languages?: string[];
    skills?: string;
  };
};

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  province?: string;
  profilePicture?: string;
  files?: string;
}

interface LDUserData extends UserData {
  jobFunctions?: string[];
  employmentType?: string;
  skills?: string;
  rateHour?: string;
  languages?: string[];
  files?: string;
}

interface ExternalUserData extends UserData {
  companyName?: string;
  rateHour?: string;
  files?: string;
}

export interface User {
  id: string;
  country_iso_3166_1_alpha_2_code: string;
  type: 'business' | 'ld' | 'external';
  role: 'user' | 'admin';
  data: UserData;
  status: typeof USER_STATUS[keyof typeof USER_STATUS];
  disabled_at?: string | null;
  avatar_url?: string;
}

export interface LDUser extends User {
  ldTeam_id?: string;
  registeredLearningTeams: LDTeam[];
  default_capacity: number;
  public_holidays_in_capacity_enabled?: boolean;
  data: LDUserData;
}

export interface BusinessUser extends User {
  businessTeam_id?: string;
}

export interface ExternalUser extends User {
  data: ExternalUserData;
}

export type CurrentUser = {
  email?: string;
  full_name?: string;
  id?: string;
  organization_id?: string;
  type?: string;
  role?: 'admin' | 'user';
  avatar_url?: string;
  firstName?: string;
  lastName?: string;
  status?: typeof USER_STATUS[keyof typeof USER_STATUS];
};

export interface Request {
  updatedAt?: any;
  createdAt?: any;
  requester?: any;
  requester_id?: string;
  owners?: LDUser[];
  requestIdentifier?: string;
  submittedAt?: any;
  title?: string;
  description?: string;
  id?: string;
  data?: {
    baseFormId?: string;
    additionalInformation?: string;
    cancellation?: {
      reason?: string;
      details?: string;
      ldRemark?: string;
    };
    declination?: {
      reason?: string;
      details?: string;
    };
    published?: boolean;
  };
  request_type?: requestType;
  status?: string;
  effort?: string;
  cost?: string;
  ldPriority?: typeof REQUEST_LD_PRIORITY[keyof typeof REQUEST_LD_PRIORITY];
  compliance?: boolean;
  requestProjects?: Project[];
  businessTeam?: {
    id?: string;
    title?: string;
  };
  decision_date?: string;
  type?: typeof QUESTIONNAIRE_TYPE[keyof typeof QUESTIONNAIRE_TYPE];
  organization_id?: string;
  executive_stakeholder?: string;
  priority?: typeof REQUEST_PRIORITY[keyof typeof REQUEST_PRIORITY];
}

export interface RequestQuestion {
  id: string;
  data: {
    value: any | string;
    label: string;
    isRequired?: boolean;
  };
  section: typeof REQUEST_SECTIONS[keyof typeof REQUEST_SECTIONS];
  type: QuestionTypes;
}

export type QuestionTypes =
  | 'radio'
  | 'checkbox'
  | 'range'
  | 'date'
  | 'dropdown'
  | 'number'
  | 'customTextArea'
  | 'url'
  | 'file'
  | 'toggle';

export interface intakeQuestionWrapper {
  question: RequestQuestion;
  className?: string;
  handler: (
    question: any,
    value:
      | string
      | boolean
      | number
      | Array<PickerFileMetadata>
      | dropdownOption
      | dropdownOption[]
      | rangeDate,
    path: string
  ) => void | DebouncedFunc<
    (
      question: any,
      value: string | boolean | number | Array<PickerFileMetadata>,
      path: string
    ) => void
  >;
  disabled?: boolean;
  isEditing?: boolean;
}

export type UpdateReqData = {
  requestAttributes: Request;
  requestQuestions: { [key: string]: RequestQuestion };
};

export type RequestPageTabs = 0 | 1 | 2 | 3;

export type RequestRequiredFields =
  typeof REQUEST_REQUIRED_FIELDS[keyof typeof REQUEST_REQUIRED_FIELDS];

export type RequestRequiredErrors = PartialRecord<
  RequestRequiredFields,
  boolean
>;

export type LDUserType = {
  businessTeam_id: string;
  data: {
    email: string;
    lastName: string;
    firstName: string;
  };
  id: string;
  ldTeam_id: string;
};

export interface LDTeam {
  id: string;
  name: string;
  description: string;
}

export type BusinessTeam = {
  id: string;
  title: string;
  data?: {};
  actual_result?: string;
  description?: string;
  fiscal_year?: Date;
  next_steps?: string;
  organization_id?: string;
  outcomes?: string;
  owner?: string;
  results_forecast?: string;
  status?: string;
  target_completion?: string;
  target_result?: string;
  createdAt?: string;
};

export type FormOption = {
  label: string;
  value: string;
  requestType?: string | null;
};

export type rangeDate = {
  startDate: Date | string;
  endDate: Date | string;
};

export type filter = {
  value: string | rangeDate | FormOption;
  operator: string;
  logic: 'AND' | 'OR' | undefined;
  type: string;
  column?: string;
};

export type PropertyCommentType = CommentType & {
  message: string;
  commentCreator: {
    id: string;
    data: {
      firstName: string;
      lastName: string;
    };
  };
};

export type newPropertyCommentType = {
  message: string;
  isBaseComment: boolean;
  requestId: string;
  requestProperty: string;
  userId: string;
};

export type QuestionCommentType = CommentType & {
  content: string;
  author: {
    userId: string;
    name: string;
  };
  commentThreadId?: string;
};

interface CommentType {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectComment = CommentType & {
  content: string;
  author?: {
    userId: string;
    name: string;
  };
  commentCreator: {
    id: string;
    data: {
      firstName: string;
      lastName: string;
    };
  };
  parentId?: string;
  projectId: string;
  commentCreatorId: string;
};

export interface ProjectOwner {
  data: {
    email?: string;
    lastName?: string;
    firstName?: string;
  };
  project_owners: {
    projectLearnOpId?: string;
    userId?: string;
  };
}

export interface ProjectCollaborator {
  data: {
    email?: string;
    lastName?: string;
    firstName?: string;
  };
  project_collaborators: {
    projectLearnOpId?: string;
    userId?: string;
  };
}

export interface ProjectParticipant {
  data: {
    email?: string;
    lastName?: string;
    firstName?: string;
  };
  project_participants: {
    projectLearnOpId?: string;
    userId?: string;
  };
}

export type ProjectHealth = typeof PROJECT_HEALTH[keyof typeof PROJECT_HEALTH];

export interface Project {
  id: string;
  projectNumber?: number;
  title: string;
  status?: typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];
  createdAt: string;
  owners: ProjectOwner[];
  collaborators: ProjectCollaborator[];
  participants: ProjectParticipant[];
  hold_reason: string;
  startDate: string;
  targetCompletionDate: string;
  actualDate?: string;
  budget_source?: string;
  resourcing_type?: string;
  health?: ProjectHealth;
  category_id: string;
  businessUnitId: string;
  priority?: typeof PROJECT_PRIORITY[keyof typeof PROJECT_PRIORITY];
  process_id?: string;
  stage_id?: string;
  actual_cost?: string;
  actual_time_spent?: string;
  finalComments?: string;
  closedDate?: string;
  tasksOrdering?: string[];
}

export interface NewProject extends objKeyAsString {
  title: string;
  businessUnit?: string;
  category_id: string;
  description?: string;
  startDate: string | null;
  targetCompletionDate: string | null;
  targetLaunchDate?: string | null;
  actualDate?: string | null;
  process_id: string;
  status?: string;
  stage_id?: string;
  privacy: string;
  priority?: string | null;
  owners: (String | undefined)[];
  resourcing_type?: string | null;
  estimatedEffort?: string;
  budget_source?: string | null;
  estimated_cost?: string;
  allocated_budget?: number;
  health?: string;
  hold_reason?: string;
  data?: object;
  organization_id?: String | undefined;
  actual_cost?: number;
  actual_time_spent?: number;
  finalComments?: string;
  closedDate?: string | null;
  tasksOrdering?: string[];
  collaborators?: ProjectCollaborator[];
  participants?: ProjectParticipant[];
}

export interface ModalProps {
  actionButtons?: any[];
  closeModal?: (event?: React.SyntheticEvent<Element, Event>) => void;
  isOpen?: boolean;
  title?: string;
  size?: any;
  titleIcon?: any;
  children?: ReactNode;
  childrenClassName?: string;
}

export type MoreActionsOption = {
  value: string;
  label: string;
  dataCy?: string;
  iconName: string;
  iconSrc?: string;
  iconClassName?: string;
  selectOption?: () => void;
  disabled?: boolean;
  tooltipText?: string;
};

export interface NewTeamType {
  name: string;
  description: string;
  parent_id?: string | null;
  team_manager_id?: string | null;
}

export interface LearningTeamBase extends NewTeamType {
  organization_id?: string;
}
export interface LearningTeam extends LearningTeamBase {
  data?: {};
  enabled?: boolean;
  id: string;
  note?: string;
  primary_settings?: {};
  additional_settings?: {};
  status?: string;
  ldTeamMembers: Owner[];
  createdAt?: string;
  teamManager?: User;
}

export type LDTeamRow = {
  id: string;
  name: string;
  teamManager?: AvatarUser;
  parentTeam?: string;
  createdAt?: string;
};

export type SortingType = 'desc' | 'asc';

export type SortingOrderType = {
  order: SortingType;
  orderBy: string;
};

export type ProjectsTableTab =
  typeof PROJECTS_TABLE_TABS[keyof typeof PROJECTS_TABLE_TABS];

export interface UserOption extends Option {
  avatar: { initial?: string; imageSrc?: string };
}

export interface UserAvatars extends Option {
  avatar: { initial: string; imageSrc?: string };
}

export type ProjectUserRole =
  typeof PROJECT_USER_ROLE[keyof typeof PROJECT_USER_ROLE];

export type Notification = {
  id?: string;
  user_id?: string;
  status?: string;
  message?: string;
  data?: {};
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type Status = typeof SLICE_STATUS[keyof typeof SLICE_STATUS];
export type Task_Status = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export type FormattedNotification = {
  id: string;
  content?: ReactNode;
  link: string;
  time?: string;
  status?: string;
  avatar?: {};
};

export type ProjectProcessStage = {
  id: string;
  stageName: string;
  enabled: boolean;
  description: string;
  process_id: string;
  data: object;
};

export type ProjectProcess = {
  id: string;
  enabled?: boolean;
  processName: string;
  projectStages: ProjectProcessStage[];
  description: string;
  organization_id: string;
  data: object;
  stagesOrdering: string[];
  estimatedCompletionTime?: string;
  createdAt: string;
};

export type NewProjectProcessStage = {
  stageName: string;
  description: string;
  process_id?: string;
  data: object;
};

export type NewProjectProcess = {
  processName: string;
  description: string;
  organization_id: string;
  data: object;
  projectStages: NewProjectProcessStage[];
};

export type ProjectVendor = {
  id: string;
  vendorName: string;
  description?: string;
  enabled?: boolean;
  organization_id: string;
  country_iso_3166_1_alpha_2_code?: string;
  createdAt: string;
  data: {
    province?: string;
    address?: string;
    website?: string;
    contactName?: string;
    email?: string;
    phone?: string;
  };
};

export type ProjectCategory = {
  id: string;
  categoryName: string;
};

export type NotificationType =
  typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];

export type ProjectsListViewMode =
  typeof PROJECTS_LIST_VIEW_MODE[keyof typeof PROJECTS_LIST_VIEW_MODE];

export type ProjectsBoardTabs =
  typeof PROJECTS_BOARD_TABS[keyof typeof PROJECTS_BOARD_TABS];

export interface Option {
  label: string;
  value: any;
}
export interface NewTask extends objKeyAsString {
  name: string;
  description?: string;
  start_date: string;
  due_date: string;
  estimate_hours: number;
  organization_id?: String | undefined;
  parent_id?: String | undefined;
  project_id?: String | undefined;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  status?: Task_Status;
  completion_date?: string;
  estimate_hours?: number;
  actual_hours?: string;
  organization_id?: string;
  parent_id?: string;
  project_id?: string;
  createdAt: string;
  type?: string;
  assignedUsers?: TaskAssignedUser[];
  disabled?: boolean;
}

export interface TaskDetailType extends objKeyAsString {
  name: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  type?: string;
  task_assignee?: string;
  status?: Task_Status;
  estimate_hours?: string;
  completion_date?: string;
  actual_hours?: string;
  organization_id?: string;
  parent_id?: string;
  project_id?: string;
  createdAt: string;
  deletedAt: string;
  assignedUsers: Array<TaskAssignedUser> | string[];
  data: null;
  disabled: boolean;
  id: string;
  index: string;
  milestone_id: string;
  subTasks: Array<TaskDetailType>;
  updatedAt: string;
}

export interface TaskAssignedUser {
  data: {
    companyName: string;
    email: string;
    firstName: string;
    freeTrial: boolean;
    jobTitle: string;
    lastName: string;
    resourceId: string;
    role: string;
  };
  id: string;
  task_assignedUsers: {
    createdAt: string;
    learnopsTaskId: string;
    updatedAt: string;
    userId: string;
  };
}

export type ProcessStage = {
  id: string;
  color: string;
  name: string;
  cards: Project[];
  colorOnDrag: string;
  borderColorOnDrag: string;
};

export type AvatarSize = 'small' | 'medium' | 'large';

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];
export interface ProjectFileMetadata
  extends Omit<
    PickerFileMetadata,
    'originalPath' | 'size' | 'source' | 'uploadId'
  > {
  originalPath?: string;
  size?: number;
  source?: string;
  uploadId?: string;
  cloudFrontURL?: string;
}

export type ProjectFile = {
  metadata: ProjectFileMetadata;
  uploadedBy: string;
  uploadDate: string;
  linkedTasks?: string[];
};

export type TimeOffType = typeof TIME_OFF_TYPE[keyof typeof TIME_OFF_TYPE];

export interface TimeOff extends objKeyAsString {
  startDate?: string;
  endDate?: string;
  userId?: string;
  timeOffType?: TimeOffType;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
export interface TimeOffData extends objKeyAsString {
  id?: string;
  time_off_type?: TimeOffType;
  start_date: string;
  end_date: string;
  user_id?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type TasksTableTab =
  typeof TASKS_TABLE_TABS[keyof typeof TASKS_TABLE_TABS];

export type rangeDateType = {
  startDate: string;
  endDate: string;
};

export type ProjectTab =
  typeof UPDATE_PROJECT_TABS[keyof typeof UPDATE_PROJECT_TABS];

export interface Form extends Request {
  form_creator_id?: string;
  form_description?: string;
  createdAt?: string;
  updatedAt?: string;
  questions?: RequestQuestion[];
}

export interface NewFormType extends Form {
  organizationId: string;
}

export type Pagination = {
  limit: number;
  offset: number;
};
export type AllUsersType = LDUser | BusinessUser | ExternalUser;

export interface AvatarUser {
  avatar_url?: string;
  data: {
    firstName: string;
    lastName: string;
  };
}

export type HolidaysType = {
  name: string;
  date: string;
};

export interface NewBusinessTeamData {
  title: string;
  description: string;
}

export interface BudgetPlanType {
  estimated_cost: string | undefined;
  budget_source: string | null | undefined;
  allocated_budget: number | undefined;
}

export interface NewProjectParticipant {
  userId: string;
  startDate: string;
  endDate: string;
  job_role: string;
  type: string;
  hoursAssigned?: number;
  estimatedHours?: number;
}

export interface NewProjectCollaborator
  extends Omit<NewProjectParticipant, 'type' | 'hoursAssigned' | 'job_role'> {
  jobRole: string;
}

export type ResourcingType = 'internal' | 'mixed' | 'vendor';

export interface ResourcePlanType {
  resourcing_type: string | undefined | null;
  vendors: ProjectVendor[];
}

export interface Budget {
  id: string;
  category_id?: string;
  project_id?: string;
  category_name?: string;
  organization_id?: string;
  category_currency?: string;
  allocated_budget?: number;
  cost_to_date?: number;
  notes: string;
  createdAt: string;
}

export interface BudgetDetail {
  id: string;
  name?: string;
  organization_id?: string;
  currency?: string;
  createdAt: string;
  categoryBudgets?: Budget[];
}

export interface NewBudget extends objKeyAsString {
  category_id?: string;
  project_id?: string;
  category_name?: string;
  organization_id?: string;
  category_currency?: string;
  allocated_budget?: number;
  cost_to_date?: number;
  notes: string;
}
export interface BudgetCategory {
  id: string;
  name?: string;
  organization_id?: string;
  currency?: string;
}

export interface UserCapacity {
  data: {
    id: string;
    role: string;
    organization_id: string;
    ldTeam_id?: string | null;
    businessTeam_id?: string | null;
    type: 'business' | 'ld' | 'external';
    cost?: string | null;
    public_holidays_in_capacity_enabled: boolean;
    default_capacity: number;
    status: typeof USER_STATUS[keyof typeof USER_STATUS];
    country_iso_3166_1_alpha_2_code: string;
    location?: string | null;
    note?: string | null;
    job_title?: string | null;
    avatar_url?: string | null;
    skills?: string | null;
    data: {
      role: string;
      email: string;
      jobTitle: string;
      lastName: string;
      firstName: string;
      freeTrial: boolean;
      resourceId: string;
      companyName: string;
    };
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    learning_team_members: {
      createdAt: string;
      updatedAt: string;
      learningTeamId: string;
      userId: string;
    };
  };
  allocations: {
    weekStart: string;
    weekEnd: string;
    capacity: number;
    timeOff: {
      weeklyTimeOffForUser: number;
    };
    holidays: {
      date: string;
      start: string;
      end: string;
      name: string;
      type: string;
    }[];
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    status: typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];
    priority: typeof PROJECT_PRIORITY[keyof typeof PROJECT_PRIORITY];
    health: ProjectHealth;
    participants: {
      id: string;
      project_participants: ProjectParticipant['project_participants'];
    }[];
    currentParticipantRoles: {
      role: string;
      startDate: string;
      endDate: string;
    }[];
    totalAllocationForAllRoles: number;
    targetCompletionDate: string;
  }[];
}

export interface CapacityEntry {
  users: Record<string, UserCapacity>;
  team: Omit<LearningTeam, 'ldTeamMembers'>;
}

export type dropdownOption = {
  value: string;
  display: string;
};

export type radioOption = {
  id: string;
  text: string;
};

export type checkboxOption = {
  index: string;
  item: string;
};

export interface ResourceSummaryItem {
  projectRole: string;
  numberOfResource: string;
  totalHours: string;
}

export interface ResourceSummary {
  items: ResourceSummaryItem[];
  total: {
    totalNumberOfResource: number;
    totalHours: number;
  };
}

export interface ProjectCollaboratorsAllocations {
  start_date: string;
  end_date: string;
  estimated_hours: string;
  job_role: string;
  userId: string;
  projectLearnOpId: string;
  collaborator: Owner;
  assignedProjectTasks: TaskDetailType[];
}

export interface ParticipanttAllocation {
  weekStart: string;
  weekEnd: string;
  capacity: 0;
  allocatedHours: 0;
  allocationId: string;
  role?: string;
}

export interface AllocationUpdateData {
  allocatedHours: number;
  allocationId: string;
}

export interface CollaboratorEstimation {
  start_date: string;
  end_date: string;
  estimated_hours: string;
  userId: string;
  projectLearnOpId: string;
}

export interface ProjectParticipantRole {
  role: string;
  participationId?: string;
  allocations?: ParticipanttAllocation[];
  estimation?: CollaboratorEstimation;
  endDate?: string;
  startDate?: string;
  hoursAssigned?: number;
}

export interface TimeOffHoliday {
  date: string;
  start: string;
  end: string;
  name: string;
  type: string;
}
export interface WeekTimeOffAndHolidays {
  holidaysWithinWeek: TimeOffHoliday[];
  weekEnd: string;
  weekStart: string;
  weeklyTimeOffForUser: number;
}

export interface ProjectParticipantAllocation {
  data: Owner;
  roles: ProjectParticipantRole[];
  assignedProjectTasks?: TaskDetailType[];
  holidaysAndTimeOffs?: WeekTimeOffAndHolidays[];
}

export interface ProjectParticipantsAllocations {
  [key: string]: ProjectParticipantAllocation;
}

export interface ResourceAllocationSections {
  [key: string]: {
    id: string;
    users: ProjectParticipantsAllocations;
  };
}

export interface UserIdWithName {
  userId: string;
  name: string;
}

export interface ParticipantAssignment {
  userId: string;
  startDate: string;
  endDate: string;
  job_role: string;
  totalAllocation?: number;
  participationId?: string;
  allocations?: ParticipanttAllocation[];
  estimatedHours?: number;
  newlyAdded?: boolean;
}

export interface CollaboratorAssignment {
  userId: string;
  startDate: string;
  endDate: string;
  jobRole: string;
  estimatedHours?: number;
}

export type License = {
  license_tier: typeof LICENSE_TIER[keyof typeof LICENSE_TIER];
  license_number: number;
};

export type TeamMemberProject = {
  id: string;
  title: string;
  priority: typeof PROJECT_PRIORITY[keyof typeof PROJECT_PRIORITY];
  health: ProjectHealth;
  roles: Record<string, string>;
  status: string;
  hours: number;
  targetCompletionDate: string;
};

export type TeamMemberAllocation = {
  weekStart: Date;
  weekEnd: Date;
  capacity: number;
  defaultCapacity: number;
};

export interface UserColumnType {
  user: {
    roles: string;
    avatar_url?: string;
    data: UserData;
  };
  projects: Array<TeamMemberProject>;
}

export interface SectionUserType extends UserColumnType {
  id: string;
  allocations: Array<TeamMemberAllocation>;
  timeOffs: Array<{
    weekStart: Date;
    weekEnd: Date;
    capacity: number;
  }>;
}
export interface ResourceAllocationSectionsType {
  id: string;
  label: string;
  users: SectionUserType[];
}
export type ActiveHeadType = {
  orderBy: string;
  order: 'desc' | 'asc';
};

export type NewAssignmentFormValues = {
  startDate: string;
  endDate: string;
  job_role: string;
  totalAllocation: number;
};

export type GetUserAvailabilityParams = {
  timeFrameStartDate: string;
  timeFrameEndDate: string;
  userId: string;
};

export type BulkHandleAssignmentsChangesParams = {
  isCollaborator: boolean;
  updatedAssignments: ParticipantAssignment[];
  deletedAssignments: ParticipantAssignment[];
  addedParticipantAssignments: ParticipantAssignment[];
  projectId: string;
  userId: string;
};

export interface Organization {
  organizationData: {
    businessTeams: BusinessTeam[];
    learningTeams: LearningTeam[];
    projectCategories: ProjectCategory[];
    projectVendors: ProjectVendor[];
    users: User[];
    license_tier: License['license_tier'];
    license_number: number;
    id: string;
    settings: OrganizationSettings;
    company_name: string;
  };
  status: Status;
}

export interface OrganizationSettings {
  teamRequestsTab?: boolean;
  platformCurrency?: string;
  intakePortalName?: string;
}
