import { ActionOnOff, ActionSegmentFeeling, IAction } from "../../../../types";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { COLOR_RANGE } from "../../../../constants";

const displaySx = { fontSize: "4rem", lineHeight: "1.5rem", marginTop: "1.5rem" };
const buttonSx = { fontSize: "1.5rem", lineHeight: "1.5rem" };

export default function YesNoIcon (
{
  children,
  actionValue,
  placement = "button",
  disabled = false
}: {
  children?: React.ReactNode,
  actionValue: number,
  placement?: "button" | "display"
  disabled?: boolean
}
) {     
  const theSx = (placement === "display") ? {...displaySx} : {...buttonSx};
  let feelingColor = 0;
  
  switch (actionValue) {
    case ActionOnOff.Success:
      feelingColor = placement === "display" ? 10 : 9;
      return <CheckIcon sx={{...theSx, color: COLOR_RANGE[disabled ? -1 : feelingColor]}} />;
    case ActionOnOff.Failure:
      feelingColor = placement === "display" ? 0 : 0;
      return <CloseIcon sx={{...theSx, color: COLOR_RANGE[disabled ? -1 : feelingColor]}} />;
    default:
      return <QuestionMarkIcon sx={{...theSx}} />;
  }
}
