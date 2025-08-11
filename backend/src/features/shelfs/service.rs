use std::{
    error::Error,
    fs,
    path::Path,
    sync::{Arc, Mutex},
};

use super::model::ArticleSummary;
use actix_web::{HttpResponse, Responder, web};

/**
 * トップページに表示する記事のリストを返す
 */
pub async fn get_article_list(
    summary_cache: web::Data<Arc<Mutex<Vec<ArticleSummary>>>>,
) -> impl Responder {
    let cache_data = summary_cache.lock().unwrap();
    if !cache_data.is_empty() {
        log::info!("use cache data");
        return HttpResponse::Ok().json(&*cache_data);
    }

    match get_list_data() {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(err) => {
            log::error!("Failed to get list data: {}", err);
            HttpResponse::InternalServerError().json(err.to_string())
        }
    }
}

/**
 * ローカルのjsonを取得し、内容をパースして返す
 */
fn get_list_data() -> Result<Vec<ArticleSummary>, Box<dyn Error>> {
    let file_read_result = fs::read_to_string(Path::new("./summary.json"))?;
    let summary_data = serde_json::from_str::<Vec<ArticleSummary>>(&file_read_result)?;

    return Ok(summary_data);
}
