import React from 'react';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import cityTemperature, { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from '@visx/vendor/d3-time-format';

export type BarGroupProps = {
  thingData?: {
    date: string;
    [key: string]: string | number
  }[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

export default function Example({
  thingData = [],
  width,
  height,
  events = false,
  margin = defaultMargin,
}: BarGroupProps) {

  type CityName = 'New York' | 'San Francisco' | 'Austin';
  type WorkoutName = 'Pushups' | 'Jumping Jacks';

  const blue = '#aeeef8';
  const green = '#e5fd3d';
  const purple = '#9caff6';
  const background = '#612efb';

  // const data = cityTemperature.slice(0, 8);
  console.log(thingData);
  const keyThing = thingData[0];
  if (!keyThing) {
    return null;
  }
  const keys = Object.keys(keyThing).filter((d) => d !== 'date') as WorkoutName[];

  const parseDate = timeParse('%Y-%m-%d');
  const format = timeFormat('%b %d');
  const formatDate = (date: string) => format(parseDate(date) as Date);

  // accessors
  const getDate = (d: any) => d.date;

  // scales
  const dateScale = scaleBand<string>({
    domain: thingData.map(getDate),
    padding: 0.2,
  });
  const cityScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });
  const tempScale = scaleLinear<number>({
    domain: [0, Math.max(...thingData.map((d: any) => Math.max(...keys.map((key) => Number(d[key])))))],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [blue, green, purple],
  });

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale output dimensions
  dateScale.rangeRound([0, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  tempScale.range([yMax, 0]);

  // console.log(thingData);
  // console.log(data);

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Group top={margin.top} left={margin.left}>
        <BarGroup
          data={thingData}
          keys={keys}
          height={yMax}
          x0={getDate}
          x0Scale={dateScale}
          x1Scale={cityScale}
          yScale={tempScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => (
              <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                {barGroup.bars.map((bar) => (
                  <rect
                    key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={4}
                    onClick={() => {
                      if (!events) return;
                      const { key, value } = bar;
                      alert(JSON.stringify({ key, value }));
                    }}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>
      </Group>
      <AxisBottom
        top={yMax + margin.top}
        tickFormat={formatDate}
        scale={dateScale}
        stroke={green}
        tickStroke={green}
        numTicks={20}
        hideAxisLine
        tickLabelProps={{
          fill: green,
          fontSize: 11,
          textAnchor: 'middle',
        }}
      />
    </svg>
  );
}