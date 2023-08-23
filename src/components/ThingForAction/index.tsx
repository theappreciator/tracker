import { Card, CardHeader, Typography, CardActions } from "@mui/material";
import { ActionType, IThing } from "../../../types";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

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
      return (
      <Typography sx={{ fontSize: "4rem" }} color="#333">
        {thing.count}
      </Typography>
      )
    }
    else if (actionType === ActionType.onoff) {
      console.log(thing);
      console.log(thing.count);
      console.log(thing.count && thing.count > 0);
      if (thing.count && thing.count > 0) {
        return (
          <CheckIcon color="success" sx={{ fontSize: "4rem", lineHeight: "1.5rem", marginTop: "1.5rem" }}/>
        )
      }
      return (
        <DoNotDisturbAltIcon sx={{ fontSize: "4rem", lineHeight: "1.5rem", marginTop: "1.5rem" }}/>
      )
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