import { ActionSegmentFeeling, IAction } from "../../../../types";
import MoodIcon from '@mui/icons-material/Mood';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { COLOR_RANGE } from "../../../../constants";

const displaySx = { fontSize: "4rem", lineHeight: "1.5rem", marginTop: "1.5rem" };
const buttonSx = { fontSize: "1.5rem", lineHeight: "1.5rem" };

export default function FeelingIcon (
{
  children,
  actionValue,
  placement = "button",
  disabled = false,
}: {
  children?: React.ReactNode,
  actionValue: number,
  placement?: "button" | "display",
  disabled?: boolean
}
) {     
  const theSx = (placement === "display") ? {...displaySx} : {...buttonSx};
  let feelingColor = 0;
  switch (actionValue) {
    case ActionSegmentFeeling.Bad:
      feelingColor = placement === "display" ? 0 : 0;
      return <SentimentVeryDissatisfiedIcon sx={{...theSx, color: COLOR_RANGE[disabled ? -1 : feelingColor]}} />;
    case ActionSegmentFeeling.Neutral:
      feelingColor = placement === "display" ? 4 : 4;
      return <SentimentNeutralIcon sx={{...theSx, color: COLOR_RANGE[disabled ? -1 : feelingColor]}} />;
    case ActionSegmentFeeling.Good:
      feelingColor = placement === "display" ? 10 : 9;
      return <MoodIcon sx={{...theSx, color: COLOR_RANGE[disabled ? -1 : feelingColor]}} />;
    default:
      return <QuestionMarkIcon sx={{...theSx}} />;
  }
}
