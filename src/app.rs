use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::spawn_local;
use web_sys::HtmlInputElement;
use yew::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["window", "__TAURI__", "tauri"])]
    // async fn invoke(cmd: &str, args: JsValue) -> JsValue;
    async fn invoke(cmd: &str) -> JsValue;

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[function_component(App)]
pub fn app() -> Html {
    let input_ref = use_node_ref();

    let quote = use_state(|| "Loading quote...".to_string());

    let user_quote = use_state(|| "".to_string());

    let oninput = Callback::from(move |input_event: InputEvent| {
        let target: HtmlInputElement = input_event
            .target()
            .unwrap_throw()
            .dyn_into()
            .unwrap_throw();

        let input_value = target.value().to_string();

        user_quote.set(input_value.clone());
        log(&input_value);
    });

    {
        let quote = quote.clone();

        use_effect_with_deps(
            move |_| {
                spawn_local(async move {
                    quote.set(invoke("start").await.as_string().unwrap());
                });
                || ()
            },
            (),
        );
    }

    html! {
        <main class="container">
            <h1 class="title">
                {"Welcome to "}<i>{"Typas"}</i>{"!"}
            </h1>

            <div class="progress" />

            <code class="quote">
                <p>{(*quote).clone()}</p>
            </code>

            <input
                id="greet-input"
                placeholder="Type here..."
                autoComplete="false"
                ref={input_ref}
                type="text"
                {oninput}
            />

            <div className="row">
                <button>{"Restart"}</button>
            </div>
        </main>
    }
}
