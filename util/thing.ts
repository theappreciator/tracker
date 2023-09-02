import { INAPPLICABLE_TIER } from "../constants";
import { ActionSegmentFeeling, IThing } from "../types";
import { getAverageScore, getClosestNumber } from "./math";

export const getTierCountsFromSegmentType = (thing: IThing) => {
  if (thing.count === 0) {
    return [0, 0, 0];
  }
  const revStr = thing.count.toString().split('').reverse().join('');
  const tier1 = +(revStr.substring(0,3).split('').reverse().join('')); // 1-999
  const tier2 = +(revStr.substring(3,6).split('').reverse().join('')); // 1000-999999
  const tier3 = +(revStr.substring(6,9).split('').reverse().join('')); // 1000000-999999999

  return [
    tier1,
    tier2,
    tier3
  ]
}

export const getTierCountsFromSegmentTypeMatchesActions = (thing: IThing) => {
  const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);

  const actionValues = thing.actions.map(a => a.value);

  return [
    actionValues.includes(ActionSegmentFeeling.Bad) ? tier1 : INAPPLICABLE_TIER,
    actionValues.includes(ActionSegmentFeeling.Neutral) ? tier2 : INAPPLICABLE_TIER,
    actionValues.includes(ActionSegmentFeeling.Good) ? tier3 : INAPPLICABLE_TIER,
  ];
}

export const getAverageMappedToClosestFeelingAction = (thing: IThing): ActionSegmentFeeling => {
  if (thing.count === 0) {
    return ActionSegmentFeeling.Unspecified
  }

  const tiers = getTierCountsFromSegmentType(thing);
  const avg = getAverageScore(tiers);

  const closest = getClosestNumber(avg, [0, 50, 100]);

  switch (closest) {
    case 0: 
      return ActionSegmentFeeling.Bad;
    case 50:
      return ActionSegmentFeeling.Neutral;
    case 100:
      return ActionSegmentFeeling.Good;
    default:
      return ActionSegmentFeeling.Unspecified;
  }
};