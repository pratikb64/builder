import { createDocumentResource, frappeRequest, setConfig } from "frappe-ui";
import { getCurrentInstance } from "vue";
setConfig("resourceFetcher", frappeRequest);

let builderSettingsCache: ReturnType<typeof createDocumentResource> | null = null;

function getBuilderSettings() {
	if (!builderSettingsCache) {
		const instance = getCurrentInstance();
		console.log("🚀 ~ getBuilderSettings ~ instance:", instance);
		builderSettingsCache = createDocumentResource(
			{
				doctype: "Builder Settings",
				name: "Builder Settings",
				realtime: true,
			},
			{
				$socket: instance.appContext.config.globalProperties.$socket,
			},
		);
	}
	return builderSettingsCache;
}

const builderSettings = new Proxy({} as ReturnType<typeof createDocumentResource>, {
	get(_, prop) {
		return getBuilderSettings()[prop as keyof typeof builderSettingsCache];
	},
});

export { builderSettings };
