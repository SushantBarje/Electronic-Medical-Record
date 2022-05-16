import axios  from "axios";

export default axios.create({
    baseUrl: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});