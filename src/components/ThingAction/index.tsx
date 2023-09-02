import { LoadingButton } from "@mui/lab"
import { useState } from "react";
import { ActionSegmentFeeling, ActionType, IAction, IThing } from "../../../types";
import { hasCompleted } from "../../../util/actions";
import FeelingIcon from "../Icons/FeelingIcon";

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

  const getDisplay = () => {
    switch (action.type) {
      case ActionType.segmentFeeling:
        return <FeelingIcon actionValue={action.value} placement="button"/>
      case ActionType.segmentSize:
      case ActionType.count:
      case ActionType.onoff:
      case ActionType.unspecified:
      default:
        return action.name;
    }
  }

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
      sx={{ paddingLeft: "12px", paddingRight: "12px", minWidth: "40px", fontSize: "0.9rem", lineHeight: "1.5rem" }}
      onClick={handleClick}
      variant="contained"
      color={color}
      disabled={hasCompleted(thing, action)}
    >
      {getDisplay()}
    </LoadingButton>
  )
}