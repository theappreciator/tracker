import { LoadingButton } from "@mui/lab"
import { useState } from "react";
import { ActionType, IAction, IThing } from "../../../types";
import { hasCompleted } from "../../../util/actions";

export default function ThingAction(
{
  children,
  thing,
  action,
  color,
  onClick,
}: {
  children?: React.ReactNode,
  thing: IThing,
  action: IAction,
  color: "success" | "primary" | "error";
  onClick?: (thingId: number, count: number) => Promise<void>,
}
) { 

  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      setLoading(true);
      await onClick(thing.thingId, action.value);
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      loading={isLoading}
      sx={{ paddingLeft: "12px", paddingRight: "12px", minWidth: "40px" }}
      onClick={handleClick}
      variant="contained"
      color={color}
      disabled={hasCompleted(thing, action)}
    >
      {children}
    </LoadingButton>
  )
}