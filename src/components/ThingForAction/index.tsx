import { Card, CardHeader, Typography, CardActions, Box } from "@mui/material";
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

  const goalTracking = false;

  const getCountDisplay = () => {
    if (actionType === ActionType.count) {
      return (
        <>
          <Typography sx={{ fontSize: "4rem", textAlign: "right" }} color="#333">
            {thing.count}
          </Typography>
          {goalTracking && (
            <Box sx={{ backgroundColor: "#fcc", paddingRight: "0rem", textAlign: "right" }}>
              <Typography sx={{ fontSize: "1rem", lineHeight: "0rem", textAlign: "right" }} color="#333">
                /100
              </Typography>
            </Box>
          )}
        </>
      )
    }
    else if (actionType === ActionType.onoff) {
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