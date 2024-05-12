import zod from "zod"

export const signupInput = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    name: zod.string().optional()
})


export const signinInput = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
})


export const blogInput = zod.object({
    title: zod.string(),
    content: zod.string()
})


export const updateBlogInput = zod.object({
    title: zod.string().optional(),
    content: zod.string().optional(),
    id: zod.number()
})

export type SignupInput = zod.infer <typeof signupInput>
export type SigninInput = zod.infer <typeof signinInput>
export type BlogInput = zod.infer <typeof blogInput>
export type UpdateBlogInput = zod.infer <typeof updateBlogInput>