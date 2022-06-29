const BASE_URL = 'http://127.0.0.1:8000';

async function sign_in() {
    const username = document.getElementById('inputUsername').value;
    const password = document.getElementById('inputPassword').value;
    if (username && password) {
        fetch(BASE_URL + '/user/login/', {
            method: "POST",
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        }).then(res => res.json())
            .then(data => {
                for (const key in data) {
                    localStorage.setItem(key, data[key])
                }
                location.replace('/post/main.html')
            })
            .catch(error => {
                alert(error)
            })
    } else {
        alert("아이디와 패스워드를 입력해주세요")
    }
}