import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssueCode } from "zod";
import { AppError, errorHandler } from "../error-handler.js";

function createMockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const req = {} as Request;
const next = vi.fn() as NextFunction;

describe("errorHandler", () => {
  it("formats AppError with custom status code", () => {
    const res = createMockRes();
    const err = new AppError("NOT_FOUND", "Simulation not found", 404);

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "NOT_FOUND", message: "Simulation not found" },
    });
  });

  it("defaults AppError status to 400", () => {
    const res = createMockRes();
    const err = new AppError("INVALID_STATE", "Cannot delete");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handles ZodError with field paths", () => {
    const res = createMockRes();
    const zodError = new ZodError([
      {
        code: ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        exact: false,
        message: "Required",
        path: ["name"],
      },
    ]);

    errorHandler(zodError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "VALIDATION_ERROR", message: "name: Required" },
    });
  });

  it("handles generic Error as 500", () => {
    const res = createMockRes();
    const err = new Error("something broke");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  });

  it("AppError is an instance of Error", () => {
    const err = new AppError("TEST", "test message", 422);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe("TEST");
    expect(err.statusCode).toBe(422);
  });
});
