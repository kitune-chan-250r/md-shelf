use std::{error::Error, fs, io::BufWriter, path::Path, str::FromStr};

use pulldown_cmark::{Event, HeadingLevel, Parser, Tag};

use super::super::shelfs::model::ArticleSummary;

/**
 * shelfsで返すデータを作成する
 */
pub fn scheduled_create_summary() -> Result<Vec<ArticleSummary>, Box<dyn Error>> {
    // 特定のディレクトリに存在している.mdファイルの一覧を取得
    let target_files = get_target_md_file()?;

    // 各ファイルに対してmdパーサーを使用して必要なデータを取得
    let result = target_files
        .iter()
        .map(|file_name| {
            let article_summary = extract_summary_data(file_name)?;
            Ok(article_summary)
        })
        .collect::<Result<Vec<ArticleSummary>, Box<dyn Error>>>()?;

    // ファイル書き出し(必ず置き換え)
    export_summary_json(&result)?;

    Ok(result)
}

/**
 * .mdファイルか判定
 */
fn is_markdown_file(file_name: &str) -> bool {
    file_name.ends_with(".md")
}

/**
 * ターゲットのディレクトリに存在する.mdファイルのファイル名一覧を取得
 */
fn get_target_md_file() -> Result<Vec<String>, Box<dyn Error>> {
    let mut result = Vec::<String>::new();
    let path = Path::new("./articles");

    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?.path();
            // let file_name = entry.file_name().to_string_lossy().to_string();
            let file_path = entry.to_str();
            match file_path {
                Some(file_path) => {
                    if is_markdown_file(file_path) {
                        result.push(String::from_str(file_path)?);
                    }
                }
                None => return Err("faild to convert path to str".into()),
            }
        }
        Ok(result)
    } else {
        Err("path is not a directory".into())
    }
}

/**
 * .mdファイルをパースし、必要なデータを抽出する
 */
fn extract_summary_data(file_path: &str) -> Result<ArticleSummary, Box<dyn Error>> {
    let file_path = Path::new(file_path);
    let markdown_input = fs::read_to_string(file_path)?;
    // パーサーを作成
    let parser = Parser::new(&markdown_input);

    let heading_level = HeadingLevel::H1;
    let mut in_heading = false;
    let mut is_start_next_heading = false;

    // .mdのタイトル
    let mut title = String::new();
    // サマリー
    let mut summary = String::new();

    for event in parser {
        match event {
            // 見出しタグの開始を検知
            Event::Start(Tag::Heading { level, .. }) => {
                if level.eq(&heading_level) {
                    in_heading = true;
                } else {
                    is_start_next_heading = false;
                }
            }

            Event::Text(text) => {
                if in_heading {
                    // println!("{:?}", text);
                    title = text.into_string();
                } else if is_start_next_heading {
                    summary.push_str(text.into_string().as_str());
                }
            }

            Event::End(_tag_end) => {
                if in_heading {
                    is_start_next_heading = true; // H1が終わってから次の何かしらのタグが始まるまでフラグを立てる
                }
                in_heading = false;
            }

            _ => {}
        }
    }

    let file_name_str = file_path
        .file_name()
        .ok_or("faild to get file_name")?
        .to_str()
        .ok_or("faild to convert to str file_name")?;
    let filename = String::from_str(file_name_str)?;

    Ok(ArticleSummary {
        filename,
        title,
        summary,
    })
}

/**
 * サマリーをjsonに書き出す
 */
fn export_summary_json(article_summarys: &Vec<ArticleSummary>) -> Result<(), Box<dyn Error>> {
    // ファイルを上書きモードで開く
    let file = fs::File::create("./summary.json")?;

    // バッファ付きライターを作成
    let writer = BufWriter::new(file);

    // JSONにシリアライズしてファイルに書き込む
    serde_json::to_writer_pretty(writer, article_summarys)?;

    Ok(())
}
