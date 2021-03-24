import reducer from "./application"

describe("Application Reducer", () => {
  it("throws an error with an unsupported type", () => {
    const state = {};

    const action = { type: null };

    expect(() => reducer(state, action)).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});