import layout from "./layout";

describe("auth layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children", async () => {
    const children = <div>Auth</div>;

    const result = await layout({ children });

    expect(result.props.children).toBe(children);
  });
});
