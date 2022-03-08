import { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useSelector } from 'react-redux';
import { selectUserRole, selectUserType } from 'state/User/userSlice';
import design from 'assets/icons/design.svg';
import projects from 'assets/icons/projects.svg';
import { PATHS, USER_ROLES, USER_TYPES } from 'utils/constants';
import RenderLinks from 'Wrappers/LinkWrapper';

const SideNav = ({ isExpanded }: { isExpanded: boolean }) => {
  const userType = useSelector(selectUserType);
  const userRole = useSelector(selectUserRole);

  const sideBarTexts = useMemo(
    () => [
      {
        linkPath: PATHS.INSIGHTS,
        iconName: 'stats-chart',
        linkText: intl.get('SIDEBAR.INSIGHTS'),
        userType: [USER_TYPES.L_D],
        ariaLabel: intl.get('SIDEBAR.INSIGHTS'),
      },
      {
        linkPath: PATHS.REQUESTS_LIST_PAGE,
        iconName: 'hand-right',
        linkText: intl.get('SIDEBAR.INTAKE'),
        userType: [USER_TYPES.L_D, USER_TYPES.BUSINESS],
        ariaLabel: intl.get('SIDEBAR.INTAKE'),
      },
      {
        linkPath: PATHS.PROJECTS_LIST_PAGE,
        iconSrc: projects,
        linkText: intl.get('SIDEBAR.PROJECTS'),
        userType: [USER_TYPES.L_D],
        ariaLabel: intl.get('SIDEBAR.PROJECTS'),
      },
      {
        linkPath: PATHS.DESIGN,
        iconSrc: design,
        linkText: intl.get('SIDEBAR.DESIGN'),
        userType: [USER_TYPES.L_D],
        ariaLabel: intl.get('SIDEBAR.DESIGN'),
      },
      {
        linkPath: PATHS.TEAMS,
        iconName: 'people',
        linkText: intl.get('SIDEBAR.TEAMS'),
        userType: [USER_TYPES.L_D],
        ariaLabel: intl.get('SIDEBAR.TEAMS'),
      },
      {
        linkPath: PATHS.SETTINGS,
        iconName: 'settings',
        linkText: intl.get('SIDEBAR.SETTINGS'),
        userType: [USER_ROLES.ADMIN],
        ariaLabel: intl.get('SIDEBAR.SETTINGS'),
      },
    ],
    []
  );

  const sideBar = useMemo(
    () =>
      sideBarTexts.filter(
        (obj) =>
          obj.userType.includes(userType!) || obj.userType.includes(userRole!)
      ),
    [sideBarTexts, userRole, userType]
  );

  return (
    <nav className='space-y-2 flex-grow'>
      {sideBar.map((obj, index) => {
        return (
          <RenderLinks
            linkPath={obj.linkPath}
            iconSrc={obj.iconSrc}
            iconName={obj.iconName}
            linkText={obj.linkText}
            key={index}
            isExpanded={isExpanded}
            ariaLabel={obj.ariaLabel}
          />
        );
      })}
    </nav>
  );
};

export default SideNav;
