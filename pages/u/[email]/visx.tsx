import Layout from '../../../components/layout'
import { withIronSessionSsr } from "iron-session/next";
import { DEFAULT_DAYS_BACK, ironSessionCookieOptions } from '../../../constants'
import { useContext, useEffect, useMemo, useState } from 'react'
import { GlobalContext } from '../../../src/context'
import { useRouter } from 'next/router'
import ThingGroupContainer from '../../../src/components/ThingGroupContainer'
import { ActionType, IDateThingGroup, IThing } from '../../../types';
import { GradientSteelPurple } from '@visx/gradient';
import letterFrequency, { LetterFrequency } from '@visx/mock-data/lib/mocks/letterFrequency';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { LegendOrdinal } from "@visx/legend";
import { scaleThreshold } from '@visx/scale';
import { GlyphSquare } from '@visx/glyph';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { Bar } from '@visx/shape'




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
import { getQueryParamNumber, getQueryParamString } from '../../../util/query';

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
const red = '#f00';
const green = '#0f0';
const blue = '#00f';
const pink = '#f0f';

const getThingsAndActions = async (days: number): Promise<IDateThingGroup[]> => {
  const response = await fetch(`/api/thing?days=${days}`);
  const things: IDateThingGroup[] = await response.json();
  return things;
}

export default function UserVisualizations(
  {
  }: {
  }
  ) {
    
    const router = useRouter();
    const [selectedDays, setSelectedDays] = useState(getQueryParamNumber(router.query.days) || DEFAULT_DAYS_BACK);
    const [thingsAndActions, setThingsAndActions] = useState<IDateThingGroup[]>()
    useEffect(() => {

      (async () => {
        const datesAndThings = await getThingsAndActions(selectedDays);
        setThingsAndActions(datesAndThings);
      })();

    }, []);

    const allTheThings: IThing[] = [];
    thingsAndActions?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    thingsAndActions?.forEach(d => {
      d.groups.forEach(g => {
        g.things.forEach(t => {
          if (t.actions.length > 0 && t.actions[0].type === ActionType.count) {
            allTheThings.push(t);
          }
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
    const height = 400;
    const events = true;


    const [didFirstLoad, setDidFirstLoad] = useState(false);
    const [dateThingGroups, setDateThingGroups] = useState<IDateThingGroup[]>([]);
    const [needsReload, setNeedsReload] = useState(true);

    const colorScaleDualPolar = scaleOrdinal<string, string>({
      domain: groupedAllTheThings.map(g => g.thingName),
      range: [
        "#9fdd98",
        "#00b89b",
        "#008dab" ,
        "#005eac"
      ]
    });
    const threshold = scaleThreshold({
      domain: [0.02, 0.04, 0.06, 0.08, 0.1],
      range: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'],
    });

    const tickLabelProps: TickLabelProps<any> = (tickValue, tickIndex) =>
    ({
      textAnchor: "end",
      angle: 315,
      dx: 3
    } as const);

    const background = '#eaedff';
    
    return (
      <GlobalContext.Provider value={{needsReload, didFirstLoad, setNeedsReload}}>
        <Layout loggedIn>
          <article>
            <div>
              Your performance past {selectedDays} days
              <hr/>
              <XYChart
                height={height}
                xScale={{ type: 'band' }}
                yScale={{ type: 'linear' }}
                margin={{ top: 30, right: 30, bottom: 100, left: 50 }}
              >
                <Axis
                  orientation="bottom"
                  tickLabelProps={tickLabelProps}
                  stroke={'#ccc'}
                />
                <Grid
                  columns={false}
                  numTicks={6}
                  strokeDasharray={2 as unknown as string}
                />
                <Axis
                  orientation="left"
                  numTicks={4}
                  stroke={'#ccc'}
                />
                {groupedAllTheThings.map (g => {
                  return (
                    <LineSeries
                      colorAccessor={colorScaleDualPolar}
                      key={`line-${g.thingId}`}
                      dataKey={g.thingName}
                      data={g.things}
                      {...thingGroupAccessors}
                    />
                  )
                })}
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
                      <div>
                        {(tooltipData?.nearestDatum?.datum as IThing).date}
                      </div>
                      Count: {tooltipData?.nearestDatum?.datum ? (tooltipData?.nearestDatum?.datum as IThing).count : 0}
                    </div>
                  )}
                />
              </XYChart>
              <LegendOrdinal
                  scale={colorScaleDualPolar}
                  direction="row" labelMargin="0 15px 0 0" 
                />
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
