import styles from './ThingForAction.module.scss';
import { Card, CardHeader, Typography, CardActions, Box, Theme, useTheme } from "@mui/material";
import { ActionSegmentFeeling, ActionType, IAction, IThing } from "../../../types";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import FeelingIcon from "../Icons/FeelingIcon";
import { getClosestNumber } from "../../../util/math";
import { COLOR_RANGE, INAPPLICABLE_TIER } from "../../../constants";
import { getTierCountsFromSegmentType, getTierCountsFromSegmentTypeMatchesActions } from "../../../util/thing";
import YesNoIcon from "../Icons/YesNoIcon";
import Link from "next/link";
import { usePathname } from 'next/navigation'


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

export default function ThingForAction(
{
  children,
  thing,
  actionType,
}: {
  children: React.ReactNode,
  thing: IThing,
  actionType: ActionType,
}
) {  

  const pathname = usePathname()
  const theme = useTheme();

  const getDisplay = () => {
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
  }

  return (
    <Link className={styles.thingItem} href={`${pathname}/thing/${thing.thingId}`}>
      <Card sx={{ backgroundColor: theme.palette.grey[200] }}>
        <CardHeader
          title={thing.thingName}
          action={getDisplay()}
          subheader={thing.groupName}
        />
        <CardActions>
          {children}
        </CardActions>
      </Card>
    </Link>
  )
}