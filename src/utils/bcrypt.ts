import bcrypt from "bcryptjs"

export const generateHash = async (content: string) => {
    return await bcrypt.hash(content, 10)
}

export const compareHash = async (content: string, hashedContent: string) => {
    return await bcrypt.compare(content, hashedContent)
}