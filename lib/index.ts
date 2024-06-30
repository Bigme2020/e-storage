import { SyncHook } from "tapable";

import { ENHANCE_STORAGE_EVENTS, ERR_TYPE } from "./configs";
import { createHooks } from "./utils";
import {
  EnhanceStorageEvent,
  EnhanceStorageProps,
  Type,
  KeyOfObj,
  ThrowErrorProps,
  EnhanceStorageEventCallback,
} from "./types";

const SERVICE_NAMES: string[] = [];

/** 这玩意只是对 storage 操作的简单封装 */
export class EnhanceStorage<StorageType = Record<string, any>> {
  serviceName: string;
  items: (keyof StorageType)[];
  type: Type;

  _getHook?: SyncHook<[KeyOfObj, any], any>;
  _setHook?: SyncHook<[KeyOfObj, any], any>;

  constructor({ serviceName, items, type }: EnhanceStorageProps<StorageType>) {
    if (SERVICE_NAMES.includes(serviceName)) {
      throw new Error(
        `Same ServiceName Detected: ${serviceName}，Change Your ServiceName`
      );
    }
    this.serviceName = serviceName;
    this.items = items;
    this.type = type || "localStorage";

    createHooks(this);

    SERVICE_NAMES.push(serviceName);
  }

  private throwError({ type, errMsg }: ThrowErrorProps) {
    throw new Error(`EnhanceStorage ${type} Error: ${errMsg}`);
  }

  private throwItemError(item: keyof StorageType) {
    this.throwError({
      type: ERR_TYPE.ITEM,
      errMsg: `item: ${this.normalizeItem(item)} is not defined in items`,
    });
  }

  getItemName(item: keyof StorageType) {
    return `${this.serviceName}-${this.normalizeItem(item)}`;
  }

  private normalizeItem(unnormalizedItem: keyof StorageType) {
    return String(unnormalizedItem);
  }

  private storageGet<T extends keyof StorageType>(item: T) {
    const itemGet = window[this.type].getItem(this.getItemName(item));
    const val = itemGet ? (JSON.parse(itemGet) as StorageType[T]) : null;

    const changedVal = this._getHook?.call(item, val);
    return (changedVal || val) as StorageType[T];
  }

  private storageSet(
    item: keyof StorageType,
    value: StorageType[keyof StorageType]
  ) {
    const changedVal = this._setHook?.call(item, value);

    const stringifyValue = JSON.stringify(changedVal || value);
    window[this.type].setItem(this.getItemName(item), stringifyValue);
  }

  private storageRemove(item: keyof StorageType) {
    window[this.type].removeItem(this.getItemName(item));
  }

  getItem<T extends keyof StorageType>(item: T): StorageType[T] | null {
    if (!this.items.includes(item)) {
      this.throwItemError(item);
    }
    return this.storageGet(item);
  }

  setItem<T extends keyof StorageType>(
    item: T,
    value: StorageType[T],
    config = { override: true }
  ) {
    if (!this.items.includes(item)) {
      this.throwItemError(item);
    }
    if (config.override) {
      this.storageSet(item, value);
    } else {
      if (!this.getItem(item)) {
        this.storageSet(item, value);
      }
    }
  }

  clearItem(item?: keyof StorageType) {
    if (item && !this.items.includes(item)) {
      this.throwItemError(item);
    } else if (item) {
      this.storageRemove(item);
      return;
    }
    this.items.forEach((_item) => {
      this.storageRemove(_item);
    });
  }

  hasItem(item: keyof StorageType) {
    if (!this.items.includes(item)) {
      this.throwItemError(item);
    }
    return !!this.getItem(item);
  }

  on<T extends EnhanceStorageEvent>(
    event: T,
    callback: EnhanceStorageEventCallback[T]
  ) {
    switch (event) {
      case ENHANCE_STORAGE_EVENTS.GET_ITEM: {
        if (!this._getHook) {
          this.throwError({ type: ERR_TYPE.HOOK, errMsg: "not init get hook" });
          return;
        }
        this._getHook.tap(`get${this._getHook.taps.length}`, callback);
        break;
      }
      case ENHANCE_STORAGE_EVENTS.SET_ITEM:
        if (!this._setHook) {
          this.throwError({ type: ERR_TYPE.HOOK, errMsg: "not init set hook" });
          return;
        }
        this._setHook.tap(`get${this._setHook.taps.length}`, callback);
        break;
    }
  }
}
