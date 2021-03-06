const BASE_URL = 'http://54.180.75.68:8000';

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
        const result = await fetch(BASE_URL + '/user/login/', {
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
        if (result.status == 200) {
            alert("로그인 되었습니다!")
            for (const key in response) {
                localStorage.setItem(key, response[key])
            }
            location.href = '../main/main.html'

        }
        else {

            alert("아이디나 비밀번호를 확인 해 주세요!!")
        }
    } else {
        alert("아이디와 패스워드는 8글자가 넘어야 합니다.")
    }
}

async function sign_up() {
    const username = document.getElementById('new_Username').value;
    const userPassword = document.getElementById('new_Password').value;
    const userNickname = document.getElementById('new_Nickname').value;

    if (username.length > 4) {
        const result = await fetch(BASE_URL + '/user/sign_up/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                "username": username,
                "password": userPassword,
                "nickname": userNickname,
            })
        })
        let res = result.json()
        if (result.ok){
            alert("회원가입을 축하합니다!!")
            location.reload()
        }
        else {
            alert("중복되는 아이디나, 닉네임이 있습니다!")
        }
    } else {
        alert("아이디는 4글자 이상이어야 합니다.")
    }

}
