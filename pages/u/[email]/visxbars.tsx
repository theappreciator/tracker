import { useRouter } from "next/router";
import { IDateThingGroup, IThing } from "../../../types";
import BarChart from "./BarChart";
import { useEffect, useState } from "react";
import { getQueryParamNumber } from "../../../util/query";
import { DEFAULT_DAYS_BACK } from "../../../constants";
import cityTemperature, { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';
import { GlobalContext } from "../../../src/context";
import Layout from "../../../components/layout";


const getThingsAndActions = async (days: number): Promise<IDateThingGroup[]> => {
  const response = await fetch(`/api/thing?days=${days}`);
  const things: IDateThingGroup[] = await response.json();
  return things;
}

export default function VisxBarChart() {

  const defaultData1 = [
    {
      label: 'Happy',
      value: 4000,
    },
    {
      label: 'Sad',
      value: 2000,
    },
    {
      label: 'Angry',
      value: 3000,
    },
    {
      label: 'Joyful',
      value: 4500,
    },
    {
      label: 'Anxious',
      value: 7000,
    },
  ];

  type CityName = 'New York' | 'San Francisco' | 'Austin';
  const cityData = cityTemperature.slice(0, 8);
  const cityKeys = Object.keys(cityData[0]).filter((d) => d !== 'date') as CityName[];


  const router = useRouter();
  const selectedDays = getQueryParamNumber(router.query.days) || DEFAULT_DAYS_BACK;
  const [thingsAndActions, setThingsAndActions] = useState<IDateThingGroup[]>()

  useEffect(() => {
    (async () => {
      const datesAndThings = await getThingsAndActions(selectedDays);
      setThingsAndActions(datesAndThings);
    })();

  }, [selectedDays]);

  const sliceOfThings = thingsAndActions?.map(ta => {
    return {
      date: ta.date,
      things: ta.groups.map(g => {
        return {
          ...g,
          things: g.things.filter(t => t.actions.some(a => a.type === 'count'))
        }
      }).reduce((acc, cur) => acc = acc.concat(cur.things), [] as IThing[])
    }
  }).map(g => {
    return {
      date: g.date,
      ...g.things.reduce((acc, cur) => {
        acc[cur.thingName] = cur.count;
        return acc;
      }, {} as { [index: string]: number })
    }
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  console.log(thingsAndActions);

  return (
    <Layout loggedIn>
      <article>
        <div>
          Your performance past {selectedDays} days
          <hr/>
          {thingsAndActions && (
            <BarChart
              thingData={sliceOfThings}
              width={600}
              height={400}
            />
          )}
        </div>
      </article>
    </Layout>
  )
}