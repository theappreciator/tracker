import Layout from '../../../../components/layout'
import { withIronSessionSsr } from "iron-session/next";
import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE, ironSessionCookieOptions } from '../../../../constants'
import { useEffect, useState } from 'react'
import { GlobalContext } from '../../../../src/context'
import { useRouter } from 'next/router'
import ThingGroupContainer from '../../../../src/components/ThingGroupContainer'
import { ActionType, IDateThingGroup } from '../../../../types';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, ListSubheader, Typography, IconButton, Skeleton, useTheme } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { getQueryParamNumber } from '../../../../util/query';
import { getTimeStringCorrectedForTimezone } from '../../../../util/date';
import AddIcon from '@mui/icons-material/Add';
import YesNoIcon from '../../../../src/components/Icons/YesNoIcon';
import format from 'date-fns/format'
import { generateSkeletonDateGroupThings } from '../../../../util/generators/dateGroupThing';


const getThingsAndActions = async (thingId: number): Promise<IDateThingGroup[]> => {
  const response = await fetch(`/api/thing/${thingId}?days=7`);
  const things: IDateThingGroup[] = await response.json();
  return things;
}

export default function ThingDetailPage(
  {
  }: {
  }
  ) {

    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [dateThingGroups, setDateThingGroups] = useState<IDateThingGroup[]>([]);
    const router = useRouter();

    useEffect(() => {
      (async () => {
        const thingId = getQueryParamNumber(router.query.id);
        if (thingId) {
          setIsLoading(true);
          const newDateThingGroups = await getThingsAndActions(thingId);
          setDateThingGroups(newDateThingGroups);
          setIsLoading(false);
        }
      })();
    }, []);

    const skeletonItems = generateSkeletonDateGroupThings(1);
    const showSkeleton = isLoading;

    const itemsToDisplay = isLoading ? skeletonItems : dateThingGroups;

    return (
      <Layout loggedIn backUrl='/'>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <List sx={{ marginTop: "1rem" }}>
            {itemsToDisplay.map((d, i) => {
              const isCountable = d.groups.find(g => true)?.things.find(t => true)?.actions.find(a => true)?.type === ActionType.count;
              const totalForDate = d.groups.map(g => g.things.map(t => typeof t.count === "number" ? t.count : 0).reduce((prev, cur) => prev + cur, 0)).reduce((prev, cur) => prev + cur, 0);
              const goalForDate = d.groups.find(g => true)?.things.find(t => true)?.goal;
              const isSuccess = goalForDate ? totalForDate >= goalForDate: false;
              return (
                <>
                  <nav aria-label={`list for ${d.date}`}>
                    {showSkeleton && <Skeleton animation="pulse" width={"15rem"} height={"2.75rem"}/>}
                    {!showSkeleton && (
                      <ListSubheader sx={{ backgroundColor: theme.palette.grey[200], borderRadius: "0.5rem", paddingTop: "0.4rem", paddingBottom: "0.4rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                            <Typography sx={{ flexGrow: 1, fontWeight: 700, color:theme.palette.grey[900] }}>
                              {format(new Date(d.date), 'EEEE, MMMM d')}
                            </Typography>
                          {isCountable && <YesNoIcon actionValue={isSuccess ? 1 : -1} placement="button" />}
                          {isCountable && (
                            <Typography sx={{ fontWeight: 700, color:theme.palette.grey[900] }}>
                              {totalForDate}/{goalForDate}
                            </Typography>
                          )}
                        </Box>
                      </ListSubheader>
                    )}
                    {d.groups.map(g => g.things.map(t => (
                      <>
                        {showSkeleton && <Skeleton animation="pulse" width="10rem" height="2rem"/>}
                        {!showSkeleton && (
                          <ListItem disablePadding>
                            <ListItem sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                              <Typography sx={{ flexGrow: 1, color:theme.palette.grey[900] }}>
                                {`${t.dateTime ? getTimeStringCorrectedForTimezone(new Date(t.dateTime), DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE) : 'n/a'}`}
                              </Typography>
                              <Typography>
                                {t.count}
                              </Typography>
                            </ListItem>
                          </ListItem>
                        )}
                      </>
                    )))}
                  </nav>
                </>
              );
            })}
          </List>
        </Box>
      </Layout>
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

        },
      };
    }, ironSessionCookieOptions
  );