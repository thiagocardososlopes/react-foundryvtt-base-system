export const updateField = (document: any, path: string, value: any) => {
    if (!document) return;
    document.update({ [path]: value });
};