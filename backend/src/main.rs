use std::sync::Arc;
use std::sync::Mutex;
use std::time::Duration;

use actix_web::{App, HttpServer, web};
use actix_web_lab::web::spa;
use tokio::time::interval;
mod features;

use features::{articles, shelfs, summary};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let summary_cache = Arc::new(Mutex::new(Vec::<shelfs::model::ArticleSummary>::new()));
    let summary_cache_clone = Arc::clone(&summary_cache);

    actix_rt::spawn(async move {
        let mut interval = interval(Duration::from_secs_f32(10.0 * 60.0));

        loop {
            // 待機
            interval.tick().await;
            // サマリーの作成を行う
            match summary::service::scheduled_create_summary() {
                Ok(result) => {
                    // キャッシュに保存
                    let mut cache = summary_cache_clone.lock().unwrap();
                    *cache = result;
                    println!("create summary succeed");
                }

                Err(err) => {
                    println!("{:?}", err);
                }
            }
        }
    });

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(summary_cache.clone()))
            .service(web::scope("/api/shelf").configure(shelfs::route::init_routes))
            .service(web::scope("/api").configure(articles::route::init_routes))
            // .service(
            //     actix_files::Files::new("/", "./static")
            //         .index_file("index.html")
            //         .redirect_to_slash_directory()
            //         .use_last_modified(true),
            // )
            .service(
                spa()
                    .index_file("./static/index.html")
                    .static_resources_mount("/")
                    .static_resources_location("./static")
                    .finish(),
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
