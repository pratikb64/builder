import { createApp } from "vue";

import { Button, FeatherIcon, FormControl, frappeRequest, FrappeUI } from "frappe-ui";
import { telemetryPlugin } from "frappe-ui/frappe";
import { createPinia } from "pinia";
import "./index.css";
import router from "./router";
import "./setupFrappeUIResource";
import "./utils/arrayFunctions";

import App from "@/App.vue";
import BuilderButton from "@/components/Controls/BuilderButton.vue";
import Input from "@/components/Controls/Input.vue";
import { initSocket } from "./socket";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(FrappeUI);
app.use(pinia);
app.use(telemetryPlugin, { app_name: "builder" });

window.name = "frappe-builder";
app.config.globalProperties.window = window;

app.component("Button", Button);
app.component("BuilderButton", BuilderButton);
app.component("FormControl", FormControl);
app.component("BuilderInput", Input);

app.component("FeatherIcon", FeatherIcon);

declare global {
	interface Window {
		is_developer_mode?: boolean;
		builder_version: string;
	}
}

if (window.is_developer_mode && typeof window.is_developer_mode === "string") {
	window.is_developer_mode =
		window.is_developer_mode === "1" ||
		window.is_developer_mode === "True" ||
		(window.is_developer_mode as string).startsWith("{{");
}

if (window.builder_version && window.builder_version.startsWith("{{")) {
	window.builder_version = "develop";
}

let socket;

if (import.meta.env.DEV) {
	frappeRequest({
		url: "/api/method/builder.www._builder.get_context_for_dev",
	}).then((values) => {
		console.log("🚀 ~ values:", values);
		for (let key in values) {
			window[key] = values[key];
		}
		socket = initSocket();
		console.log("🚀 ~ socket:", socket);
		app.config.globalProperties.$socket = socket;
		app.mount("#app");
	});
	console.log("mounted at dev", app.config.globalProperties);
} else {
	socket = initSocket();
	app.config.globalProperties.$socket = socket;
	app.mount("#app");
	console.log("mounted at prod", app.config.globalProperties);
}
