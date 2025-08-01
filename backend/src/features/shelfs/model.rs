use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ArticleSummary {
    pub filename: String,
    pub title: String,
    pub summary: String,
}
