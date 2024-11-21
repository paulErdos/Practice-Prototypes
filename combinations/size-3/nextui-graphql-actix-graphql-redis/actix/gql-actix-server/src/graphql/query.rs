use async_graphql::{Context, Object};
use sqlx::PgPool;

use crate::db::{models::User, queries::get_user_by_id};


#[derive(Default)]
pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn user<'a>(&self, ctx: &'a Context<'_>, id: i32) -> Option<User> {
        let pool = ctx.data::<PgPool>().expect("PgPool not found in context");
        get_user_by_id(pool, id).await
    }
}
