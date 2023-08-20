import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import Link from 'next/link'
import Date from '../../components/date'
import { GetStaticProps } from 'next'
import { Box, Button, Container, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import { withIronSessionSsr } from "iron-session/next";
import { ironSessionCookieOptions } from '../../constants'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import FormForUserPass from '../../src/components/FormForUserPass'
import LoginForm from '../../src/components/LoginForm'
import CreateAccountForm from '../../src/components/CreateAccountForm'

export default function UserLogin() {
  const handleToggleToCreate = async () => {
    setWantsToCreateAccount(true);
  };

  const handleToggleToLogin = async () => {
    setWantsToCreateAccount(false);
  };

  const [wantsToCreateAccount, setWantsToCreateAccount] = useState(false);

  return (
    <Layout>
      {wantsToCreateAccount && (
        <CreateAccountForm
          onSignInClick={handleToggleToLogin}
        />
      )}
      {!wantsToCreateAccount && (
        <LoginForm
          onCreateClick={handleToggleToCreate}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(context) {
    const { req, query } = context;
    const user = req.session.user;

    if (user?.email) {
      return {
        redirect: {
          destination: `/u/${user.email}`,
          permanent: false
        }
      };
    }

    return {
      props: {},
    };
  }, ironSessionCookieOptions
);
