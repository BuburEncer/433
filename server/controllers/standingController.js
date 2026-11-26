import { literal } from "sequelize";
import { Standing, Team } from "../models/index.js";

// `points` is a VIRTUAL attribute, so sort by the expression it is computed from.
export const STANDINGS_ORDER = [
  [literal("win * 3 + draw"), "DESC"],
  ["win", "DESC"],
];

export async function getStandings(req, res, next) {
  try {
    const standings = await Standing.findAll({
      include: [{ model: Team, attributes: ["id", "name", "logo_url"] }],
      order: STANDINGS_ORDER,
    });
    res.json(standings);
  } catch (err) {
    next(err);
  }
}

export async function createStanding(req, res, next) {
  const { teamId, played, win, draw, loss } = req.body;

  try {
    const newStanding = await Standing.create({
      team_id: teamId,
      played,
      win,
      draw,
      loss,
    });

    res.status(201).json(newStanding);
  } catch (err) {
    next(err);
  }
}

export async function updateStanding(req, res, next) {
  try {
    const { id } = req.params;
    const { played, win, draw, loss } = req.body;
    const standing = await Standing.findByPk(id);
    if (!standing) return res.status(404).json({ message: "Not found" });

    await standing.update({ played, win, draw, loss });
    res.json({ message: "Updated", standing });
  } catch (err) {
    next(err);
  }
}

export async function deleteStanding(req, res, next) {
  try {
    const { id } = req.params;
    const standing = await Standing.findByPk(id);
    if (!standing) return res.status(404).json({ message: "Not found" });

    await standing.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}
