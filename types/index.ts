import { RowDataPacket } from "mysql2";

export type CookieUser = {
  userId: number;
  email: string;
}

export type UserRecord = RowDataPacket & {
  userId: number;
  email: string;
  hash: string;
}

export type ThingRecord = RowDataPacket & {
  userId: number;
  thingId: number;
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
}

export type ActionRecord = RowDataPacket & {
  actionId: number;
  name: string;
  value: number;
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
  actions: IAction[]
}

export interface IAction {
  actionId: number;
  name: string;
  value: number;
}

export interface IThingGroup {
  userId: number;
  groupId: number;
  groupName: string;
  things: IThing[];
}
