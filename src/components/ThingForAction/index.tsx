import { Card, CardHeader, Typography, CardActions, Box } from "@mui/material";
import { ActionType, IThing } from "../../../types";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

const colorForGoal = (thing: IThing) => {
  if (thing.goal === 0) {
    return "#333";
  }

  const percent = thing.count / thing.goal;

  if (percent >= 1) {
    return "#2e7d32";
  }
  else if (percent >= 0.8) {
    return "#94b058";
  }
  else if (percent >= 0.2) {
    return "#ED9F02";
  }
  else if (percent > 0) {
    return "#ed6c02";
  }
  else {
    return "#d32f2f";
  }
}

const CountWithGoals = (
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

const OnOffDisplay = (
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

  const getCountDisplay = () => {
    if (actionType === ActionType.count) {
      return <CountWithGoals thing={thing} />
    }
    else if (actionType === ActionType.onoff) {
      return <OnOffDisplay thing={thing} />
    }
    else {
      return <div>junk</div>
    }
  }

  return (
    <Card sx={{ backgroundColor: "#eeeeee" }}>
      <CardHeader
        title={thing.thingName}
        action={getCountDisplay()}
        subheader={thing.groupName}
      />
      <CardActions>
        {children}
      </CardActions>
    </Card>
  )
}