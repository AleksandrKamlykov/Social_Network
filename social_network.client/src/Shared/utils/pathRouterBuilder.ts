export function pathRouterBuilder(
    path: string,
    options?: Record<string, string | number>
) {
    let link = path;

    if (options) {
        link = path.replace(/{{(.*?)}}/g, (_, key) =>
            (options?.[key] || "").toString()
        );
    }

    return link;
}