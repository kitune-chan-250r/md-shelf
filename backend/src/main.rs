use std::time::Duration;

use actix_web::{App, HttpServer, web};
use tokio::time::interval;
mod features;

use features::summary;

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
        App::new().service(web::scope("").configure(features::shelfs::route::init_routes))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
