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
const csrftoken = get_cookie('csrftoken')

const email_modal_wrapper = document.querySelector('.email_modal_wrapper')

// gmail api 인증함수
async function auth() {
    const result = await fetch(BASE_URL + '/email_test/', {
        method: 'GET',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    })
    let response = await result.json()
    if (result.ok) {
        const em_ef_text = document.getElementById('em_ef_text');
        email_modal_wrapper.style.display = 'block';
        em_ef_text.innerText = response['cur_user_email'];
    }
}
// gmail 보내는 함수
async function send_email() {
    const email_from = document.getElementById('em_ef_text').textContent;
    const email_to = document.getElementById('em_eto_input').value;
    const email_title = document.getElementById('em_eti_input').value;
    const email_content = document.getElementById('em_ec_textarea').value;
    const result = await fetch(BASE_URL + '/email_test/send/', {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'X-CSRFToken': csrftoken,

        },
        body: JSON.stringify({
            "email_from": email_from,
            "email_to": email_to,
            "email_title": email_title,
            "email_content": email_content
        })
    })
    let response = await result.json()
    if (result.ok) {
        alert(response.message)
        location.reload()
    }
}

// 모달 out 함수
email_modal_wrapper.addEventListener('click', function (e) {
    if (e.target.classList.contains('email_modal_wrapper')) {
        email_modal_wrapper.style.display = 'none';
    }
})