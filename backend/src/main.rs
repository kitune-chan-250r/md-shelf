use actix_web::{App, HttpResponse, HttpServer, web};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().route("/", web::get().to(HttpResponse::Ok)))
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}
