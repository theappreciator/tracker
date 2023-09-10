import styles from './ThingCardContainer.module.scss';
import { Grid, Skeleton } from "@mui/material";
import { useGlobalContext } from "../../context";
import { IThingGroup } from "../../../types";
import { Fragment } from "react";
import ThingCard from '../ThingCard';

export default function ThingCardContainer(
{
  children,
  date,
  thingGroups,
}: {
  children?: React.ReactNode
  date: string,
  thingGroups: IThingGroup[],
}
) {  

  const { isInitialLoading } = useGlobalContext();
  const showSkeleton = isInitialLoading;

  return (
    <Fragment key={`date-${date}`}>
      {showSkeleton && <Skeleton animation="pulse"><h2>{date}</h2></Skeleton>}
      {!showSkeleton && (
        <h2>
          {date}
        </h2>
      )}
      <hr/>
      {thingGroups.map((g, i) => {
        const groupKey = `group-${g.groupName}`;
        return (
          <Fragment key={groupKey}>
            {i > 0 && <hr/>}
            <Grid
              container
              spacing={2}
            >
              {g.things.length > 0 && g.things.map(t => (
                <ThingCard key={`date-${t.date}-group-${t.groupName}-thing-${t.thingId}`} thing={t} />
              ))}
            </Grid>
          </Fragment>
        )
      })}
    </Fragment>
  );
}