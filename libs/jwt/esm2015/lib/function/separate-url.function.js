/**
 * Returns the url split into parts, without the separators.
 * Separator between protocol and domain is `://`, and between domain
 * and path is `/`.
 */
export const separateUrl = (url) => {
    const urlMatch = url === null || url === void 0 ? void 0 : url.match(/^((.*):\/\/)?([^/].*?)?(\/(.*))?$/);
    return {
        protocol: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[2],
        domain: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[3],
        path: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[5],
    };
};
//# sourceMappingURL=separate-url.function.js.map