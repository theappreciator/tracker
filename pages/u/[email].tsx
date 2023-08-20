import Layout from '../../components/layout'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticProps, GetStaticPaths, NextPageContext } from 'next'
import { withIronSessionSsr } from "iron-session/next";
import { ironSessionCookieOptions } from '../../constants'
import { ThingActionRecord, CookieUser, ThingRecord } from '../../types'
import { getTodayThingsForUser } from '../../lib/things'
import { convertToDatesOfGroupsOfThings } from '../../util/things'
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Grid, IconButton, Typography } from '@mui/material'
import { getActionsForThings } from '../../lib/actions'
import { useEffect, useMemo, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { red } from '@mui/material/colors'
import ThingForAction from '../../src/components/ThingForAction'
import ThingsForDate from '../../src/components/ThingsForGroup'
import { GlobalContext } from '../../src/context'
import { useRouter } from 'next/router'
import ThingGroupContainer from '../../src/components/ThingGroupContainer'
import { getIronSession } from 'iron-session'
import thing from '../api/thing'

const getThingsAndActions = async (): Promise<{things: ThingRecord[], actionsForThings: ThingActionRecord[]}> => {
  const response = await fetch('/api/thing');
  const json = await response.json();

  const things = json.things || [];
  const actionsForThings = json.actionsForThings || [];
  return {
    things,
    actionsForThings,
  }
}

const getActions = async (thingIds: number[]): Promise<ThingActionRecord[]> => {
  console.log("Getting actions for things", thingIds);
  const response = await fetch('/api/action?' + new URLSearchParams(
    {
      'thingId[]': thingIds.map(t => t.toString()).join(',')
    }
  ));
  const json = await response.json();
  console.log("just got actions json");
  console.log(json);
  if (Array.isArray(json)) {
    return json;
  }
  return [];
}

export default function UserDashboard(
  {
  }: {
  }
  ) {

    const [didFirstLoad, setDidFirstLoad] = useState(false);
    const [things, setThings] = useState<ThingRecord[]>([]);
    const [actionsForThings, setActionsForThings] = useState<ThingActionRecord[]>([]);
    const [needsReload, setNeedsReload] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (needsReload) {

        (async () => {
          const thingsAndActions = await getThingsAndActions();
          setThings(thingsAndActions.things);
          setActionsForThings(thingsAndActions.actionsForThings);
          setNeedsReload(false);
          setDidFirstLoad(true);
        })();
      }
    }, [needsReload]);

    const thingsByGroupAndDate = convertToDatesOfGroupsOfThings(things);

    return (
      <GlobalContext.Provider value={{needsReload, didFirstLoad, setNeedsReload}}>
        <Layout loggedIn>
          <article>
            <ThingGroupContainer
              thingsByGroupAndDate={thingsByGroupAndDate}
              actionsForThings={actionsForThings}
            ></ThingGroupContainer>
          </article>
        </Layout>
      </GlobalContext.Provider>
    )
  }
  
  export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps(context) {
      const { req, query } = context;
      const cookiedUser = req.session.user;
      const requestedEmail = typeof query.email === 'string' ? query.email : undefined;
  
      if (!cookiedUser?.email || !requestedEmail || cookiedUser.email.toLowerCase() !== requestedEmail.toLowerCase()) {
        return {
          redirect: {
            destination: '/u',
            permanent: false
          }
        };
      }
  
      return {
        props: {
          actionsForThings: []
        },
      };
    }, ironSessionCookieOptions
  );