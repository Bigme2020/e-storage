import { E_STORAGE_EVENTS } from "../configs";
import { EStorage } from "..";

export type KeyOfObj = string | number | symbol;

export type EStorageEvent =
  (typeof E_STORAGE_EVENTS)[keyof typeof E_STORAGE_EVENTS];

export interface EStorageEventCallback extends Record<EStorageEvent, Function> {
  [E_STORAGE_EVENTS.GET_ITEM]: (item: KeyOfObj, value: any) => any;
  [E_STORAGE_EVENTS.SET_ITEM]: (item: KeyOfObj, value: any) => any;
}

export type Type = "localStorage" | "sessionStorage";

export interface EStoragePlugin {
  name: string;
  install: (eStorageInstance: EStorage) => void;
}

export interface EStorageProps<StorageType> {
  type?: Type;
  serviceName: string;
  items: (keyof StorageType)[];
  plugins?: EStoragePlugin[];
}

export interface ThrowErrorProps {
  type: string;
  errMsg: string;
}
