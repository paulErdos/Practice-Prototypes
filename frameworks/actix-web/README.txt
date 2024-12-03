### ================================================================================
### HOWTO Setup
### ================================================================================

## 1. Setup

cargo new app_name
cd app_name

## 2. Add dependencies

vim cargo.toml

Add:

[dependencies]
actix-web = "4.0"  # or the latest version


## 3. Add server code

open src/main.rs, and add
use actix_web::{web, App, HttpServer, Responder};

async fn greet() -> impl Responder {
    "Hello, Actix!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(greet))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

## 4. Run

cargo run