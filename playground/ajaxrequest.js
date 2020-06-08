const createBlogPost = async () => {
  const response = await fetch("/api/blogs", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "apllication/json",
    },
    body: JSON.stringify({ title: "My Title", content: "My Content" }),
  });
};

const getAllBlogPosts = async () => {
  const response = await fetch("/api/blogs", {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "apllication/json",
    },
  });
};
