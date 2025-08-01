use actix_web::web;

use super::service;

/**
 * エンドポイントの初期化
 */
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("").route("/article/{filename}", web::get().to(service::get_content)));
}
