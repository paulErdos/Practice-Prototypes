use actix_web::{web, App, HttpServer, Responder, Error};
use std::fs::OpenOptions;
use serde_json::Value;
use reqwest::Client;
use std::io::Write;
use sqlx::PgPool;
use regex::Regex;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // TODO: fillin, perhaps from env var?
    let pool = PgPool::connect("postgres://user:password@localhost/dbname")
        .await
        .expect("Could not connect to Postgres");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/", web::get().to(hello))
            //.route("/search/{query}", web::get().to(search))
    })
    .bind("0.0.0.0:9010")?
    .run()
    .await
}


async fn hello() -> impl Responder {
    "(>^_^)> Hello!"
}


async fn search(pool: web::Data<PgPool>, query: web::Path<String>,) -> Result<impl Responder, Error> {
    let q = query.into_inner();

    // 0. Validate query by regex
    let re = Regex::new(r"^[a-zA-Z0-9]+$").unwrap();
    if q.len() > 100 || !re.is_match(&q) {
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open("invalid_queries.log")
            .unwrap();
        writeln!(file, "Invalid query: {}", q).unwrap();
        return Ok(web::Json(Value::String("Invalid query".into())));
    }

    
    // 0.5. Convert to lowercase
    q = q.to_lowercase();


    // 1. Check DB
    if let Some(cached) = sqlx::query!("SELECT value FROM cache WHERE key = $1", q)
        .fetch_optional(pool.get_ref())
        .await
        .map_err(actix_web::error::ErrorInternalServerError)?
    {
        return Ok(web::Json(cached.value));
    }


    // 2. Go get from external service
    let client = Client::new();
    let resp: Value = client
        .get(format!("http://127.0.0.1:8000/search/{q}"))
        .send()
        .await
        .map_err(actix_web::error::ErrorInternalServerError)?
        .json()
        .await
        .map_err(actix_web::error::ErrorInternalServerError)?;


    // 3. Set DB
    let value = serde_json::to_string(&resp).unwrap();
    sqlx::query!("INSERT INTO cache (key, value) VALUES ($1, $2)", q, value)
        .execute(pool.get_ref())
        .await
        .ok();


    // 5. Return value
    Ok(web::Json(resp))
}

async fn test_rest_param(query: web::Path<String>) -> Result<String, actix_web::Error> {
    let client = Client::new();

    let response = client.post("https://fdc.nal.usda.gov/portal-data/external/search")
        .header("Accept", "application/json, text/plain, */*")
        .header("Accept-Language", "en-US,en;q=0.9")
        .header("Connection", "keep-alive")
        .header("Content-Type", "application/json")
        .header("DNT", "1")
        .header("Origin", "https://fdc.nal.usda.gov")
        .header("Referer", format!("https://fdc.nal.usda.gov/food-search?query={query}&type=SR%20Legacy"))
        .header("Sec-Fetch-Dest", "empty")
        .header("Sec-Fetch-Mode", "cors")
        .header("Sec-Fetch-Site", "same-origin")
        .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36")
        .header("sec-ch-ua", r#""Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99""#)
        .header("sec-ch-ua-mobile", "?0")
        .header("sec-ch-ua-platform", r#""macOS""#)
        .json(&json!({
            "includeDataTypes": { "SR Legacy": true },
            "referenceFoodsCheckBox": true,
            "requireAllWords": true,
            "generalSearchInput": format!("{query}"),
            "pageNumber": 1,
            "exactBrandOwner": null,
            "sortCriteria": { "sortColumn": "description", "sortDirection": "asc" },
            "startDate": "",
            "endDate": "",
            "includeTradeChannels": null,
            "includeMarketCountries": null,
            "includeTags": null,
            "sortField": "",
            "sortDirection": null,
            "currentPage": 1
        }))
        .send()
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;


    let body = response.text().await.map_err(|e| actix_web::error::ErrorInternalServerError(e))?;
    Ok(body)
}
