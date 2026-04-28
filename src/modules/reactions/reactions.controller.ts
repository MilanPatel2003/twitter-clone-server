import { Response } from "express";
import { AuthenticateRequest } from "../../types/interfaces";
import db from "../../config/db";
import { ResultSetHeader } from "mysql2";

export const likeTweet = async (req: AuthenticateRequest, res: Response) => {
    try {
        const userId = req.user?.user_id
        const tweetId = req.params.tweetId
        const [row] = await db.query<ResultSetHeader>(`INSERT INTO reactions (user_id,tweet_id,isLiked) VALUES (?,?,?)`,[userId,tweetId,true])
        res.status(200).json({message:"tweet liked!", tweetId})
    } catch (err) {
        res.status(500).json({message:(err as Error).message})
    }
}




// authentication, authorization, tweet, retweet,follow, following api, like, notification api done 