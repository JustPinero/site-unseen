import { vi } from "vitest";

const prisma = {
  simulation: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  attendee: {
    createMany: vi.fn(),
    findMany: vi.fn(),
  },
  simulatedDate: {
    createMany: vi.fn(),
    findMany: vi.fn(),
  },
  simulationResult: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
};

export default prisma;
