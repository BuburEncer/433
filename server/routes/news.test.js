import { test } from "node:test";
import assert from "node:assert/strict";
import { isImageUpload } from "./news.js";

test("accepts image files", () => {
  assert.equal(isImageUpload({ originalname: "foto.JPG", mimetype: "image/jpeg" }), true);
  assert.equal(isImageUpload({ originalname: "a.webp", mimetype: "image/webp" }), true);
});

test("rejects html and spoofed types", () => {
  assert.equal(isImageUpload({ originalname: "x.html", mimetype: "text/html" }), false);
  assert.equal(isImageUpload({ originalname: "x.html", mimetype: "image/png" }), false);
  assert.equal(isImageUpload({ originalname: "x.png", mimetype: "text/html" }), false);
  assert.equal(isImageUpload({ originalname: "x.svg", mimetype: "image/svg+xml" }), false);
});
