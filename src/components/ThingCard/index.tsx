import styles from './ThingCard.module.scss';
import { Box, Card, CardActions, CardHeader, Grid, Skeleton, Theme, Typography, useTheme } from "@mui/material";
import { useGlobalContext } from "../../context";
import { ActionSegmentFeeling, ActionType, IThing } from "../../../types";
import Link from "next/link";
import {  isDateStrEqualToToday } from "../../../util/date";
import { COLOR_RANGE,  INAPPLICABLE_TIER } from "../../../constants";
import { getActionsType } from "../../../util/actions";
import ThingAction from "../ThingAction";
import { usePathname } from 'next/navigation';
import YesNoIcon from '../Icons/YesNoIcon';
import { getTierCountsFromSegmentType, getTierCountsFromSegmentTypeMatchesActions } from '../../../util/thing';
import { getClosestNumber } from '../../../util/math';
import FeelingIcon from '../Icons/FeelingIcon';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

const colorForGoal = (theme: Theme, thing: IThing) => {
  if (thing.goal === 0) {
    return theme.palette.grey[900];
  }

  const percent = Math.min(Math.floor(thing.count / thing.goal * 10), 10);

  return COLOR_RANGE[percent];
}

const SummaryCountWithGoals = (
  {
    children,
    thing,
    theme
  }: {
    children?: React.ReactNode,
    thing: IThing,
    theme: Theme
  }
) => {
  return (
    <>
      <Typography sx={{ fontSize: "4rem", textAlign: "right" }} color={colorForGoal(theme, thing)}>
        {thing.count}
      </Typography>
      {thing.goal > 0 && (
        <Box sx={{ paddingRight: "0rem", textAlign: "right" }}>
          <Typography sx={{ fontSize: "1rem", lineHeight: "0rem", textAlign: "right", color: theme.palette.grey[900] }}>
            {`/${thing.goal}`}
          </Typography>
        </Box>
      )}
    </>
  )
}

const SummaryOnOffDisplay = (
  {
    children,
    thing,
    theme
  }: {
    children?: React.ReactNode,
    thing: IThing,
    theme: Theme
  }
) => {
  return (
    <YesNoIcon actionValue={thing.count} placement="display" />
  )
}

const getAverageSegmentClamp = (thing: IThing) => {
  if (thing.count === 0) {
    return 0;
  }

  const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);

  const score = tier1 * 0 + tier2 * 1 + tier3 * 2;
  const maxScore = (tier1 + tier2 + tier3) * 2;
  const avg = score / maxScore * 100;

  // TODO this needs to be upated to work for segments other than 3
  const closest = getClosestNumber(avg, [0, 50, 100]);

  switch (closest) {
    case 0: 
      return ActionSegmentFeeling.Bad;
    case 50:
      return ActionSegmentFeeling.Neutral;
    case 100:
      return ActionSegmentFeeling.Good;
    default:
      return 0;
  }
};

const SummarySegmentFeeling = (
  {
    children,
    thing,
    theme
  }: {
    children?: React.ReactNode,
    thing: IThing,
    theme: Theme
  }
) => {
  return (
    <FeelingIcon actionValue={getAverageSegmentClamp(thing)} placement="display" />
  )
}

const SummarySegmentSize = (
  {
    children,
    thing,
    theme
  }: {
    children?: React.ReactNode,
    thing: IThing,
    theme: Theme
  }
) => {
  const tiers = getTierCountsFromSegmentTypeMatchesActions(thing);
  return (
    <Typography sx={{ fontSize: "2.5rem", lineHeight: "6rem", textAlign: "right" }} color={colorForGoal(theme, thing)}>
      {tiers.filter(t => t !== INAPPLICABLE_TIER).join('/')}
    </Typography>
  )
}

const SummaryLoading = (
  {
    children,
    theme
  }: {
    children?: React.ReactNode,
    theme: Theme
  }
) => {
  return (
    <LoadingButton loading={true} size='large' sx={{ height: "6rem", width: "4rem" }} />
  )
}

export default function ThingCard(
{
  children,
  thing,
}: {
  children?: React.ReactNode,
  thing: IThing,
}
) {  

  const { setNeedsReload, isInitialLoading, isIncrementalLoading, thingIdLoading, setThingIdLoading } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const showSkeleton = isInitialLoading;

  const pathname = usePathname()
  const theme = useTheme();

  const handleActionClick = async (thingId: number, count: number) => {
    const payload = {
      thingId,
      count
    }

    setIsLoading(true);
    setThingIdLoading(thingId);
    const success = await fetch('/api/history', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log("Inserted history!");
      setNeedsReload(true);
      setIsLoading(false);

      if (response.status === 200) {
        return true;
      }
      else {
        return false;
      }
    })
    .catch(e => {
      setIsLoading(false);
      console.error(`Error inserting into history! ${e}`);
      return false;
    });
  };

  const getDisplay = (thing: IThing) => {

    if (thingIdLoading === thing.thingId) {
      return <SummaryLoading theme={theme} />
    }

    const actionType = getActionsType(thing.actions);

    if (actionType === ActionType.count) {
      return <SummaryCountWithGoals thing={thing} theme={theme} />
    }
    else if (actionType === ActionType.onoff) {
      return <SummaryOnOffDisplay thing={thing} theme={theme}/>
    }
    else if (actionType === ActionType.segmentSize) {
      return <SummarySegmentSize thing={thing} theme={theme} />
    }
    else if (actionType === ActionType.segmentFeeling) {
      return <SummarySegmentFeeling thing={thing} theme={theme} />
    }
    else {
      return <div>junk</div>
    }
  };
  
  if (thing.actions.length > 0) {
    return (
      <Grid item xs={12} sm={6}>
        {showSkeleton && (
          <Skeleton animation="wave" height={100}/>
        )}
        {!showSkeleton && (
          <Link className={styles.thingItem} href={`${pathname}/thing/${thing.thingId}`}>
            <Card sx={{ backgroundColor: theme.palette.grey[200] }}>
              <CardHeader
                title={thing.thingName}
                action={getDisplay(thing)}
                subheader={thing.groupName}
              />
              <CardActions>
              {isDateStrEqualToToday(thing.date) && thing.actions.map(a => {
                const actionKey = `action-${thing.thingId}-${a.actionId}`;
                return (
                  <ThingAction
                    key={actionKey}
                    thing={thing}
                    action={a}
                    color={"secondary"}
                    onClick={handleActionClick}
                  />
                )
              })}
              </CardActions>
            </Card>
          </Link>
        )}
      </Grid>
    )
  }
  else {
    return null;
  }
}