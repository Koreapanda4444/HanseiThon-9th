import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { AppError } from "../errors.js";
import {
  currentAccount,
  changePassword,
  expiredSessionCookie,
  login,
  logout,
  register,
  removeAccount,
  sessionCookie,
} from "../services/auth-service.js";

const email = z.string().trim()
  .min(1, "이메일을 입력해 주세요.")
  .email("이메일 형식을 확인해 주세요.")
  .max(254, "이메일은 254자 이하로 입력해 주세요.");
const existingPassword = z.string()
  .min(1, "비밀번호를 입력해 주세요.")
  .max(128, "비밀번호는 128자 이하로 입력해 주세요.");
const newPassword = z.string()
  .min(10, "비밀번호는 10자 이상 입력해 주세요.")
  .max(128, "비밀번호는 128자 이하로 입력해 주세요.");
const registerSchema = z.object({
  name: z.string().trim()
    .min(2, "이름은 2자 이상 입력해 주세요.")
    .max(30, "이름은 30자 이하로 입력해 주세요.")
    .refine((value) => !/[<>\u0000-\u001f\u007f]/.test(value), "이름에 사용할 수 없는 문자가 포함되어 있습니다."),
  email,
  password: newPassword,
}).strict();
const loginSchema = z.object({ email, password: existingPassword }).strict();
const passwordChangeSchema = z.object({
  currentPassword: existingPassword,
  newPassword,
}).strict();
const accountDeleteSchema = z.object({ password: existingPassword }).strict();

function parseInput<T>(schema: z.ZodType<T>, input: unknown) {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(
      result.error.issues[0]?.message ?? "입력한 내용을 확인해 주세요.",
      400,
      "VALIDATION_ERROR",
    );
  }
  return result.data;
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/register", { config: { rateLimit: { max: 4, timeWindow: "1 hour" } } }, async (request, reply) => {
    const result = await register(parseInput(registerSchema, request.body));
    reply.header("Set-Cookie", sessionCookie(result.token));
    return reply.status(201).send({ user: result.account });
  });

  app.post("/api/auth/login", { config: { rateLimit: { max: 10, timeWindow: "10 minutes" } } }, async (request, reply) => {
    const result = await login(parseInput(loginSchema, request.body));
    reply.header("Set-Cookie", sessionCookie(result.token));
    return { user: result.account };
  });

  app.post("/api/auth/logout", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    await logout(request);
    reply.header("Set-Cookie", expiredSessionCookie());
    return reply.status(204).send();
  });

  app.get("/api/auth/me", async (request) => ({ user: await currentAccount(request) }));

  app.patch("/api/auth/password", { config: { rateLimit: { max: 5, timeWindow: "1 hour" } } }, async (request, reply) => {
    const result = await changePassword(request, parseInput(passwordChangeSchema, request.body));
    reply.header("Set-Cookie", sessionCookie(result.token));
    return reply.status(204).send();
  });

  app.delete("/api/auth/account", { config: { rateLimit: { max: 3, timeWindow: "1 hour" } } }, async (request, reply) => {
    const { password } = parseInput(accountDeleteSchema, request.body);
    await removeAccount(request, password);
    reply.header("Set-Cookie", expiredSessionCookie());
    return reply.status(204).send();
  });
}
