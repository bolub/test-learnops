import { configureStore } from '@reduxjs/toolkit';
import activeRequest from './ActiveRequest/activeRequestSlice';
import forms from './Forms/formSlice';
import inlineNotification from './InlineNotification/inlineNotificationSlice';
import requestsState from './Requests/requestSlice';
import projectsState from './Projects/projectsSlice';
import project from './Project/projectSlice';
import projectComments from './ProjectComments/projectCommentsSlice';
import currentUser from './User/userSlice';
import requestComments from './RequestComments/requestCommentsSlice';
import users from './UsersManagement/usersManagementSlice';
import teams from './Teams/teamsSlice';
import organization from './Organization/organizationSlice';
import processes from './Processes/processesSlice';
import notifications from './Notifications/notificationsSlice';
import timeOff from './TimeOff/TimeOffSlice';
import singleTask from './SingleTask/singleTaskSlice';
import tasks from './Tasks/taskSlice';
import vendors from './Vendors/vendorsSlice';
import businessTeams from './BusinessTeams/businessTeamsSlice';
import learningTeams from './LearningTeams/learningTeamsSlice';
import budgets from './Budget/budgetSlice';

export const store = configureStore({
  reducer: {
    activeRequest,
    businessTeams,
    learningTeams,
    currentUser,
    forms,
    inlineNotification,
    notifications,
    organization,
    project,
    projectsState,
    projectComments,
    requestComments,
    requestsState,
    singleTask,
    tasks,
    teams,
    timeOff,
    users,
    processes,
    vendors,
    budgets,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
