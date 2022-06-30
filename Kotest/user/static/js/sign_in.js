const BASE_URL = 'http://127.0.0.1:8000';

function get_cookie(name) {
    let cookie_value = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookie_value = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookie_value;
}
const csrftoken = get_cookie('csrftoken')

async function sign_in() {
    const username = document.getElementById('inputUsername').value;
    const password = document.getElementById('inputPassword').value;
    if (username && password) {
        const result = await fetch(BASE_URL + '/user/api/token/', {
            method: "POST",
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })

        let response = await result.json()
        if (result.status == 200){
            for (const key in response) {
                localStorage.setItem(key, response[key])
            }
            console.log(response)
            // location.href = 'http//127.0.0.1:5500/Kotest/user/templates/test.html'
        }
        else{

            alert("아이디나 비밀번호를 확인 해 주세요!!")
        }
    } else {
        alert("아이디와 패스워드를 입력해주세요")
    }
}