import { ENHANCE_STORAGE_EVENTS } from "../configs";

export type KeyOfObj = string | number | symbol;

export type EnhanceStorageEvent =
  (typeof ENHANCE_STORAGE_EVENTS)[keyof typeof ENHANCE_STORAGE_EVENTS];

export interface EnhanceStorageEventCallback
  extends Record<EnhanceStorageEvent, Function> {
  [ENHANCE_STORAGE_EVENTS.GET_ITEM]: (item: KeyOfObj, value: any) => any;
  [ENHANCE_STORAGE_EVENTS.SET_ITEM]: (item: KeyOfObj, value: any) => any;
}

export type Type = "localStorage" | "sessionStorage";

export interface EnhanceStorageProps<StorageType> {
  type?: Type;
  serviceName: string;
  items: (keyof StorageType)[];
}

export interface ThrowErrorProps {
  type: string;
  errMsg: string;
}
