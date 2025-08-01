use super::super::summary;
use super::service;
use actix_web::web;

/**
 * エンドポイントの初期化
 */
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/shelf", web::get().to(service::get_article_list))
            .route("/test", web::get().to(summary::service::test_wrap)),
    );
}
