import { test } from "node:test";
import assert from "node:assert/strict";
import { STANDINGS_ORDER } from "./standingController.js";
import { db, Standing, Team } from "../models/index.js";

test("standings SQL orders by computed points, then wins, then team name", async () => {
  // Capture the generated SQL without touching MySQL.
  let sql = "";
  db.query = async (q) => {
    sql = q;
    return [];
  };
  await Standing.findAll({ include: [Team], order: STANDINGS_ORDER });

  const orderBy = sql.slice(sql.indexOf("ORDER BY"));
  assert.match(orderBy, /COALESCE\(`Standing`\.`win`, 0\) \* 3 \+ COALESCE\(`Standing`\.`draw`, 0\) DESC/);
  assert.ok(orderBy.indexOf("`win` DESC") > orderBy.indexOf("COALESCE"), "wins after points");
  assert.ok(orderBy.indexOf("`name` ASC") > orderBy.indexOf("`win` DESC"), "name is the tie-breaker");
});
