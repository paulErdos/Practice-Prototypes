use sqlx::PgPool;

use crate::db::models::User;

pub async fn get_user_by_id(pool: &PgPool, user_id: i32) -> Option<User> {
    sqlx::query_as!(
        User,
        "SELECT id, name, email FROM users WHERE id = $1",
        user_id
    )
    .fetch_optional(pool)
    .await
    .ok()?
}
