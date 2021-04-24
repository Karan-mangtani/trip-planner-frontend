import * as _ from "lodash";
import * as moment from 'moment';

export const extractProp = (obj: any, prop: any, fallback: any) => {
    const res = _.get(obj, prop.trim(), fallback);
    if (res === null)
        return fallback;
    return res;
}

export const formatDate = (date: Date) => {
    return moment(date).format('YYYY-MM-DD H:mm:ss');
};