import Layout from '../../../components/layout'
import { withIronSessionSsr } from "iron-session/next";
import { ironSessionCookieOptions } from '../../../constants'
import { useEffect, useState } from 'react'
import { GlobalContext } from '../../../src/context'
import { useRouter } from 'next/router'
import ThingGroupContainer from '../../../src/components/ThingGroupContainer'
import { IDateThingGroup } from '../../../types';

const getThingsAndActions = async (): Promise<IDateThingGroup[]> => {
  const response = await fetch('/api/thing');
  const things: IDateThingGroup[] = await response.json();
  return things;
}

export default function UserDashboard(
  {
  }: {
  }
  ) {

    const [didFirstLoad, setDidFirstLoad] = useState(false);
    const [dateThingGroups, setDateThingGroups] = useState<IDateThingGroup[]>([]);
    const [needsReload, setNeedsReload] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (needsReload) {

        (async () => {
          const newDateThingGroups = await getThingsAndActions();
          setDateThingGroups(newDateThingGroups);
          setNeedsReload(false);
          setDidFirstLoad(true);
        })();
      }
    }, [needsReload]);

    return (
      <GlobalContext.Provider value={{needsReload, didFirstLoad, setNeedsReload}}>
        <Layout loggedIn>
          <article>
            <ThingGroupContainer
              dateThingGroups={dateThingGroups}
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

        },
      };
    }, ironSessionCookieOptions
  );