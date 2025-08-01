use std::{error::Error, fs, path::Path};

use super::model::ArticleSummary;
use actix_web::{HttpResponse, Responder};

/**
 * トップページに表示する記事のリストを返す
 */
pub async fn get_article_list() -> impl Responder {
    match get_list_data() {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(err) => HttpResponse::InternalServerError().json(err.to_string()),
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
