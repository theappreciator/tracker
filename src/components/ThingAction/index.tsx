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
  thingId?: number,
  actionValue?: number,
  onClick?: (thingId: number | undefined, count: number | undefined) => Promise<void>,
}
) { 

  const [isLoading, setLoading] = useState(false);

  const handleClick = async (thingId: number | undefined, count: number | undefined) => {
    if (onClick) {
      setLoading(true);
      await onClick(thingId, count);
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      loading={isLoading}
      sx={{ paddingLeft: "12px", paddingRight: "12px", minWidth: "40px" }}
      onClick={() => handleClick(thingId, actionValue)}
      variant="contained"
      color="primary"
    >
      {children}
    </LoadingButton>
  )
}