import { SyncHook } from "tapable";

import { EStorage } from "..";
import { KeyOfObj } from "../types";

export const createHooks = <T>(instance: EStorage<T>) => {
  instance._getHook = new SyncHook<[KeyOfObj, any], any>(["item", "value"]);
  instance._setHook = new SyncHook<[KeyOfObj, any], any>(["item", "value"]);
};
