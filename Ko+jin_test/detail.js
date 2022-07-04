const BASE_URL = 'http://127.0.0.1:8000';

let bookmark_empty = document.getElementById("empty_bookmark")
let bookmark_fill = document.getElementById("fill_bookmark")
let like_empty = document.getElementById("empty_like")
let like_fill = document.getElementById("fill_like")

bookmark_empty.addEventListener('click',()=>{
    bookmark_fill.style.display = 'block';
    bookmark_empty.style.display = 'none';
    alert("저장 완료!")
})

bookmark_fill.addEventListener('click',()=>{
    bookmark_empty.style.display = 'block';
    bookmark_fill.style.display = 'none';
    alert("저장 취소 완료!")
})

like_empty.addEventListener('click',()=>{
    like_fill.style.display = 'block';
    like_empty.style.display = 'none';
    alert("좋아요 완료!")
})

like_fill.addEventListener('click',()=>{
    like_empty.style.display = 'block';
    like_fill.style.display = 'none';
    alert("좋아요 취소 완료!")
})
// 쿠키 할당
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
const urlParams = new URLSearchParams(window.location.search); 
const url_post_id = urlParams.get('post_id');
// 서버에서 get으로 댓글을 불러오는 코드
const db_comment_box = document.querySelector('.db_comment_box')
const db_input = document.getElementById('db_input')
const db_title = document.querySelector('.db_title')
const db_content = document.querySelector('.db_content')
window.onload = 
async function get_comment() {
    const result = await fetch(BASE_URL + '/comment/'+ url_post_id, {
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
        console.log(res.post)
        post = res.post[0]

        db_title.innerHTML = post.title
        db_content.innerHTML = post.content
        // 댓글을 불러오는 코드
        for(let i = 0; i < res.comment.length; i++){
            comment = res.comment[i]
            console.log(comment, post)
            if (parseJwt(localStorage.getItem("access")).user_id == comment.user){
                tmp_comment += 
            `<div class="db_comment">
                <div class="db_comment_comment" id="db_comment_comment_${comment.id}">
                ${comment.author}님의 댓글 :(몇시에 달았느냐... ${comment.created_date})<br> ${comment.comment} 
                </div>
                <div class="db_comment_edit" onclick = "edit_click(${comment.id})">
                수정
                </div>
                <div class="db_comment_delete" onclick = "delete_comment(${comment.id})">
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
        db_comment_box.innerHTML = tmp_comment
        db_input.innerHTML +=`
        <input id="new_comment_text" type="text" placeholder="댓글을 입력해주세요">
        <button onclick="make_comment(${comment.post})" class="db_button" type="submit">입력</button>
        `
    }
    else {
        alert("댓글 작성이 실패했습니다!!")
    }
}

// 댓글을 작성하는 코드
async function make_comment(post_id) {
    const comment = document.getElementById('new_comment_text').value;

    if (comment) {
        const result = await fetch(BASE_URL + '/comment/'+ post_id, {
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
            alert("댓글을 달았습니다!!")
            location.href = '../../Ko+jin_test/detail.html'
            // location 할 때 pharams
        }
        else {
            alert("댓글 작성이 실패했습니다!!")
        }
    } else {
        alert("댓글을 입력 해 주세요!!")
    }

}

// 수정 버튼을 눌렀을 경우

function edit_click(comment_id){
    edit_html = `
    <div class="edit_comment"> 
        <textarea class="edit_comment" id="edit_comment_comment_${comment_id}" cols="50" rows="3"></textarea>
        <button class="edit_comment_button" id="edit_comment_btn" onclick="edit_comment_fun(${comment_id})">댓글 수정</button>
    </div>
    `
    const edit_clicked_comment = document.getElementById("db_comment_comment_" + comment_id)
    edit_clicked_comment.innerHTML += edit_html
}

// 댓글을 수정하기 위한 코드
async function edit_comment_fun(comment_id) {
    const edit_comment = document.getElementById('edit_comment_comment_' + comment_id).value;

    if (edit_comment) {
        const result = await fetch(BASE_URL + '/comment/'+ comment_id, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization':"Bearer "+localStorage.getItem("access")
            },
            body: JSON.stringify({
                "comment" : edit_comment
            })
        })
        let res = result.json()
        if (result.status == 200){
            alert("댓글 수정이 되었습니다!")
            location.href = '../../Ko+jin_test/detail.html'
        }
        else {
            alert("댓글 수정이 실패했습니다!!")
        }
    } else {
        alert("수정할 댓글을 입력 해 주세요!!")
    }

}

// 댓글을 삭제하기 위한 코드
async function delete_comment(comment_id) {
    const delete_comment = document.getElementById('db_comment_comment_' + comment_id);

    if (delete_comment) {
        const result = await fetch(BASE_URL + '/comment/'+ comment_id, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization':"Bearer "+localStorage.getItem("access")
            },
            body: JSON.stringify({
            })
        })
        let res = result.json()
        if (result.status == 200){
            alert("댓글이 삭제 되었습니다!!")
            location.href = '../../Ko+jin_test/detail.html'
        }
        else {
            alert("댓글 삭제가 실패했습니다!!")
        }
    } else {
        alert("삭제 할 댓글이 없습니다!!")
    }

}