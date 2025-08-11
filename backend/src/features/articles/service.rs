use std::{fs, path::Path};

use actix_web::{HttpResponse, Responder, web};

/**
 * ファイル名を受け取り、その内容を返す
 */
pub async fn get_content(path: web::Path<(String,)>) -> impl Responder {
    let filename = path.into_inner().0;
    println!("{:?}", filename);
    let path_str = format!("./articles/{}", filename);
    let path = Path::new(&path_str);
    match fs::read_to_string(path) {
        Ok(content) => return HttpResponse::Ok().body(content),
        Err(_) => {
            log::error!("Failed to read article file: {}", filename);
            return HttpResponse::NotFound().finish();
        }
    };
}
