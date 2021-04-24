import * as moment from 'moment';
import { get, sortBy } from 'lodash';

export const extractProp = (obj: any, prop: any, fallback: any) => {
    const res = get(obj, prop.trim(), fallback);
    if (res === null) {
        return fallback;
    }
    return res;
};

export const formatDate = (date: Date) => {
    return moment(date).format('YYYY-MM-DD H:mm:ss');
};

export const sortList = (list: any, field: any) => {
    return sortBy(list, field);
};
