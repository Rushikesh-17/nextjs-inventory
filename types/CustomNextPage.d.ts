import { NextPage } from "next";
import path from "path";

export type CustomNextPage<P = {},IP=P> = NextPage<P,IP> & {
    requireAuth?: boolean;
};