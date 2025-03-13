use async_graphql::{Schema, EmptyMutation, EmptySubscription};

use crate::graphql::query::QueryRoot;

pub type AppSchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

pub fn create_schema() -> AppSchema {
    Schema::build(QueryRoot::default(), EmptyMutation, EmptySubscription).data(pool).finish()
}
