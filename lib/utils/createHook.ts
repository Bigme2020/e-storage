import { SyncHook } from "tapable";

import { EnhanceStorage } from "..";
import { KeyOfObj } from "../types";

export const createHooks = <T>(instance: EnhanceStorage<T>) => {
  instance._getHook = new SyncHook<[KeyOfObj, any], any>([
    "item",
    "value",
  ]);

  // const listenGetHook = (
  //   currentIndex: number,
  //   callback: (item: KeyOfObj, val: any) => any
  // ) => {
  //   getHook.tap(`当前实例第${currentIndex}个获取 val`, callback);
  // };

  instance._setHook = new SyncHook<[KeyOfObj, any], any>([
    "item",
    "value",
  ]);

  // setHook.tap("设置 item", (item, val) => {
  //   return val;
  // });
}