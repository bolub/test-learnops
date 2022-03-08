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
};

export interface Request {
  updatedAt?: any;
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
}

export interface RequestQuestion {
  id: string;
  data: {
    value: any | string;
    label: string;
    isRequired?: boolean;
  };
  section: typeof REQUEST_SECTIONS[keyof typeof REQUEST_SECTIONS];
}

export interface intakeQuestionWrapper {
  question: RequestQuestion;
  className?: string;
  handler: (
    question: any,
    value: string | boolean | number | Array<PickerFileMetadata>,
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
  requestQuestions: { [key: string]: object };
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

export type FormOption = { label: string; value: string };

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
  projectNumber?: string;
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
  priority: string;
  owners: (String | undefined)[];
  resourcing_type?: string;
  estimatedEffort?: string;
  budget_source?: string;
  estimated_cost?: string;
  allocated_budget?: string;
  health?: string;
  hold_reason?: string;
  data?: object;
  organization_id?: String | undefined;
  actual_cost?: number;
  actual_time_spent?: number;
  finalComments?: string;
  closedDate?: string | null;
  tasksOrdering?: string[];
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
interface ProjectFileMetadata
  extends Omit<
    PickerFileMetadata,
    'originalPath' | 'size' | 'source' | 'uploadId'
  > {
  originalPath?: string;
  size?: number;
  source?: string;
  uploadId?: string;
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
  budget_source: string | undefined;
  allocated_budget: string | undefined;
}

export interface ResourcePlanType {
  resourcing_type: string | undefined;
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
