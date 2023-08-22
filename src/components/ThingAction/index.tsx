import { LoadingButton } from "@mui/lab"
import { useState } from "react";

export default function ThingAction(
{
  children,
  thingId,
  actionValue,
  onClick,
}: {
  children?: React.ReactNode,
  thingId: number,
  actionValue: number,
  onClick?: (thingId: number, count: number) => Promise<void>,
}
) { 

  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    console.log("handling a click");
    if (onClick) {
      setLoading(true);
      await onClick(thingId, actionValue);
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      loading={isLoading}
      sx={{ paddingLeft: "12px", paddingRight: "12px", minWidth: "40px" }}
      onClick={handleClick}
      variant="contained"
      color="primary"
    >
      {children}
    </LoadingButton>
  )
}