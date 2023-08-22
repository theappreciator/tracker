import { RowDataPacket } from "mysql2";

export type CookieUser = {
  userId: number;
  email: string;
  locale: string;
  timezone: string;
}

export type UserRecord = RowDataPacket & {
  userId: number;
  email: string;
  hash: string;
  locale: string;
  timezone: string;
}

export type ThingRecord = RowDataPacket & {
  userId: number;
  thingId: number;
  thingGroupId: number;
  groupName: string;
  thingName: string;
  date: string;
  count: number;
}

export type ThingActionRecord = RowDataPacket & {
  thingId: number;
  actionId: number;
  name: string;
  value: number;
  type: ActionType;
}

export enum ActionType {
  count = "count",
  onoff = "onoff",
  unspecified = "unspecified",
}

export type ActionRecord = RowDataPacket & {
  actionId: number;
  name: string;
  value: number;
  type: ActionType;
}

export type ThingGroupRecord = RowDataPacket & {
  userId: number;
  thingGroupId: number;
  groupName: string;
  thingId: number;
  thingName: string;
  actionId: number;
}

export interface IThing {
  thingId: number;
  thingName: string;
  groupName: string;
  date?: string;
  count?: number;
  actions: IAction[]
}

export interface IAction {
  actionId: number;
  name: string;
  value: number;
  type: ActionType;
}

export interface IThingGroup {
  userId: number;
  groupId: number;
  groupName: string;
  things: IThing[];
}

export interface IDateThingGroup {
  date: string;
  groups: IThingGroup[];
}
