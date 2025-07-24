# Actix-webにおける機能分割のベストプラクティス

Actix-webを利用したRustアプリケーションにおいて、機能ごとにディレクトリを分けてコードを構成することは、プロジェクトが成長するにつれて非常に重要になります。Rustのモジュールシステムを効果的に使うことで、関心事の分離が促進され、コードの可読性、保守性、再利用性が向上します。

以下に、Actix-webアプリケーションを機能ごとに分割するためのベストプラクティスをまとめます。

### 1. 基本的な考え方

主な目的は、各機能（例：「ユーザー管理」「商品管理」）に関連するコード（リクエストハンドラ、データモデル、ルーティング設定など）を一つのディレクトリにまとめることです。これにより、特定の機能に関するコードを探しやすくなり、他の機能への影響を最小限に抑えながら修正や追加ができます。

### 2. ディレクトリ構造の例

小規模から中規模のアプリケーションで推奨される一般的なディレクトリ構造は以下の通りです。

```text
.
├── Cargo.toml
└── src/
    ├── main.rs          # アプリケーションのエントリポイント
    ├── errors.rs        # (任意) カスタムエラー型
    ├── db.rs            # (任意) データベース接続関連
    ├── config.rs        # (任意) アプリケーション設定
    └── features/        # 機能ごとのモジュールをまとめるディレクトリ
        ├── mod.rs       # featuresモジュールを宣言
        ├── users/       # 「ユーザー管理」機能
        │   ├── mod.rs   # usersモジュールを宣言し、配下のモジュールを公開
        │   ├── handlers.rs # リクエストハンドラ
        │   ├── models.rs   # データ構造体 (リクエスト/レスポンス/DBモデル)
        │   └── routes.rs   # この機能のルーティング設定
        └── products/    # 「商品管理」機能
            ├── mod.rs
            ├── handlers.rs
            ├── models.rs
            └── routes.rs
```

-   **`main.rs`**: Actix-webサーバーを起動し、各機能のルーティングを統合します。
-   **`features/`**: アプリケーションの各機能をまとめる親モジュールです。必須ではありませんが、`users`や`products`といったビジネスロジックのモジュールを`db`や`config`のようなインフラ層のモジュールから分離するのに役立ちます。
-   **`features/mod.rs`**: `users`や`products`モジュールを公開します。
-   **`features/users/mod.rs`**: `handlers.rs`や`models.rs`、`routes.rs`を公開し、`users`モジュールのインターフェースを定義します。
-   **`features/users/routes.rs`**: `actix_web::web::scope()` を使って、この機能のAPIエンドポイント（例: `/users`）をグループ化します。

### 3. 実装例

上記の構造に基づいた具体的なコード例を以下に示します。

---

**`src/main.rs`**

アプリケーション全体のエントリポイントです。ここで各機能のサービス（ルーティング）を登録します。

```rust
use actix_web::{App, HttpServer, web};

// featuresモジュールをインポート
mod features;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // /api スコープの下に各機能のルーティングを登録
            .service(
                web::scope("/api")
                    .configure(features::users::routes::init_routes)
                    .configure(features::products::routes::init_routes)
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

---

**`src/features/mod.rs`**

`features`ディレクトリをモジュールとして成立させ、サブモジュールを宣言します。

```rust
pub mod users;
pub mod products;
```

---

**`src/features/users/mod.rs`**

`users`機能の公開インターフェースを定義します。

```rust
// このモジュール外からアクセスできるように `pub` をつける
pub mod handlers;
pub mod models;
pub mod routes;
```

---

**`src/features/users/models.rs`**

ユーザーに関連するデータ構造を定義します。

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub id: u32,
    pub username: String,
}

#[derive(Deserialize)]
pub struct CreateUser {
    pub username: String,
}
```

---

**`src/features/users/handlers.rs`**

APIリクエストを処理する関数（ハンドラ）を定義します。

```rust
use actix_web::{web, HttpResponse, Responder};
use super::models::{User, CreateUser}; // 親モジュール(users)経由でmodelsを参照

// GET /api/users/{id}
pub async fn get_user(path: web::Path<u32>) -> impl Responder {
    let user_id = path.into_inner();
    // 本来はデータベースから取得する
    let user = User {
        id: user_id,
        username: "John Doe".to_string(),
    };
    HttpResponse::Ok().json(user)
}

// POST /api/users
pub async fn create_user(body: web::Json<CreateUser>) -> impl Responder {
    // 本来はデータベースに保存する
    let new_user = User {
        id: 123, // 仮のID
        username: body.username.clone(),
    };
    HttpResponse::Created().json(new_user)
}
```

---

**`src/features/users/routes.rs`**

`users`機能のルーティングを設定します。`web::scope()` を使うことで、このモジュール内のすべてのルートに `/users` というプレフィックスが付きます。

```rust
use actix_web::web;
use super::handlers; // 親モジュール(users)経由でhandlersを参照

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        // /users スコープでハンドラをグループ化
        web::scope("/users")
            .route("/{id}", web::get().to(handlers::get_user))
            .route("", web::post().to(handlers::create_user))
    );
}
```

### 4. ベストプラクティスと利点

1.  **関心事の分離**: 各機能が自己完結しているため、コードベースの見通しが良くなります。新しい機能を追加する際は、新しいディレクトリを作成するだけで済みます。
2.  **`web::scope()` の活用**: `main.rs` をクリーンに保ちながら、URLのプレフィックス（例: `/api/users`, `/api/products`）でAPIをグループ化できます。ルーティングの責任が各機能モジュールに委譲されるため、スケーラビリティが向上します。
3.  **明確なモジュール階層**: `mod.rs` を使ってモジュールを明示的に定義し、`pub` キーワードで公開範囲を制御することで、モジュール間の依存関係が明確になります。
4.  **テストの容易さ**: 機能ごとにモジュールが分かれていると、テストも機能単位で書きやすくなります。

このアプローチを採用することで、Actix-webアプリケーションが大規模になっても、整理され、拡張しやすい状態を維持することができます。
