export const getQueryParamString = (queryParamKey: string | string[] | undefined): string | undefined => {
    if (typeof queryParamKey === 'string') {
        return queryParamKey;
    }

    return undefined;
}

export const getQueryParamNumber = (queryParamKey: string | string[] | undefined): number | undefined => {
    if (typeof queryParamKey === 'string') {
        const number = +queryParamKey;
        if (!isNaN(number) && isFinite(number)) {
            return number;
        }
    }

    return undefined;
}