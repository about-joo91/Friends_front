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
// payload에서 user_id를 조회하기 위한 코드
function parseJwt (token) {
    var base64Url = localStorage.getItem("access").split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// 서버에서 get으로 댓글을 불러오는 코드
const comment_list = document.querySelector('.db_comment_box')
window.onload = async function get_commnet() {

    
    const result = await fetch(BASE_URL + '/comment/1', {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization':"Bearer "+localStorage.getItem("access")
        },

    })
    let res = await result.json()
    if (result.status == 200){
        let tmp_comment = ``
        for(let i = 0; i < res.length; i++){
            comment = res[i]
            console.log(comment)
            if (parseJwt(localStorage.getItem("access")).user_id == comment.user){
                tmp_comment += 
            `<div class="db_comment">
                <div class="db_comment_comment">
                ${comment.author}님의 댓글 :<br> ${comment.comment} user_id = ${comment.user} 
                </div>
                <div class="db_comment_edit">
                수정
                </div>
                <div class="db_comment_delete">
                삭제
                </div>
            </div>`
            }
            else {
            tmp_comment += 
            `<div class="db_comment">
                ${comment.author}님의 댓글 :<br> ${comment.comment} user_id = ${comment.user}
            </div>`
            }
        }
        comment_list.innerHTML = tmp_comment
    }
    else {
        alert("댓글 작성이 실패했습니다!!")
    }
}

// 댓글을 작성하는 코드
async function make_comment() {
    const comment = document.getElementById('new_comment').value;

    if (comment) {
        const result = await fetch(BASE_URL + '/comment/1', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization':"Bearer "+localStorage.getItem("access")
            },
            body: JSON.stringify({
                "comment" : comment
            })
        })
        let res = result.json()
        if (result.status == 200){
            location.replace('/comment.html')
        }
        else {
            alert("댓글 작성이 실패했습니다!!")
        }
    } else {
        alert("댓글을 입력 해 주세요!!")
    }

}