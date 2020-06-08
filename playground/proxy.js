//#region proxy-example basics

class Greetings {
  english() {
    return "Hello";
  }
  spanish() {
    return "Hola";
  }
}

class MoreGreetings {
  german() {
    return "Hallo";
  }
  french() {
    return "Bonjour";
  }
}

const greetings = new Greetings();
const moreGreetings = new MoreGreetings();

const allGreetings = new Proxy(moreGreetings, {
  get: function (target, property) {
    // console.log(property);
    return target[property] || greetings[property];
  },
});

console.log(allGreetings.english());

// allGreetings.evenPropsThatDontExist;
// allGreetings.french;

//#endregion

//#region proxy example two --CustomePage

class Page {
  goto() {
    console.log("im going to another page");
  }

  setCookie() {
    console.log("Im setting a cookie");
  }
}

class CustomPage {
  static build() {
    const page = new Page();
    const customePage = new CustomPage(page);

    const proxyPage = new Proxy(customePage, {
      get: function (target, prop) {
        return target[prop] || page[prop];
      },
    });

    return proxyPage;
  }

  constructor(page) {
    this.page = page;
  }

  login() {
    this.page.goto("localhost:3000");
    this.page.setCookie();
  }
}

const buildPage = () => {};

const superPage = CustomPage.build();

superPage.login();
superPage.goto();
superPage.setCookie();

//#endregion
