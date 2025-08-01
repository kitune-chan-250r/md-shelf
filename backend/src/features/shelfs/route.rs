use super::service;
use actix_web::web;

/**
 * エンドポイントの初期化
 */
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("").route("", web::get().to(service::get_article_list)));
}
