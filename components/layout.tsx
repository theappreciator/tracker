import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SettingsIcon from '@mui/icons-material/Settings';

import { title } from 'process'
import { useState } from 'react'
import SettingsDialog from '../src/components/Dialogs/SettingsDialog'

const name = 'Thing Tracker'
export const siteTitle = 'Next.js Sample Website'

export default function Layout({
  children,
  loggedIn
}: {
  children: React.ReactNode
  loggedIn?: boolean
}) {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = async (event: any) => {
    event.preventDefault();
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      }
    });
    const json = await response.json();
    window.location.href = `/u`; //TODO: change this to Next Router
  };

  const handleSettingsClick = () => {
    setShowSettingsDialog(true);
  }

  const handleSettingsSave = () => {

  }
  
  const handleSettingsCancel = () => {
    setShowSettingsDialog(false);
  }

  return (
    <>
      <SettingsDialog 
        isVisible={showSettingsDialog}
        onSave={handleSettingsSave}
        onCancel={handleSettingsCancel}
      />
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Let's track some things"
          />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <header className={styles.header}>
          <Container component="main" maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h4">
                {name}
                {loggedIn && (
                  <IconButton aria-label="delete" size="large" onClick={handleSettingsClick}>
                    <SettingsIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Typography>

            </Box>
          </Container>
        </header>
        <main>{children}</main>
        {loggedIn && (
          <div className={styles.backToHome}>
            <hr/>
            <Link href="/" onClick={handleLogout}>Logout</Link>
          </div>
        )}
      </div>
    </>
  )
}
