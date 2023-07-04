// Set the typing of your environment variables here 👇
type MyVariables = {
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
   CLERK_SECRET_KEY: string
   NEXT_PUBLIC_CLERK_SIGN_IN_URL: string
   NEXT_PUBLIC_CLERK_SIGN_UP_URL: string
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string
   DATABASE_URL: string
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string
   STRIPE_API_KEY: string
   FRONTEND_STORE_URL: string
   STRIPE_WEBHOOK_SECRET: string
}

declare global {
   namespace NodeJS {
      interface ProcessEnv extends MyVariables {}
   }
}

export {}
