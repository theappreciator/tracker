import { IconButton, Skeleton } from "@mui/material";
import ThingsForGroup from "../ThingsForGroup";
import { useGlobalContext } from "../../context";
import { IDateThingGroup, IThing, IThingGroup } from "../../../types";
import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getDateStringsInPastXDays, getTodayDateCorrectedForTimezone } from "../../../util/date";
import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE } from "../../../constants";
import { generateSkeletonDateGroupThings } from "../../../util/generators/dateGroupThing";


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

  if (showSkeleton) {
    dateThingGroups = generateSkeletonDateGroupThings()
  }

  const router = useRouter();

  return (
    <>
      {dateThingGroups.map(d => {
        return (
          <Fragment key={`date-${d.date}`}>
            {showSkeleton && <Skeleton animation="pulse"><h2>{d.date}</h2></Skeleton>}
            {!showSkeleton && (
              <h2>
                {d.date}
              </h2>
            )}
            <hr/>
            {d.groups.map((g, i) => {
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
