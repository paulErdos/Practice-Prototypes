use actix_web::{web, App, HttpServer};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};
use sqlx::PgPool;
use dotenv::dotenv;
use std::env;

mod graphql;
mod db;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("envvar DATABASE_URL must be set");
    let pool = PgPool::connect(&database_url).await.expect("Failed to connect to database");

    let schema = graphql::schema::create_schema().data(pool);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(schema.clone()))
            .route("/graphql", web::post().to(graphql_handler));
    })
    .bind("127.0.0.1:9003")?
    .run()
    .await
}

async fn graphql_handler(
    schema: web::Data<graphql::schema::AppSchema>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}
