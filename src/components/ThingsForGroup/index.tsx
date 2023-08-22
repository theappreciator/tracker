import { Grid, Skeleton } from "@mui/material";
import ThingForAction from "../ThingForAction";
import { IThing } from "../../../types";
import ThingAction from "../ThingAction";
import { useGlobalContext } from "../../context";
import { startOfToday, isEqual } from 'date-fns'


export default function ThingsForGroup(
{
  children,
  groupName,
  things,
}: {
  children?: React.ReactNode
  groupName: string,
  things: IThing[],}
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

  const isForToday = (thing: IThing | undefined) => {
    if (!thing?.date) {
      return false;
    }
    const day = thing.date.split('/')[2];
    const month = thing.date.split('/')[1];
    const year = thing.date.split('/')[0];
    const thingDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isEqual(thingDate, startOfToday());
  }

  return (
    <div>
        <Grid
            container
            spacing={2}
        >
            {!showSkeleton && things.length > 0 && things.map(t => {
                const thingKey = `thing-${t.thingId}`;
                if (t.actions.length > 0) {
                  return (
                  <Grid item key={thingKey} xs={12} sm={6}>
                    <ThingForAction thing={t}>
                      {isForToday(t) && t.actions.map(a => {
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
                }
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
