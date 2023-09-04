import { getQueryParamNumber, getQueryParamString } from "../../util/query";

describe("getQueryParamNumber", () => {
    test.each([
      ["123", 123],
      ["0", 0],
      ["-123", -123],
      ["", 0],
      ["+1", 1]
    ])(
      "given param %p returns %p",
      (input, output) => {
        const result = getQueryParamNumber(input as string);
        expect(result).toBe(output);
        expect(typeof result).toBe("number");
      }
    );
    
    test.each([
      "abc",
      "?",
      "$",
      "1/0",
      "undefined",
      "NaN",
      "Infinity",
      undefined,
      NaN,
      Infinity
    ])(
      "given param %p returns undefined",
      (input) => {
        const result = getQueryParamNumber(input as unknown as string);
        expect(result).toBeUndefined();
      }
    );
});

describe("getQueryParamString", () => {
  test.each([
    ["123", "123"],
    ["0", "0"],
    ["-123", "-123"],
    ["", ""],
    ["+1", "+1"],
    ["1/0", "1/0"],
    ["undefined", "undefined"],
    ["NaN", "NaN"],
    ["Infinity", "Infinity"]
  ])(
    "given param %p returns %p",
    (input, output) => {
      const result = getQueryParamString(input as string);
      expect(result).toBe(output);
      expect(typeof result).toBe("string");
    }
  );
  
  test.each([
    undefined,
    NaN,
    Infinity
  ])(
    "given param %p returns undefined",
    (input) => {
      const result = getQueryParamString(input as unknown as string);
      expect(result).toBeUndefined();
    }
  );
});