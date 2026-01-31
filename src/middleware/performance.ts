import { Request, Response, NextFunction } from "express";

export function performanceLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    const payload =
      req.method === "GET"
        ? req.query
        : Object.keys(req.body || {}).length
        ? req.body
        : undefined;

    console.log(
      `[PERF] ${req.method} ${req.originalUrl} - ${durationMs.toFixed(
        2
      )}ms`,
      payload ? `- Payload: ${JSON.stringify(payload)}` : ""
    );
  });

  next();
}