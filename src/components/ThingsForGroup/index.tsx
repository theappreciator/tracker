import { Grid, Skeleton } from "@mui/material";
import ThingForAction from "../ThingForAction";
import { ActionType, IAction, IThing } from "../../../types";
import ThingAction from "../ThingAction";
import { useGlobalContext } from "../../context";
import { isEqual } from 'date-fns'
import { getTodayDateCorrectedForTimezone, isDateStrEqualToToday } from "../../../util/date";
import { DEFAULT_USER_LOCALE, DEFAULT_USER_TIMEZONE } from "../../../constants";
import { getActionsType, buttonColor } from "../../../util/actions";


export default function ThingsForGroup(
{
  children,
  groupName,
  things,
}: {
  children?: React.ReactNode
  groupName: string,
  things: IThing[],
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
            {things.length > 0 && things.map(t => {
                const thingKey = `date-${t.date}-group-${groupName}-thing-${t.thingId}`;
                if (t.actions.length > 0) {
                  return (
                  <Grid item key={thingKey} xs={12} sm={6}>
                    {showSkeleton && (
                      <Skeleton animation="wave" height={100}/>
                    )}
                    {!showSkeleton && (
                      <ThingForAction thing={t} actionType={getActionsType(t.actions)}>
                        {isDateStrEqualToToday(t.date) && t.actions.map(a => {
                          const actionKey = `action-${t.thingId}-${a.actionId}`;
                          return (
                            <ThingAction
                              key={actionKey}
                              thing={t}
                              action={a}
                              color={buttonColor(t, a)}
                              onClick={handleActionClick}
                            >
                              {a.name}
                            </ThingAction>
                          )
                        })}
                      </ThingForAction>
                    )}
                  </Grid>
                  );
                }
            })}
        </Grid>
    </div>
  )
}
