import { Request, Response } from "express"
import db from "../../config/db"
import { ResultSetHeader } from "mysql2"

 export const uploadProfile= async (req:Request, res:Response) => {
    try {
      const imageUrl = req.file?.path
      const id = req.params.id

      if (!imageUrl) {
        return res.status(400).json({ message: "No file uploaded" })
      }

      const [row] = await db.query<ResultSetHeader>(`UPDATE users SET profile_image=? WHERE user_id=?`,[imageUrl,id])

      res.status(200).json({message:"Profile updated successfully",id:id,url:imageUrl})

    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
