import { DefaultSession, DefaultJWT } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            image: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        sub: string
        full_name: string
        email: string
        avatar_url: string
    }
}

declare module "next-auth" {
    interface User {
        id: string
        email: string
        full_name: string
        avatar_url: string
    }
}