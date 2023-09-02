import { INAPPLICABLE_TIER } from "../../constants";
import { ActionSegmentFeeling, ActionType, IAction, IThing } from "../../types";
import { getAverageMappedToClosestFeelingAction, getTierCountsFromSegmentType, getTierCountsFromSegmentTypeMatchesActions } from "../../util/thing";


const actions_feeling_1_50_100: IAction[] = [
  {
    actionId: 1,
    type: ActionType.segmentFeeling,
    name: "Action 1",
    value: ActionSegmentFeeling.Bad
  },
  {
    actionId: 2,
    type: ActionType.segmentFeeling,
    name: "Action 2",
    value: ActionSegmentFeeling.Neutral
  },
  {
    actionId: 3,
    type: ActionType.segmentFeeling,
    name: "Action 3",
    value: ActionSegmentFeeling.Good
  }
];

const actions_feeling_1_100: IAction[] = [
  {
    actionId: 1,
    type: ActionType.segmentFeeling,
    name: "Action 1",
    value: ActionSegmentFeeling.Bad
  },
  {
    actionId: 2,
    type: ActionType.segmentFeeling,
    name: "Action 2",
    value: ActionSegmentFeeling.Good
  }
];

const actions_feeling_1_50: IAction[] = [
  {
    actionId: 1,
    type: ActionType.segmentFeeling,
    name: "Action 1",
    value: ActionSegmentFeeling.Bad
  },
  {
    actionId: 2,
    type: ActionType.segmentFeeling,
    name: "Action 2",
    value: ActionSegmentFeeling.Neutral
  }
];

const actions_feeling_50_100: IAction[] = [
  {
    actionId: 1,
    type: ActionType.segmentFeeling,
    name: "Action 1",
    value: ActionSegmentFeeling.Neutral
  },
  {
    actionId: 2,
    type: ActionType.segmentFeeling,
    name: "Action 2",
    value: ActionSegmentFeeling.Good
  }
];

describe("getTierCountsFromSegmentType", () => {
  test("returns 3 full tiers", () => {
    const thing: IThing = {
      count: 111222333444555,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(555);
    expect(tier2).toBe(444);
    expect(tier3).toBe(333);
  });

  test("returns 3 partial tiers", () => {
    const thing: IThing = {
      count: 111002003004005,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(5);
    expect(tier2).toBe(4);
    expect(tier3).toBe(3);
  });

  test("returns 2 full tiers", () => {
    const thing: IThing = {
      count: 111222,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(222);
    expect(tier2).toBe(111);
    expect(tier3).toBe(0);
  });

  test("returns 2 partial tiers", () => {
    const thing: IThing = {
      count: 1002,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(2);
    expect(tier2).toBe(1);
    expect(tier3).toBe(0);
  });

  test("returns 1 full tier", () => {
    const thing: IThing = {
      count: 111,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(111);
    expect(tier2).toBe(0);
    expect(tier3).toBe(0);
  });

  test("returns 1 partial tier", () => {
    const thing: IThing = {
      count: 1,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(1);
    expect(tier2).toBe(0);
    expect(tier3).toBe(0);
  });

  test("returns 0 tiers for 0", () => {
    const thing: IThing = {
      count: 0,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(0);
    expect(tier2).toBe(0);
    expect(tier3).toBe(0);
  });

  test("returns middle tier for only middle tier", () => {
    const thing: IThing = {
      count: 1000,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(0);
    expect(tier2).toBe(1);
    expect(tier3).toBe(0);
  });

  test("returns outer tiers for with no middle tier", () => {
    const thing: IThing = {
      count: 111000333,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentType(thing);
    expect(tier1).toBe(333);
    expect(tier2).toBe(0);
    expect(tier3).toBe(111);
  });
});

describe("getTierCountsFromSegmentTypeMatchesActions", () => {
  test("returns Inapplicable for tier1", () => {
    const thing: IThing = {
      count: 111222000,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_50_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentTypeMatchesActions(thing);
    expect(tier1).toBe(INAPPLICABLE_TIER);
    expect(tier2).toBe(222);
    expect(tier3).toBe(111);
  });

  test("returns Inapplicable for tier2", () => {
    const thing: IThing = {
      count: 111000333,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_100]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentTypeMatchesActions(thing);
    expect(tier1).toBe(333);
    expect(tier2).toBe(INAPPLICABLE_TIER);
    expect(tier3).toBe(111);
  });

  test("returns Inapplicable for tier3", () => {
    const thing: IThing = {
      count: 111222,
      thingId: 1,
      thingName: "test thing",
      groupName: "test group",
      goal: 0,
      actions: [...actions_feeling_1_50]
    }
    const [tier1, tier2, tier3] = getTierCountsFromSegmentTypeMatchesActions(thing);
    expect(tier1).toBe(222);
    expect(tier2).toBe(111);
    expect(tier3).toBe(INAPPLICABLE_TIER);
  });
})

describe("getAverageMappedToClosestFeelingAction", () => {
  describe("three feelings selected", () => {
    test("Returns unspecified for count = 0", () => {
      const thing: IThing = {
        count: 0,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_50_100]
      }
      const closest = getAverageMappedToClosestFeelingAction(thing);
      expect(closest).toBe(ActionSegmentFeeling.Unspecified);
    });

    test("Returns Bad with only Bad datapoint", () => {
      const thing: IThing = {
        count: 1,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_50_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Bad);
    });

    test("Returns Neutral with only Neutral datapoint", () => {
      const thing: IThing = {
        count: 1000,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_50_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Neutral);
    });

    test("Returns Good with only Good datapoint", () => {
      const thing: IThing = {
        count: 1000000,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_50_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Good);
    });

    test("Returns Good with majority Good datapoint", () => {
      const thing: IThing = {
        count: 4000001,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_50_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Good);
    });

    test("Returns Bad with majority Bad datapoint", () => {
      const thing: IThing = {
        count: 1000004,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_50_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Bad);
    });
  });

  describe("two feelings selected", () => {
    test("Returns unspecified for count = 0", () => {
      const thing: IThing = {
        count: 0,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_100]
      }
      const closest = getAverageMappedToClosestFeelingAction(thing);
      expect(closest).toBe(ActionSegmentFeeling.Unspecified);
    });

    test("Returns Bad with only Bad datapoint", () => {
      const thing: IThing = {
        count: 1,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Bad);
    });

    test("Returns Neutral with 1 Bad and 1 Good datapoint", () => {
      const thing: IThing = {
        count: 1000001,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Neutral);
    });

    test("Returns Good with only Good datapoint", () => {
      const thing: IThing = {
        count: 1000000,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Good);
    });

    test("Returns Good with majority Good datapoint", () => {
      const thing: IThing = {
        count: 4000001,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Good);
    });

    test("Returns Bad with majority Bad datapoint", () => {
      const thing: IThing = {
        count: 1000004,
        thingId: 1,
        thingName: "test thing",
        groupName: "test group",
        goal: 0,
        actions: [...actions_feeling_1_100]
      }
      const feeling = getAverageMappedToClosestFeelingAction(thing);
      expect(feeling).toBe(ActionSegmentFeeling.Bad);
    });
  });
});