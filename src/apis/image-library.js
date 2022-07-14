let imageLib;

import axios from 'axios';
import { getLanguage } from '../utils/Utils';

export default class ImageLibrary {

    static BASE_URL = "https://api.arasaac.org/api";


    static get() {
        return imageLib;
    }

    async search(keyword) {
        const locale = getLanguage();
        const searchPath = `/pictograms/${locale}/search/${keyword}`
        return axios.get(ImageLibrary.BASE_URL + searchPath).then(
            (res) => {
                console.log(res)
                return res.data.
                    filter(item => (!item.violence)).
                    map(item => ({
                        id: item._id,
                        url: `${ImageLibrary.BASE_URL}/pictograms/${item._id}?download=false`,
                    }))
            },
            ()=>([]))

    }
}

imageLib = new ImageLibrary();


