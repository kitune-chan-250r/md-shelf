use actix_web::{App, HttpServer, web};
mod features;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(web::scope("").configure(features::shelfs::route::init_routes))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
