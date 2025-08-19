use reqwest::{Client, header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_LANGUAGE, CONNECTION, CONTENT_TYPE, DNT, ORIGIN, REFERER, USER_AGENT}};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let client = Client::new();
    
    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, HeaderValue::from_static("application/json, text/plain, */*"));
    headers.insert(ACCEPT_LANGUAGE, HeaderValue::from_static("en-US,en;q=0.9"));
    headers.insert(CONNECTION, HeaderValue::from_static("keep-alive"));
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(DNT, HeaderValue::from_static("1"));
    headers.insert(ORIGIN, HeaderValue::from_static("https://fdc.nal.usda.gov"));
    headers.insert(REFERER, HeaderValue::from_static("https://fdc.nal.usda.gov/food-search?query=kefir&type=SR%20Legacy"));
    headers.insert(USER_AGENT, HeaderValue::from_static("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"));
    
    // Manually adding missing headers
    headers.insert("Sec-Fetch-Dest", HeaderValue::from_static("empty"));
    headers.insert("Sec-Fetch-Mode", HeaderValue::from_static("cors"));
    headers.insert("Sec-Fetch-Site", HeaderValue::from_static("same-origin"));
    headers.insert("Sec-Ch-Ua", HeaderValue::from_static("\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\""));
    headers.insert("Sec-Ch-Ua-Mobile", HeaderValue::from_static("?0"));
    headers.insert("Sec-Ch-Ua-Platform", HeaderValue::from_static("\"macOS\""));
    
    let body = json!({
        "includeDataTypes": {
            "SR Legacy": true
        },
        "referenceFoodsCheckBox": true,
        "requireAllWords": true,
        "generalSearchInput": "kefir",
        "pageNumber": 1,
        "exactBrandOwner": null,
        "sortCriteria": {
            "sortColumn": "description",
            "sortDirection": "asc"
        },
        "startDate": "",
        "endDate": "",
        "includeTradeChannels": null,
        "includeMarketCountries": null,
        "includeTags": null,
        "sortField": "",
        "sortDirection": null,
        "currentPage": 1
    });

    let res = client.post("https://fdc.nal.usda.gov/portal-data/external/search")
        .headers(headers)
        .json(&body)
        .send()
        .await?;

    println!("Response: {:?}", res.text().await?);

    Ok(())
}
