import { LoadingButton } from "@mui/lab";
import { Grid, Skeleton } from "@mui/material";
import ThingForAction from "../ThingForAction";
import { ThingActionRecord, ThingRecord } from "../../../types";
import ThingAction from "../ThingAction";
import { useGlobalContext } from "../../context";
import { startOfToday, isEqual } from 'date-fns'


export default function ThingsForGroup(
{
  children,
  groupName,
  things,
  actionsForThings,
}: {
  children?: React.ReactNode
  groupName: string,
  things: ThingRecord[],
  actionsForThings: ThingActionRecord[],
}
) {  

  const { didFirstLoad, setNeedsReload } = useGlobalContext();
  const showSkeleton = !didFirstLoad;
  
  const handleActionClick = async (thingId: number, count: number) => {
    const payload = {
      thingId,
      count
    }

    const success = await fetch('/api/history', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      setNeedsReload(true);
      console.log("Got a response!", response);

      if (response.status === 200) {
        return true;
      }
      else {
        return false;
      }
    })
    .catch(e => {
      console.error(`Error inserting into history! ${e}`);
      return false;
    });
  }

  return (
    <div>
        <Grid
            container
            spacing={2}
        >
            {!showSkeleton && things.length > 0 && things.map(t => {
                const thingKey = `thing-${t.thingId}`;
                const thingActions = actionsForThings.filter(a => a.thingId === t.thingId);
                const day = t.date.split('/')[2];
                const month = t.date.split('/')[1];
                const year = t.date.split('/')[0];
                const thingDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const isThingCountForToday = isEqual(thingDate, startOfToday());
                return (
                <Grid item key={thingKey} xs={12} sm={6}>
                  <ThingForAction thing={t}>
                    {isThingCountForToday && thingActions.map(a => {
                      const actionKey = `action-${t.thingId}-${a.actionId}`;
                      return (
                        <ThingAction
                          key={actionKey}
                          thingId={t.thingId}
                          actionValue={a.value}
                          onClick={handleActionClick}
                        >
                          {a.name}
                        </ThingAction>
                      )
                    })}
                  </ThingForAction>
                </Grid>
                );
            })}
            {showSkeleton && things.map(t => {
              const thingKey = `thing-${t.thingId}`;
              return (
                <Grid item key={thingKey} xs={12} sm={6}>
                  <Skeleton animation="wave" height={100}/>
                </Grid>
              );
            })}
        </Grid>
    </div>
  )
}
