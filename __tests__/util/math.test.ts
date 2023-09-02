import { getAverageScore } from "../../util/math";

describe("getAverageScore", () => {
  test("average is 50% with equal small numbers", () => {
    const numbers = [1,1,1];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(50);
  });
  
  test("average is 50% with equal small numbers no middle", () => {
    const numbers = [1,0,1];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(50);
  });
  
  test("average is 50% with equal large numbers", () => {
    const numbers = [999,999,999];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(50);
  });

  test("average is 50% with equal large numbers no middle", () => {
    const numbers = [999,0,999];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(50);
  });

  test("average is 0% with only lowest tier", () => {
    const numbers = [999,0,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(0);
  });

  test("average is 0% with only no tiers", () => {
    const numbers = [0,0,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(0);
  });

  test("average is 50% with only middle tier", () => {
    const numbers = [0,999,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(50);
  });

  test("average is 100% with only highest tier", () => {
    const numbers = [0,0,999];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(100);
  });

  test("average is 83.3% for [0,1,2]", () => {
    const numbers = [0,1,2];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((5/6 * 100));
  });
  
  test("average is 83.3% for [0,100,200]", () => {
    const numbers = [0,100,200];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((5/6 * 100));
  });

  test("average is 75% for [0,1,1]", () => {
    const numbers = [0,1,1];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(75);
  });

  test("average is 75% for [0,100,100]", () => {
    const numbers = [0,100,100];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(75);
  });

  test("average is 66.6% for [0,2,1]", () => {
    const numbers = [0,2,1];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((2/3 * 100));
  });
  
  test("average is 66.6% for [0,200,100]", () => {
    const numbers = [0,200,100];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((2/3 * 100));
  });

  test("average is 25% for [1,1,0]", () => {
    const numbers = [1,1,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(25);
  });

  test("average is 25% for [100,100,0]", () => {
    const numbers = [100,100,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe(25);
  });

  test("average is 33.3% for [1,2,0]", () => {
    const numbers = [1,2,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((1/3 * 100));
  });

  test("average is 33.3% for [100,200,0]", () => {
    const numbers = [100,200,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((1/3 * 100));
  });
  
  test("average is 16.6% for [2,1,0]", () => {
    const numbers = [2,1,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((1/6 * 100));
  });

  test("average is 16.6% for [200,100,0]", () => {
    const numbers = [200,100,0];
    const avg = getAverageScore(numbers);

    expect(avg).toBe((1/6 * 100));
  });
})