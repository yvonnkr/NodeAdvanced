const CustomPage = require("./helpers/custompage");

let page;

beforeEach(async () => {
  page = await CustomPage.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("The header has the correct text", async () => {
  const text = await page.getContentsOf("a.brand-logo");

  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

//use test.only() --to test only this test in this file
test("When signed in show logout button", async () => {
  await page.login();
  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual("Logout");
});
