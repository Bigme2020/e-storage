export type Type = "localStorage" | "sessionStorage";

export interface EnhanceStorageProps<StorageType> {
  type?: Type;
  serviceName: string;
  items: (keyof StorageType)[];
}

const SERVICE_NAMES: string[] = [];

/** 这玩意只是对 storage 操作的简单封装 */
export class EnhanceStorage<StorageType = Record<string, any>> {
  serviceName: string;
  items: (keyof StorageType)[];
  type: Type;

  constructor({ serviceName, items, type }: EnhanceStorageProps<StorageType>) {
    if (SERVICE_NAMES.includes(serviceName)) {
      throw new Error(
        `Same ServiceName Detected: ${serviceName}，Change Your ServiceName`
      );
    }
    this.serviceName = serviceName;
    this.items = items;
    this.type = type || "localStorage";

    SERVICE_NAMES.push(serviceName);
  }

  private throwItemError(item: keyof StorageType) {
    throw new Error(
      `EnhanceStorage Item Error: item: ${this.normalizeItem(
        item
      )} is not defined in items`
    );
  }

  getItemName(item: keyof StorageType) {
    return `${this.serviceName}-${this.normalizeItem(item)}`;
  }

  private normalizeItem(unnormalizedItem: keyof StorageType) {
    return String(unnormalizedItem);
  }

  private storageGet<T extends keyof StorageType>(item: T) {
    const itemGet = window[this.type].getItem(this.getItemName(item));
    return itemGet ? (JSON.parse(itemGet) as StorageType[T]) : null;
  }

  private storageSet(
    item: keyof StorageType,
    value: StorageType[keyof StorageType]
  ) {
    const stringifyValue = JSON.stringify(value);
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
}
