import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { checkPassword } from "./authController.js";

const fakeAdmin = (password) => ({ password, saved: 0, async save() { this.saved++; } });

test("hashed password: right and wrong", async () => {
  const admin = fakeAdmin(await bcrypt.hash("rahasia", 4));
  assert.equal(await checkPassword(admin, "rahasia"), true);
  assert.equal(await checkPassword(admin, "salah"), false);
  assert.equal(admin.saved, 0);
});

test("legacy plaintext password is upgraded to hash on success", async () => {
  const admin = fakeAdmin("rahasia");
  assert.equal(await checkPassword(admin, "salah"), false);
  assert.equal(admin.saved, 0);
  assert.equal(await checkPassword(admin, "rahasia"), true);
  assert.equal(admin.saved, 1);
  assert.ok(await bcrypt.compare("rahasia", admin.password));
});

test("login regenerates the session before storing the token", async () => {
  process.env.JWT_SECRET = "test-secret";
  const { loginAdmin } = await import("./authController.js");
  const { Admin } = await import("../models/index.js");
  const hash = await bcrypt.hash("rahasia", 4);
  Admin.findOne = async () => ({ id: 3, username: "a", password: hash });

  const calls = [];
  const session = {
    regenerate(cb) { calls.push("regenerate"); session.token = undefined; cb(); },
  };
  const res = { status() { return this; }, json(body) { calls.push(body.msg); } };
  await loginAdmin({ body: { email: "a@b.c", password: "rahasia" }, session }, res);

  assert.deepEqual(calls, ["regenerate", "Login berhasil"]);
  assert.ok(session.token);
});
