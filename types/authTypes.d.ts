import type { DefualtUser } from "next-auth";

declare module "next-auth" {
    interface Session{
        user?: DefualtUser & {
            id: string;
        };
    }
}