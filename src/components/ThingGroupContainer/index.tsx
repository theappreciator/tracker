import { Skeleton } from "@mui/material";
import ThingsForGroup from "../ThingsForGroup";
import { ThingsByGroupAndDate } from "../../../util/things";
import { useGlobalContext } from "../../context";
import { ThingActionRecord, ThingRecord } from "../../../types";


export default function ThingForAction(
{
  children,
  thingsByGroupAndDate,
  actionsForThings,
}: {
  children?: React.ReactNode
  thingsByGroupAndDate: ThingsByGroupAndDate[],
  actionsForThings: any
}
) {  

  const { didFirstLoad } = useGlobalContext();
  const showSkeleton = !didFirstLoad;

  const skeletonThings: ThingRecord[] = [
    {
      userId: 1,
      thingId: 1,
      groupName: 'skeleton',
      thingName: 'skeleton',
      date: '2023/08/18',
      count: 1,
      constructor: undefined as unknown as { name: "RowDataPacket" } & Function,
    },
    {
      userId: 1,
      thingId: 2,
      groupName: 'skeleton',
      thingName: 'skeleton',
      date: '2023/08/18',
      count: 1,
      constructor: undefined as unknown as { name: "RowDataPacket" } & Function,
    },
  ];

  const skeletonActions: ThingActionRecord[] = [
    {
      thingId: 1,
      actionId: 1,
      name: "+1",
      value: 1,
      constructor: undefined as unknown as { name: "RowDataPacket" } & Function,
    },
    {
      thingId: 2,
      actionId: 2,
      name: "+1",
      value: 1,
      constructor: undefined as unknown as { name: "RowDataPacket" } & Function,
    }
  ]

  return (
    <>
      {thingsByGroupAndDate.map(g => {
        return (
          <div key={`date-${g.date}`}>
            {showSkeleton && <Skeleton animation="pulse"><h2>{g.date}</h2></Skeleton>}
            {!showSkeleton && <h2>{g.date}</h2>}
            <hr/>
            {showSkeleton && (
              <ThingsForGroup
                key={`skeleton-group`}
                groupName={'skeleton'}
                things={skeletonThings}
                actionsForThings={skeletonActions}
              />
            )}
            {!showSkeleton && g.groupsOfThings.map(tg => {
              const groupKey = `group-${tg.groupName}`;
              return (
                <ThingsForGroup
                  key={groupKey}
                  groupName={tg.groupName}
                  things={tg.things}
                  actionsForThings={actionsForThings}
                />
              )
            })}
          </div>
        );
      })}
    </>
  )
}
