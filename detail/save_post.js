const BASE_URL = 'http://127.0.0.1:8000';

function get_cookie(name) {
    let cookie_value = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookie_value = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookie_value;
}
const token = localStorage.getItem('access')


async function request() {
    const response = await fetch(BASE_URL + "/bookmark_test/",
    {
    method: 'GET',
    headers:{
    'Authorization' : `Bearer ${token}`,
    }
    });
    const data = await response.json();
    for (i in data){
        let items = document.getElementById("items");
        let title = data[i]['bookmark']['title']
        let img_rul = data[i]['bookmark']['img_url']
        let post_id = data[i]['bookmark']['post_id']
    }
    
}

request();