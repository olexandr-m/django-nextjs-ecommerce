import { createMetadata } from "@/utils/createMetadata";
import { setMessages } from "@tests/test-utils";

describe("createMetadata", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns default translated title and description when keys exist", async () => {
    setMessages({
      metadata_title: "test title",
      metadata_description: "test description",
    });

    const metadata = await createMetadata({
      namespace: "test",
    });

    expect(metadata.title).toBe("test title");
    expect(metadata.description).toBe("test description");
  });

  it("returns undefined title when title key is missing", async () => {
    setMessages({
      metadata_description: "test description",
    });

    const metadata = await createMetadata({
      namespace: "test",
    });

    expect(metadata.title).toBeUndefined();
    expect(metadata.description).toBe("test description");
  });

  it("returns undefined description when description key is missing", async () => {
    setMessages({
      metadata_title: "test title",
    });

    const metadata = await createMetadata({
      namespace: "test",
    });

    expect(metadata.title).toBe("test title");
    expect(metadata.description).toBeUndefined();
  });

  it("returns default robots config when not provided", async () => {
    const metadata = await createMetadata({
      namespace: "test",
    });

    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
    });
  });

  it("overwrite default robots config when provided", async () => {
    const metadata = await createMetadata({
      namespace: "test",
      robots: {
        index: false,
        follow: false,
      },
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
