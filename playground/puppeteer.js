/**CODE BEFORE REFACTOR TO USE A CUSTOM CLASS USING PROXY */

const puppeteer = require("puppeteer");

const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

let browser, page;

beforeEach(async () => {
  // jest.setTimeout(10000); //default 5000

  //headless true will not show the graphical user interface --this makes tests runs as fast as possible
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

//use test.only() --to test only this test in this file
test("When signed in show logout button", async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  await page.setCookie({ name: "session", value: session });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000"); //to refresh-page

  const elem = 'a[href="/auth/logout"]';
  await page.waitFor(elem);

  const text = await page.$eval(elem, (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
