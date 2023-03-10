from pydantic import BaseModel
from typing import Optional, List, Union
from datetime import datetime
from queries.pool import pool


class LyricsLikeOut(BaseModel):
    id: int
    user_id: int
    lyrics_id: int
    created_at: Optional[datetime]


class Error(BaseModel):
    message: str


class LyricsLikeQueries:
    def get_all(self, lyrics_id: int = None) -> Union[Error, List[LyricsLikeOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    if lyrics_id is not None:
                        result = db.execute(
                            """
                            SELECT id
                                , user_id
                                , lyrics_id
                                , created_at
                            FROM lyrics_likes
                            WHERE lyrics_id = %s
                            ORDER BY created_at DESC;
                            """,
                            [lyrics_id],
                        )
                    else:
                        result = db.execute(
                            """
                            SELECT id
                                , user_id
                                , lyrics_id
                                , created_at
                            FROM lyrics_likes
                            ORDER BY created_at DESC;
                            """
                        )
                    return [
                        self.record_to_lyrics_like_out(record)
                        for record in result
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get lyrics likes"}

    def get_all_user(self, user_id: int) -> Union[Error, List[LyricsLikeOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT id
                            , user_id
                            , lyrics_id
                            , created_at
                        FROM lyrics_likes
                        WHERE user_id = %s
                        ORDER BY created_at DESC;
                        """,
                        [user_id],
                    )
                    return [
                        self.record_to_lyrics_like_out(record)
                        for record in result
                    ]
        except Exception as e:
            print(e)
            return {"message": "Could not get lyrics likes"}

    def create(
        self, user_id: int, lyrics_id: int
    ) -> Union[Error, LyricsLikeOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO lyrics_likes
                            (user_id, lyrics_id)
                        VALUES
                            (%s, %s)
                        RETURNING id
                        """,
                        [
                            user_id,
                            lyrics_id,
                        ],
                    )
                    id = result.fetchone()[0]
                    return LyricsLikeOut(
                        id=id, user_id=user_id, lyrics_id=lyrics_id
                    )
        except Exception as e:
            print(e)
            return {"message": "Could not create lyrics like"}

    def delete(self, lyrics_like_id: int) -> Union[Error, bool]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM lyrics_likes
                        WHERE id = %s
                        """,
                        [lyrics_like_id],
                    )
                    deleted_row_count = db.rowcount
                    if deleted_row_count > 0:
                        print("Delete successful.")
                        return True
                    else:
                        print("Nothing to delete.")
                        return False
        except Exception as e:
            print(e)
            return {"message": "Could not delete lyrics like"}

    def delete_all_user_lyrics_likes(self, user_id: int) -> Union[bool, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM lyrics_likes
                        WHERE lyrics_likes.user_id = %s;
                        """,
                        [user_id],
                    )
                    deleted_row_count = db.rowcount
                    if deleted_row_count > 0:
                        print("Deleted Rows: ", deleted_row_count)
                        return True
                    else:
                        print("Nothing to delete.")
                        return False
        except Exception as e:
            print(e)
            return {"message": "Could not delete user's lyrics or likes"}

    def record_to_lyrics_like_out(self, record):
        return LyricsLikeOut(
            id=record[0],
            user_id=record[1],
            lyrics_id=record[2],
            created_at=record[3],
        )
