#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rand::Rng;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn start() -> String {
    let quotes: Vec<&str> = vec![
        "The quick brown fox jumps over the lazy dog",
        "Lorem ipsum dolor sit am",
        "Você é foda!",
        "O que é a vida?",
        "Vá para o quinto dos infernos!",
    ];

    let random_number = rand::thread_rng().gen_range(0..(quotes.len() - 1));
    let random_quote = quotes.get(random_number).expect("Failed to get quote");

    format!("{}", random_quote)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
