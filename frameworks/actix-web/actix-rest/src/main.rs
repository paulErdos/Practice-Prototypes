use actix_web::{web, App, HttpServer, Responder};
use reqwest::Client;
use serde_json::json;

async fn hello() -> impl Responder {
    "Hello!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(hello))
            .route("/test-rest", web::get().to(test_rest))
            .route("/search-test/{query}", web::get().to(test_rest_param))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
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

async fn test_rest() -> Result<String, actix_web::Error> {
    let client = Client::new();

    let response = client.post("https://fdc.nal.usda.gov/portal-data/external/search")
        .header("Accept", "application/json, text/plain, */*")
        .header("Accept-Language", "en-US,en;q=0.9")
        .header("Connection", "keep-alive")
        .header("Content-Type", "application/json")
        .header("DNT", "1")
        .header("Origin", "https://fdc.nal.usda.gov")
        .header("Referer", "https://fdc.nal.usda.gov/food-search?query=kefir&type=SR%20Legacy")
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
            "generalSearchInput": "kefir",
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