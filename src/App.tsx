import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import en from 'lang/en.json';
import { Theme } from '@getsynapse/design-system';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppPage from 'Templates/AppPage';
import { PATHS } from 'utils/constants';
import AuthPage from 'Templates/AuthPage';
import Login from 'Pages/Login/Login';
import ForgotPassword from 'Pages/ForgotPassword/ForgotPassword';
import ChangePassword from 'Pages/ChangePassword/ChangePassword';
import SSOAuthentication from 'Pages/SSOAuthentication/SSOAuthentication';
import { initAuthentication } from './aws-exports';
import DeactivatedAccountPage from 'Pages/DeactivatedAccountPage/DeactivatedAccountPage';
import PasswordSetup from 'Pages/PasswordSetup/PasswordSetup';
import VerifyUser from 'Pages/VerifyUser/VerifyUser';

const App = () => {
  const [initDone, setInitDone] = useState<boolean>(false);

  useEffect(() => {
    const loadLocales = async () =>
      await intl.init({
        currentLocale: 'en',
        locales: {
          en,
        },
      });

    loadLocales();
    initAuthentication();
    setInitDone(true);
  }, []);

  if (!initDone) {
    return null;
  }

  return (
    <Theme>
      <Router>
        <Switch>
          <Route path={PATHS.LOGIN}>
            <AuthPage>
              <Login />
            </AuthPage>
          </Route>

          <Route
            path={[
              PATHS.SSO_AUTHENTICATION_PAGE,
              PATHS.SSO_AUTHENTICATION_CALLBACK,
            ]}
          >
            <SSOAuthentication />
          </Route>

          <Route path={PATHS.DEACTIVATED_ACCOUNT}>
            <AuthPage className='w-102'>
              <DeactivatedAccountPage />
            </AuthPage>
          </Route>

          <Route path={PATHS.FORGOT_PASSWORD}>
            <AuthPage>
              <ForgotPassword />
            </AuthPage>
          </Route>

          <Route path={PATHS.CHANGE_PASSWORD}>
            <AuthPage>
              <ChangePassword />
            </AuthPage>
          </Route>

          <Route path={`${PATHS.PASSWORD_SETUP}/:userId`}>
            <AuthPage>
              <PasswordSetup />
            </AuthPage>
          </Route>

          <Route path={PATHS.VERIFY_USER}>
            <AuthPage>
              <VerifyUser />
            </AuthPage>
          </Route>

          <Route path={PATHS.ROOT}>
            <AppPage />
          </Route>
        </Switch>
      </Router>
    </Theme>
  );
};

export default App;
