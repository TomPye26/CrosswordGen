import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const fetchCrosswordGrid = async (x_size: number, y_size: number) => {
    
    try {
        const resp = await axios.get(
            `${API_URL}/generate_puzzle`,
            {
                params: {x_size, y_size},
                headers: {'Accept': 'application/json'}
            }
        );

        console.log(resp.data)
        return resp.data
    } catch (error) {
        console.error(error)
    }

};
