import Layout from '../../../components/layout'
import { withIronSessionSsr } from "iron-session/next";
import { ironSessionCookieOptions } from '../../../constants'
import { useContext, useEffect, useMemo, useState } from 'react'
import { GlobalContext } from '../../../src/context'
import { useRouter } from 'next/router'
import ThingGroupContainer from '../../../src/components/ThingGroupContainer'
import { IDateThingGroup, IThing } from '../../../types';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { GradientSteelPurple } from '@visx/gradient';
import letterFrequency, { LetterFrequency } from '@visx/mock-data/lib/mocks/letterFrequency';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { LegendOrdinal } from "@visx/legend";
import { scaleThreshold } from '@visx/scale';


import _ from 'lodash';
import {
  Axis, // any of these can be non-animated equivalents
  Grid,
  LineSeries,
  XYChart,
  Tooltip,
  DataContext,
} from '@visx/xychart';

import {
  TickLabelProps
} from '@visx/axis';

const data1 = [
  { x: '2020-01-01', y: 50 },
  { x: '2020-01-02', y: 10 },
  { x: '2020-01-03', y: 20 },
];

const data2 = [
  { x: '2020-01-01', y: 30 },
  { x: '2020-01-02', y: 40 },
  { x: '2020-01-03', y: 80 },
];

const accessors = {
  xAccessor: (d: {x: string, y: number}) => d.x,
  yAccessor: (d: {x: string, y: number}) => d.y,
};

const thingGroupAccessors = {
  xAccessor: (d: IThing) => d.date,
  yAccessor: (d: IThing) => d.count,
}

const purple1 = '#6c5efb';
const purple2 = '#c998ff';
const purple3 = '#a44afe';
const red = 'f00';
const colorScale = scaleOrdinal<string, string>({
  domain: ['Squats', 'Pushups', 'Jumping Jacks', 'Lunges'],
  range: [purple1, purple2, purple3, red],
});

const getThingsAndActions = async (): Promise<IDateThingGroup[]> => {
  const response = await fetch('/api/thing');
  const things: IDateThingGroup[] = await response.json();
  return things;
}

export default function UserVisualizations(
  {
  }: {
  }
  ) {
    
    const [thingsAndActions, setThingsAndActions] = useState<IDateThingGroup[]>()
    useEffect(() => {

      (async () => {
        const datesAndThings = await getThingsAndActions();
        setThingsAndActions(datesAndThings);
      })();

    }, []);

    const allTheThings: IThing[] = [];
    thingsAndActions?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    thingsAndActions?.forEach(d => {
      d.groups.forEach(g => {
        g.things.forEach(t => {
          allTheThings.push(t);
        });
      });
    });
    const groupedAllTheThings = _(allTheThings)
    .groupBy(t => t.thingId)
    .map((thingValueArray, thingKey) => {
      return {
        thingId: parseInt(thingKey),
        thingName: (thingValueArray.find(t => t.thingId.toString() === thingKey) as IThing).thingName,
        things: thingValueArray
      }
    })
    .value();

    // console.log(data);
    console.log(thingsAndActions);
    console.log(allTheThings);
    console.log(groupedAllTheThings);

    const width = 600;
    const height = 600;
    const events = true;


    const [didFirstLoad, setDidFirstLoad] = useState(false);
    const [dateThingGroups, setDateThingGroups] = useState<IDateThingGroup[]>([]);
    const [needsReload, setNeedsReload] = useState(true);
    const router = useRouter();

    const tickLabelProps: TickLabelProps<any> = (tickValue, tickIndex) =>
    ({
      textAnchor: "start",
      angle: 45,
    } as const);
    
    return (
      <GlobalContext.Provider value={{needsReload, didFirstLoad, setNeedsReload}}>
        <Layout loggedIn>
          <article>
            <div>
              Your performance past 7 days
              <hr/>
              <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
                <Axis
                  orientation="bottom"
                  tickLabelProps={tickLabelProps}
                />
                <Grid columns={false} numTicks={4} />
                <Axis
                  orientation="left"
                  numTicks={4}
                />
                {groupedAllTheThings.map (g => {
                  return (
                    <LineSeries key={`line-${g.thingId}`} dataKey={g.thingName} data={g.things} {...thingGroupAccessors} />
                  )
                })}
                <LegendOrdinal
                  scale={colorScale}
                  direction="row" labelMargin="0 15px 0 0" 
                />
                <Tooltip
                  snapTooltipToDatumX
                  snapTooltipToDatumY
                  showVerticalCrosshair
                  showSeriesGlyphs
                  renderTooltip={({ tooltipData, colorScale }) => (
                    <div>
                      <div>
                        {tooltipData?.nearestDatum?.key}
                      </div>
                      {tooltipData?.nearestDatum?.datum ? (tooltipData?.nearestDatum?.datum as IThing).count : 0}
                    </div>
                  )}
                />
              </XYChart>
            </div>
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
