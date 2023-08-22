import { Card, CardHeader, Typography, CardActions } from "@mui/material";
import { IThing } from "../../../types";

export default function ThingForAction(
{
  children,
  thing
}: {
  children: React.ReactNode
  thing: IThing
}
) {  
  return (
    <Card sx={{ backgroundColor: "#eeeeee" }}>
      <CardHeader
        title={thing.thingName}
        action={
          <Typography sx={{ fontSize: "4rem" }} color="#333">
            {thing.count}
          </Typography>
        }
        subheader={thing.groupName}
      />
      <CardActions>
        {children}
      </CardActions>
    </Card>
  )
}