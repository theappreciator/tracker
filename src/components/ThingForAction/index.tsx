import { Card, CardHeader, Typography, CardActions, Box } from "@mui/material";
import { ActionSegmentFeeling, ActionType, IAction, IThing } from "../../../types";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import FeelingIcon from "../Icons/FeelingIcon";
import { getClosestNumber } from "../../../util/math";
import { COLOR_RANGE, INAPPLICABLE_TIER } from "../../../constants";
import { getTierCountsFromSegmentType, getTierCountsFromSegmentTypeMatchesActions } from "../../../util/thing";

const colorForGoal = (thing: IThing) => {
  if (thing.goal === 0) {
    return "#333";
  }

  const percent = Math.min(Math.floor(thing.count / thing.goal * 10), 10);

  return COLOR_RANGE[percent];
}

const SummaryCountWithGoals = (
  {
    children,
    thing,
  }: {
    children?: React.ReactNode,
    thing: IThing,
  }
) => {
  return (
    <>
      <Typography sx={{ fontSize: "4rem", textAlign: "right" }} color={colorForGoal(thing)}>
        {thing.count}
      </Typography>
      {thing.goal > 0 && (
        <Box sx={{ backgroundColor: "#fcc", paddingRight: "0rem", textAlign: "right" }}>
          <Typography sx={{ fontSize: "1rem", lineHeight: "0rem", textAlign: "right" }} color="#333">
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
  }: {
    children?: React.ReactNode,
    thing: IThing,
  }
) => {
  if (thing.count && thing.count > 0) {
    return (
      <CheckIcon color="success" sx={{ fontSize: "4rem", lineHeight: "1.5rem", marginTop: "1.5rem" }}/>
    )
  }
  return (
    <DoNotDisturbAltIcon sx={{ fontSize: "4rem", lineHeight: "1.5rem", marginTop: "1.5rem" }}/>
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
  }: {
    children?: React.ReactNode,
    thing: IThing,
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
  }: {
    children?: React.ReactNode,
    thing: IThing,
  }
) => {
  const tiers = getTierCountsFromSegmentTypeMatchesActions(thing);
  console.log(thing.actions);
  console.log(tiers);
  return (
    <Typography sx={{ fontSize: "2.5rem", lineHeight: "6rem", textAlign: "right" }} color={colorForGoal(thing)}>
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

  const getDisplay = () => {
    if (actionType === ActionType.count) {
      return <SummaryCountWithGoals thing={thing} />
    }
    else if (actionType === ActionType.onoff) {
      return <SummaryOnOffDisplay thing={thing} />
    }
    else if (actionType === ActionType.segmentSize) {
      return <SummarySegmentSize thing={thing} />
    }
    else if (actionType === ActionType.segmentFeeling) {
      return <SummarySegmentFeeling thing={thing} />
    }
    else {
      return <div>junk</div>
    }
  }

  return (
    <Card sx={{ backgroundColor: "#eeeeee" }}>
      <CardHeader
        title={thing.thingName}
        action={getDisplay()}
        subheader={thing.groupName}
      />
      <CardActions>
        {children}
      </CardActions>
    </Card>
  )
}