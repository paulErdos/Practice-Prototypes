use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow, OutputType)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
}

