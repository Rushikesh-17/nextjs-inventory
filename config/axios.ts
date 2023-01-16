import axios from 'axios';

export default axios.create({
    baseURL:"https://nextjs-inventory.vercel.app/api",
    withCredentials: true,
});
