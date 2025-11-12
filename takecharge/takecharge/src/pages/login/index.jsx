import React from 'react';
import { Helmet } from 'react-helmet';
import LoginBackground from './components/LoginBackground';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Sign In - TakeCharge EV Charging Network</title>
        <meta name="description" content="Sign in to your TakeCharge account to access EV charging stations, book slots, and manage your charging sessions." />
        <meta name="keywords" content="EV charging, electric vehicle, login, sign in, charging stations" />
        <meta property="og:title" content="Sign In - TakeCharge EV Charging Network" />
        <meta property="og:description" content="Access your EV charging account and find nearby charging stations." />
        <meta property="og:type" content="website" />
      </Helmet>

      <LoginBackground>
        <LoginHeader />
        <LoginForm />
      </LoginBackground>
    </>
  );
};

export default LoginPage;