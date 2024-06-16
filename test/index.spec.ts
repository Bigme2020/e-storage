import { describe, expect, afterEach, test } from "vitest";

import { EnhanceStorage, Type } from "../lib";
import { getItemFromStorage } from "./utils";

const TEST_VALUE = "testValue";

describe("storageBasicFunctionallity", () => {
  const LOCAL_STORAGE_ITEM = "localStorage";
  const SESSION_STORAGE_ITEM = "sessionStorage";

  const testTypes: Type[] = ["localStorage", "sessionStorage"];

  testTypes.forEach((type) => {
    describe(type, () => {
      const testStroage = new EnhanceStorage({
        type,
        serviceName: type,
        items: [LOCAL_STORAGE_ITEM, SESSION_STORAGE_ITEM],
      });

      afterEach(() => {
        testStroage.clearItem();
      });

      test("setItem", () => {
        testStroage.setItem(LOCAL_STORAGE_ITEM, TEST_VALUE);

        expect(
          getItemFromStorage(type, testStroage.getItemName(LOCAL_STORAGE_ITEM))
        ).toBe(TEST_VALUE);
      });

      test("getItem", () => {
        testStroage.setItem(LOCAL_STORAGE_ITEM, TEST_VALUE);

        expect(testStroage.getItem(LOCAL_STORAGE_ITEM)).toBe(TEST_VALUE);
      });

      test("hasItem", () => {
        testStroage.setItem(LOCAL_STORAGE_ITEM, TEST_VALUE);

        expect(testStroage.hasItem(LOCAL_STORAGE_ITEM)).toBe(true);
      });

      test("clearItem", () => {
        testStroage.setItem(LOCAL_STORAGE_ITEM, TEST_VALUE);
        testStroage.clearItem(LOCAL_STORAGE_ITEM);

        expect(testStroage.hasItem(LOCAL_STORAGE_ITEM)).toBe(false);
      });
    });
  });
});
