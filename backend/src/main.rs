use std::time::Duration;

use actix_web::{App, HttpServer, web};
use tokio::time::interval;
mod features;

use features::{articles, shelfs, summary};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    actix_rt::spawn(async move {
        let mut interval = interval(Duration::from_secs_f32(10.0 * 60.0));

        loop {
            // 待機
            interval.tick().await;
            // サマリーの作成を行う
            match summary::service::scheduled_create_summary() {
                Ok(()) => {
                    println!("create summary succeed");
                }

                Err(err) => {
                    println!("{:?}", err);
                }
            }
        }
    });

    HttpServer::new(|| {
        App::new()
            .service(web::scope("/api/shelf").configure(shelfs::route::init_routes))
            .service(web::scope("/api").configure(articles::route::init_routes))
            .default_service(
                actix_files::Files::new("/", "./static")
                    .index_file("index.html")
                    .redirect_to_slash_directory()
                    .use_last_modified(true),
            )
    })
    .bind(("0.0.0.0", 80))?
    .run()
    .await
}
