use get_size::GetSize;
use get_size_derive::GetSize;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, GetSize)]
pub struct ArticleSummary {
    pub filename: String,
    pub title: String,
    pub summary: String,
}
