import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "../validate.js";

const schema = z.object({
  name: z.string().min(1),
  count: z.number().int().min(1),
});

function callValidate(body: unknown) {
  const req = { body } as Request;
  const res = {} as Response;
  const next = vi.fn() as NextFunction;

  validate(schema)(req, res, next);

  return { req, next };
}

describe("validate middleware", () => {
  it("passes valid body and calls next()", () => {
    const { next } = callValidate({ name: "test", count: 5 });
    expect(next).toHaveBeenCalledWith();
  });

  it("replaces req.body with parsed data", () => {
    const { req } = callValidate({ name: "  hello ", count: 3 });
    expect(req.body).toEqual({ name: "  hello ", count: 3 });
  });

  it("calls next with ZodError for invalid body", () => {
    const { next } = callValidate({ name: "", count: 0 });
    expect(next).toHaveBeenCalledTimes(1);
    const err = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(err).toBeInstanceOf(z.ZodError);
  });

  it("calls next with ZodError for missing fields", () => {
    const { next } = callValidate({});
    const err = (next as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(err).toBeInstanceOf(z.ZodError);
  });
});
