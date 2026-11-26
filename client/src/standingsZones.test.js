import { test } from "node:test";
import assert from "node:assert/strict";
import { zoneForRank } from "./standingsZones.js";

test("ranks map to UCL league phase zones", () => {
  assert.equal(zoneForRank(1).key, "r16");
  assert.equal(zoneForRank(8).key, "r16");
  assert.equal(zoneForRank(9).key, "playoff");
  assert.equal(zoneForRank(24).key, "playoff");
  assert.equal(zoneForRank(25).key, "out");
  assert.equal(zoneForRank(36).key, "out");
});
