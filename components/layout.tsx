import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { AppBar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { title } from 'process'
import { useEffect, useState } from 'react'
import SettingsDialog from '../src/components/Dialogs/SettingsDialog'
import Script from 'next/script'
import PullToRefresh from 'pulltorefreshjs';


export const siteTitle = "Thing Tracker";
export const siteDescription = "Track your things";
export const siteDomain = "https://thingtracker.fly.dev";

export default function Layout({
  children,
  loggedIn,
  backUrl
}: {
  children: React.ReactNode
  loggedIn?: boolean,
  backUrl?: string
}) {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    PullToRefresh.init({
      mainElement: 'body',
      distMax: 100,
      distReload: 70,
      onRefresh: function(){ window.location.reload(); }
    });
  }, []);

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
      <header className={styles.header}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content={siteDescription}
          />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />


          <meta name="application-name" content={siteTitle} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={siteTitle} />
          <meta name="description" content={siteDescription} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/icons/browserconfig.xml" />
          <meta name="msapplication-TileColor" content={theme.palette.secondary.main} />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content={theme.palette.primary.main} />

          <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color={theme.palette.secondary.main} />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content={siteDomain} />
          <meta name="twitter:title" content={siteTitle} />
          <meta name="twitter:description" content={siteDescription} />
          <meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" />
          <meta name="twitter:creator" content="@DavidWShadow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={siteTitle} />
          <meta property="og:description" content={siteDescription} />
          <meta property="og:site_name" content={siteTitle} />
          <meta property="og:url" content={siteDomain} />
          <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" />

          <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
          <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' />

          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
          />

        </Head>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              {backUrl && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  href={backUrl}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Thing Tracker
              </Typography>
              {!backUrl && (
                <IconButton aria-label="delete" size="large" color="inherit" onClick={handleSettingsClick}>
                  <SettingsIcon fontSize="inherit" />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </header>
      <div className={styles.container}>
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
