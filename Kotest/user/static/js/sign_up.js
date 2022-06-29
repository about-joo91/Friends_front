const BASE_URL = 'http://127.0.0.1:8000';


async function sign_up() {
    const username = document.getElementById('inputUsername').value;
    const userPassword = document.getElementById('inputPassword').value;
    const userNickname = document.getElementById('inputNickname').value;

    if (username) {
        fetch(BASE_URL + '/user/', {
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
        }).then(res => {
            if (res.ok) {
                location.replace('/user/templates/sign_in.html')
            }
        }).catch(error => {
            alert(error)
        })
    } else {
        alert("모든 값을 입력하셔야 합니다.")
    }

}