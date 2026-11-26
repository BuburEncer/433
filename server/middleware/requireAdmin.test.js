import { test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import requireAdmin from "./requireAdmin.js";

process.env.JWT_SECRET = "test-secret";

function run(session) {
  const res = { code: 200, status(c) { this.code = c; return this; }, json() { return this; } };
  const req = { session };
  let passed = false;
  requireAdmin(req, res, () => { passed = true; });
  return { passed, code: res.code, req };
}

test("rejects request without session token", () => {
  assert.deepEqual([run({}).passed, run({}).code], [false, 401]);
  assert.equal(run(undefined).code, 401);
});

test("rejects token signed with another secret", () => {
  const token = jwt.sign({ id: 1 }, "wrong");
  assert.equal(run({ token }).code, 401);
});

test("passes valid token and exposes admin id", () => {
  const token = jwt.sign({ id: 7 }, process.env.JWT_SECRET);
  const { passed, req } = run({ token });
  assert.equal(passed, true);
  assert.equal(req.adminId, 7);
});
