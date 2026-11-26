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
