import { useMemo } from 'react';
import { useHistory } from 'react-router';
import { PATHS, USER_TYPES } from 'utils/constants';
import { RequestPageTabs } from 'utils/customTypes';
import { selectUserType } from 'state/User/userSlice';
import { useSelector } from 'react-redux';
import BasicDetailsButtons from './BasicDetailsButtons';
import RequestDetailsButtons from './RequestDetailsButtons';
import AditionalDetailsButtons from './AditionalDetailsButtons';
import LDOnlyButtons from './LDOnlyButtons';

export const FooterButtons = ({
  activeTabIndex,
  setActiveTabIndex,
  onSubmit,
  onUpdate,
  requestDataStatus,
  hasErrors,
}: {
  activeTabIndex: RequestPageTabs;
  setActiveTabIndex: (tabIndex: RequestPageTabs) => void;
  onSubmit: () => Promise<void>;
  onUpdate: () => Promise<void>;
  requestDataStatus: string;
  hasErrors: boolean;
}) => {
  const history = useHistory();
  const userType = useSelector(selectUserType);
  const isLDUser = useMemo(() => userType === USER_TYPES.L_D, [userType]);

  const onClickHandler = (value?: RequestPageTabs) => {
    if (value || value === 0) {
      setActiveTabIndex(value);
    }
  };

  const onCancel = () => {
    history.push(PATHS.REQUESTS_LIST_PAGE);
  };

  switch (activeTabIndex) {
    case 0:
      return (
        <BasicDetailsButtons
          requestStatus={requestDataStatus}
          onCancel={onCancel}
          onClickHandler={onClickHandler}
          onUpdate={onUpdate}
          hasErrors={hasErrors}
        />
      );
    case 1:
      return (
        <RequestDetailsButtons
          requestStatus={requestDataStatus}
          onClickHandler={onClickHandler}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onUpdate={onUpdate}
          hasErrors={hasErrors}
        />
      );
    case 2:
      return (
        <AditionalDetailsButtons
          onClickHandler={onClickHandler}
          onCancel={onCancel}
          onUpdate={onUpdate}
          hasErrors={hasErrors}
          isLDUser={isLDUser}
        />
      );
    case 3:
      return (
        <LDOnlyButtons
          onClickHandler={onClickHandler}
          onUpdate={onUpdate}
          onCancel={onCancel}
          hasErrors={hasErrors}
        />
      );
    default:
      return null;
  }
};

export default FooterButtons;
