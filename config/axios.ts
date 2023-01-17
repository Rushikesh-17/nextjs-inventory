import axios from 'axios';

export default axios.create({
    baseURL:process.env.NEXT_AUTH_URL.concat("/api"),
    withCredentials: true,
});
