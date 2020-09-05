// CSRF Protection
import { NextFunction, Request, Response } from "express";

import { errorGenerator, generateToken } from "../util";

const protectedMethods = ["post", "patch", "put", "delete"];
export async function csrfMiddleware (req: Request, res: Response, next: NextFunction) {
  function fail () {
    return res.status(400).send(errorGenerator(400, "Failed CSRF Token validation"));
  }
  const cookieToken = req.cookies["CSRF-Token"];
  if (protectedMethods.includes(req.method.toLowerCase())) {
    // Validate CSRF presence
    const headerToken = req.get("CSRF-Token");
    if (cookieToken && headerToken) {
      if (cookieToken === decodeURIComponent(headerToken)) {
        return next();
      }
    }
    return fail();
  }
  if (!cookieToken) {
    res.cookie("CSRF-Token", await generateToken(), {
      maxAge: 172800000,
      sameSite: "strict",
      httpOnly: false,
      domain: process.env.NODE_ENV === "production" ? "menzieshillwhitehall.co.uk" : undefined
    });
  }
  return next();
}
export default csrfMiddleware;
