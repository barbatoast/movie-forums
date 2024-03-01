use axum::{ extract::Query, routing::get, Router, Json };
use serde::{ Deserialize, Serialize };
use sqlx::{FromRow, SqlitePool};
use std::net::SocketAddr;

const DB_URL: &str = "sqlite://db.sqlite3";

#[derive(Deserialize)]
struct Search {
    search: String,
}

#[derive(Debug, PartialEq, Eq, FromRow, Serialize)]
struct Movie {
    id: u32,
    film: String,
    genre: String,
    studio: String,
    score: u32,
    rotten_score: u32,
    gross: u32,
    year: u32,
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/movies", get(get_movies));
    let addr = SocketAddr::from(([0, 0, 0, 0], 8000));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn get_movies(search : Query<Search>) -> Json<Vec<Movie>> {
    let result = find_movies(&search.search).await;
    Json(result)
}

async fn find_movies(search: &str) -> Vec<Movie> {
    let db = SqlitePool::connect(DB_URL).await.unwrap();
    let query = format!("select id, film, genre, studio, score, rotten_score, gross, year
        from movies
        where film like '%{}%'", 
        search);
    sqlx::query_as::<_, Movie>(&query)
        .fetch_all(&db)
        .await
        .unwrap()
}
