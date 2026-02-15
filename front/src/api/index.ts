import type { Simulation, SimulationConfig, SimulationResult, SimulatedDate } from "@site-unseen/shared";

const API_BASE = "http://localhost:3001/api/v1";

interface ApiError {
  error: { code: string; message: string };
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SimulationWithRelations extends Simulation {
  attendees?: Array<{
    id: string;
    name: string;
    gender: string;
    sexuality: string;
    age: number;
    ethnicity: string;
    interests: string[];
  }>;
  result?: SimulationResult | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function createSimulation(config: SimulationConfig): Promise<SimulationWithRelations> {
  return request<SimulationWithRelations>("/simulations", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function listSimulations(params?: {
  page?: number;
  limit?: number;
  status?: string;
  mode?: string;
}): Promise<PaginatedResponse<Simulation>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.mode) query.set("mode", params.mode);

  const qs = query.toString();
  return request<PaginatedResponse<Simulation>>(`/simulations${qs ? `?${qs}` : ""}`);
}

export async function getSimulation(id: string): Promise<SimulationWithRelations> {
  return request<SimulationWithRelations>(`/simulations/${id}`);
}

export async function deleteSimulation(id: string): Promise<void> {
  return request<void>(`/simulations/${id}`, { method: "DELETE" });
}

export async function getResults(id: string): Promise<SimulationResult> {
  return request<SimulationResult>(`/simulations/${id}/results`);
}

export async function getDates(id: string): Promise<SimulatedDate[]> {
  return request<SimulatedDate[]>(`/simulations/${id}/dates`);
}
