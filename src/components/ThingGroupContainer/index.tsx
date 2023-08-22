import { Skeleton } from "@mui/material";
import ThingsForGroup from "../ThingsForGroup";
import { useGlobalContext } from "../../context";
import { IDateThingGroup, IThing } from "../../../types";
import { Fragment } from "react";


export default function ThingGroupContainer(
{
  children,
  dateThingGroups,
}: {
  children?: React.ReactNode
  dateThingGroups: IDateThingGroup[],
}
) {  

  const { didFirstLoad } = useGlobalContext();
  const showSkeleton = !didFirstLoad;

  const skeletonThings: IThing[] = [
    {
      thingId: 1,
      thingName: 'skeleton',
      groupName: 'skeleton',
      date: '2023/08/18',
      count: 0,
      actions: []
    },
    {
      thingId: 1,
      thingName: 'skeleton',
      groupName: 'skeleton',
      date: '2023/08/18',
      count: 0,
      actions: []
    }
  ];

  return (
    <>
      {dateThingGroups.map(d => {
        return (
          <Fragment key={`date-${d.date}`}>
            {showSkeleton && <Skeleton animation="pulse"><h2>{d.date}</h2></Skeleton>}
            {!showSkeleton && <h2>{d.date}</h2>}
            <hr/>
            {showSkeleton && (
              <ThingsForGroup
                key={`skeleton-group`}
                groupName={'skeleton'}
                things={skeletonThings}
              />
            )}
            {!showSkeleton && d.groups.map((g, i) => {
              const groupKey = `group-${g.groupName}`;
              return (
                <Fragment key={groupKey}>
                  {i > 0 && <hr/>}
                  <ThingsForGroup
                    groupName={g.groupName}
                    things={g.things}
                  />
                </Fragment>
              )
            })}
          </Fragment>
        );
      })}
    </>
  )
}
