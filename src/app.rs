use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::spawn_local;
use yew::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["window", "__TAURI__", "tauri"])]
    async fn invoke(cmd: &str, args: JsValue) -> JsValue;

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[derive(Serialize, Deserialize)]
struct GreetArgs<'a> {
    name: &'a str,
}

#[function_component(App)]
pub fn app() -> Html {
    let input_ref = use_node_ref();

    let quote = String::from("The quick brown fox jumps over the lazy dog");

    html! {
        <main class="container">
            <h1 className="title">
                {"Welcome to "}<i>{"Typas"}</i>{"!"}
            </h1>

            <div class="progress" />

            <code class="quote">
                <p>{quote}</p>
            </code>

            <input
                id="greet-input"
                //   onChange={(e) => handleType(e)}
                placeholder="Type here..."
                //   maxLength={quote.length}
                autoComplete="false"
                ref={input_ref}
                type="text"
            />

            <div className="row">
                <button>{"Restart"}</button>
            </div>
        </main>
    }
}
