const BASE_URL = "http://54.180.75.68:8000"


let liked = false
const urlParams = new URLSearchParams(window.location.pathname);
const post_id = 14


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
const csrftoken = get_cookie('csrftoken')


async function postLike(post_id){
    const response = await fetch(`${BASE_URL}/won_test/like/${post_id}`,{
        headers:{
            'Authorization' : 'Bearer '+ localStorage.getItem("access"),
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken},
        method:'POST',
        mode: 'cors',
    })

    if (response.status ==200){
        console.log(response)
        response_json = await response.json()
        console.log(response_json)
        return response_json
    }else{
        alert(response.status)
    }
}

async function like(){
    const like_button = document.getElementById("like_button")
    if (like_button.classList.contains('fa-solid')){
        like_button.classList.replace('fa-solid', 'fa-regular')
    }else{
        like_button.classList.replace('fa-regular', 'fa-solid')
    }
    const response = postLike(post_id)
    console.log(response)
}


