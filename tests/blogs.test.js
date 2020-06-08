const Page = require("./helpers/custompage");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in,", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog creation form", async () => {
    const label = await page.getContentsOf("form label");

    expect(label).toEqual("Blog Title");
  });

  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My Title");
      await page.type(".content input", "My Content");
      await page.click("form button");
    });

    test("submitting takes user to a review screen ", async () => {
      const text = await page.getContentsOf("form h5");

      expect(text).toEqual("Please confirm your entries");
    });

    test("submitting then saving adds blog to the index page ", async () => {
      await page.click("button.green");
      await page.waitFor(".card"); //for ajax req --await for some element of the next page to appear

      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf(".card-content p");

      expect(title).toEqual("My Title");
      expect(content).toEqual("My Content");
    });
  });

  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("submitting shows error messages ", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

//TODO:
//since on client side we cannot directly click to add post/view post when not logged in
//this test is basically to test our backend api
describe("When user is Not logged in", async () => {
  test("user cannot create blog posts", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "apllication/json",
        },
        body: JSON.stringify({ title: "My Title", content: "My Content" }),
      }).then((res) => res.json());
    });

    // console.log("RESULT:", result);

    expect(result).toEqual({ error: "You must log in!" });
  });

  test("user cannot view list of blogs", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "apllication/json",
        },
      }).then((res) => res.json());
    });

    expect(result).toEqual({ error: "You must log in!" });
  });
});
