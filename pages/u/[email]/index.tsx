import Layout from '../../../components/layout'
import { withIronSessionSsr } from "iron-session/next";
import { ironSessionCookieOptions } from '../../../constants'
import { useEffect, useState } from 'react'
import { GlobalContext } from '../../../src/context'
import { IDateThingGroup } from '../../../types';
import ThingCardContainer from '../../../src/components/ThingCardContainer';
import { generateSkeletonDateGroupThings } from '../../../util/generators/dateGroupThing';

const getThingsAndActions = async (): Promise<IDateThingGroup[]> => {
  const response = await fetch('/api/thing');
  const things: IDateThingGroup[] = await response.json();
  return things;
}

export default function UserDashboardPage(
  {
  }: {
  }
  ) {

    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [thingIdLoading, setThingIdLoading] = useState<number>();
    const [didFirstLoad, setDidFirstLoad] = useState(false);
    const [dateThingGroups, setDateThingGroups] = useState<IDateThingGroup[]>([]);
    const [needsReload, setNeedsReload] = useState(true);

    const handleRefreshClick = async () => {
      const newDateThingGroups = await getThingsAndActions();
      setDateThingGroups(newDateThingGroups);
    }

    useEffect(() => {
      if (needsReload) {

        (async () => {
          if (!didFirstLoad) {
            setIsInitialLoading(true);
          }
          const newDateThingGroups = await getThingsAndActions();
          setDateThingGroups(newDateThingGroups);
          setNeedsReload(false);
          setDidFirstLoad(true);
          setIsInitialLoading(false);
          setThingIdLoading(undefined);
        })();
      }
    }, [needsReload]);

    const displayData = !isInitialLoading ? dateThingGroups : generateSkeletonDateGroupThings(2);

    return (
      <GlobalContext.Provider value={{isInitialLoading, needsReload, didFirstLoad, setNeedsReload, thingIdLoading, setThingIdLoading}}>
        <Layout loggedIn refreshAction={handleRefreshClick}>
          <article>
            {displayData.map(d => (
              <ThingCardContainer
                key={`date-${d.date}`}
                date={d.date}
                thingGroups={d.groups}
              />
            ))}
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

        },
      };
    }, ironSessionCookieOptions
  );