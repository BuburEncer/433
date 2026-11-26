import { Standing, Team } from "../models/index.js";

export async function getStandings(req, res, next) {
  try {
    const standings = await Standing.findAll({
      include: [{ model: Team, attributes: ["id", "name", "logo_url"] }],
      order: [
        ["win", "DESC"],
        ["points", "DESC"],
      ],
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
