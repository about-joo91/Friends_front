const BASE_URL = 'http://127.0.0.1:8000';


function mypage() {
    location.replace('/won_test/mypage.html')
}

let page_num = 0;
let len_of_posts = 0;



const mb_left = document.querySelector('.mb_left');
window.onload = async function () {
    if (!localStorage.hasOwnProperty('access')) {
        clearInterval(refresh_interval)
        location.replace('/user/sign_page.html')
    }
    token = localStorage.getItem('access');
    try {
        const result = await fetch(BASE_URL + '/joo_test/?page_num=' + page_num, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${token}`,
            },
        })
        let response = await result.json()
        if (result.status === 200) {
            console.log(response)
            const hbb_cur_user = document.querySelector('.hbb_cur_user');
            hbb_cur_user.innerText = response.cur_user.nickname;
            len_of_posts = response.len_of_posts;
            page_num += 1
            let left_html = `<div class="image_wrap_box">`;
            // 포스트들을 불러와 각 스타일을 입히면서 html에 보내줌
            for (let i = 0; i < response.posts.length; i++) {
                let class_idx = parseInt(i % 4)
                let heart_icon = ''
                let color_class = ''
                if (response.posts[i].liked) {
                    heart_icon = 'bi-heart-fill'
                    color_class = 'img_heart_icon_red'
                } else {
                    heart_icon = 'bi-heart'
                    color_class = 'img_heart_icon'
                }
                left_html += `<div class="m_l_img${class_idx}_box">
                <div class="m_l_img${class_idx}_header_box">
                    <i class="bi ` + heart_icon + ` ` + color_class + ` img_heart_icon_${response.posts[i].id}" onclick="like('${response.posts[i].id}')"></i>
                    <div class="m_l_img${class_idx}_back">
                        <div class="m_l_img${class_idx}_header">${response.posts[i].author.nickname}</div>
                        <i class="bi bi-three-dots img_three_dots" id="img_three-dots_${response.posts[i].id}" onclick="img_edit_modal_in('${response.posts[i].id}', '${response.posts[i].author.id}')"></i>
                    </div>
                </div>
                <a href="../../Ko+jin_test/detail.html?post_id=${response.posts[i].id}">
                <img class="m_l_img${class_idx}" src="${response.posts[i].img_url}"/></a>
                <div class="m_l_img${class_idx}_title">${response.posts[i].title}</div>
            </div>`
            }
            left_html += '</div><div style="height:100px;"></div>'
            mb_left.innerHTML = left_html

            // 오른쪽에 나의 가장 최근 포스트를 올려준다.
            const mb_right = document.querySelector('.mb_right');
            if (response.my_post.author != null) {
                if (response.my_post.liked) {
                    heart_icon = 'bi-heart-fill'
                    color_class = 'img_heart_icon_red'
                } else {
                    heart_icon = 'bi-heart'
                    color_class = 'img_heart_icon'
                }
                let right_html = `<div class="mb_r_profile_header_box">
            <i class="bi `+ heart_icon + ` ` + color_class + ` img_heart_icon_${response.my_post.id}" onclick="like('${response.my_post.id}')"></i>
            <div class="mb_r_phb_back">
                <div class="mb_r_profile_header">${response.my_post.author.nickname}</div>
                <i class="bi bi-three-dots img_three_dots" id="img_three-dots_0" onclick="my_last_img_edit_modal_in('${response.my_post.id}')"></i>
            </div>
        </div>
        <img class="mb_r_my_img" src="${response.my_post.img_url}" alt="">
        <div class="mb_r_title">
            ${response.my_post.title}
        </div>`
                mb_right.innerHTML = right_html
            } else {
                mb_right.innerHTML = ''
            }
            const rec_follower_modal_wrapper = document.querySelector('.rec_follower_modal_wrapper');
            rec_html = `<div class="rec_follower_modal"><br>추천 팔로워
                <hr class="solid" style="width:290px">`
            response.recommend_followers.forEach(rec_user => {
                rec_html += `<div class=rfm_nametag>
                    ${rec_user.username}
                    <div class="rfm_follow_btn" onclick="follow('${rec_user.id}')">팔로우</div>
                    </div>
                    `
            })
            rec_html += '</div>'
            rec_follower_modal_wrapper.innerHTML = rec_html
        } else {
            clearInterval(refresh_interval)
            location.replace('/user/sign_page.html')
        }
    } catch (error) {
        alert(error)
        clearInterval(refresh_interval)
        location.replace('/user/sign_page.html')
    }
}
// jwt를 디코딩하는 함수
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
// 쿠키에서 데이터를 가져오는 함수
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
const cur_user_id = parseJwt(localStorage.getItem('access'))['user_id']
const email_modal_wrapper = document.querySelector('.email_modal_wrapper')

// gmail api 인증함수
async function google_auth() {
    const result = await fetch(BASE_URL + '/email_test/', {
        method: 'GET',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            "Authorization": `Bearer ${token}`,
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
            "Authorization": `Bearer ${token}`,
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
        clearInterval(refresh_interval)
        location.reload()
    }
}

// 추천 팔로워 모달

const rec_follower_modal_wrapper = document.querySelector('.rec_follower_modal_wrapper');

function rec_follower_modal_in() {
    rec_follower_modal_wrapper.style.display = 'block';
    mb_left.style.overflow = 'hidden';
}
rec_follower_modal_wrapper.addEventListener('click', function (e) {
    if (e.target.classList.contains('rec_follower_modal_wrapper')) {
        rec_follower_modal_wrapper.style.display = 'none';
        mb_left.style.overflow = 'auto';
    }
})
// 포스트 설정 모달 in
const edit_modal_wrapper = document.getElementById('edit_modal_wrapper');

// 내 이미지 모달
function my_last_img_edit_modal_in(post_id) {
    const img_three_dots = document.getElementById('img_three-dots_0');
    let edit_modal_body = `<div id="edit_modal">
        <div class="edit_modal_btn" onclick="google_auth()">게시글 공유</div>
        <hr style="width: 200px;" dclass="solid">
        <div class="edit_modal_btn edit_modal_red" onclick="delete_post('${post_id}')">삭제</div>
    </div>`
    edit_modal_wrapper.innerHTML = edit_modal_body

    let rect = img_three_dots.getClientRects();
    let el_top = rect[0]['top'];
    let el_left = rect[0]['left'];
    edit_modal.style.top = el_top + 5 + "px";
    edit_modal.style.left = el_left - 200 + "px";
    edit_modal_wrapper.style.display = "block";
    body.style.overflow = "hidden";
}
// 이미지 수정 모달 in
function img_edit_modal_in(post_id, author_id) {
    let edit_modal_body = ``
    if (parseInt(author_id) === parseInt(cur_user_id)) {
        edit_modal_body = `<div id="edit_modal">
                                <div class="edit_modal_btn" onclick="google_auth()">게시글 공유</div>
                                <hr style="width: 200px;" dclass="solid">
                                <div class="edit_modal_btn edit_modal_red" onclick="delete_post('${post_id}')">삭제</div>
                            </div>`
    } else {
        edit_modal_body = `<div id="edit_modal">
            <div class="edit_modal_btn edit_modal_red" onclick="follow('${author_id}')">팔로우 취소</div>
            <hr style="width: 200px;" class="solid">
            <div class="edit_modal_btn" onclick="google_auth()">게시글 공유</div>
        </div>`
    }
    edit_modal_wrapper.innerHTML = edit_modal_body
    const img_three_dots = document.getElementById('img_three-dots_' + post_id);
    const edit_modal = document.getElementById('edit_modal');

    let dots_p_el = img_three_dots.parentElement.parentElement;
    let dots_p_el_style = window.getComputedStyle(dots_p_el, null);
    let dots_p_el_transform_value = dots_p_el_style.getPropertyValue("transform");
    edit_modal.style.transform = dots_p_el_transform_value;


    let rect = img_three_dots.getClientRects();
    let el_top = rect[0]['top'];
    let el_left = rect[0]['left'];
    edit_modal.style.top = el_top + 5 + "px";
    edit_modal.style.left = el_left - 200 + "px";
    edit_modal_wrapper.style.display = "block";
    body.style.overflow = "hidden";
}
// 수정 모달 out 함수
edit_modal_wrapper.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit_modal_wrapper')) {
        edit_modal_wrapper.style.display = "none";
        body.style.overflow = 'auto';
    }
})


// 이메일 모달 out 함수
email_modal_wrapper.addEventListener('click', function (e) {
    if (e.target.classList.contains('email_modal_wrapper')) {
        email_modal_wrapper.style.display = 'none';
        body.style.overflow = "auto";
    }
})
// 업로드 모달 in
const modal_main_wrapper = document.querySelector('.modal_main_wrapper')
function upload_modal_in() {
    console.log("Dddd")
    modal_main_wrapper.style.display = 'flex';
    body.style.overflow = "hidden";
}

// 업로드 모달 out
modal_main_wrapper.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal_main_wrapper')) {
        modal_main_wrapper.style.display = 'none';
        body.style.overflow = "auto";
    }
})
// 업로드 함수 
async function post_upload() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const selectFile = document.getElementById("image_input").files[0];
    let formData = new FormData();
    formData.append('postimg', selectFile);
    formData.append('title', title);
    formData.append('content', content);


    if (title && content && selectFile) {
        const token = localStorage.getItem('access')
        const result = await fetch(BASE_URL + '/joo_test/', {
            method: 'POST',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${token}`,
                'X-CSRFToken': csrftoken,
            },
            body: formData,
        })
        let res = await result.json()
        let event = document.getElementById("event_div")
        event.innerHTML = `<img src="https://bucketfriends.s3.ap-northeast-2.amazonaws.com/${res}"/>`;

        if (result.ok) {
            alert("업로드 성공입니다!")
        }
        else {
            alert(res['messge'])
        }

    } else {
        alert("제목과 내용을 입력해주세요.")
    }
}
// 미리보기
let privew = function (event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        let output = document.getElementById('out_put');
        output.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
};


document.getElementById("title_button").addEventListener('click', () => {
    document.getElementById('title').focus();
})

document.getElementById("content_button").addEventListener('click', () => {
    document.getElementById('content').focus();
})

// 포스트 삭제 함수
async function delete_post(post_id) {
    const result = await fetch(BASE_URL + '/joo_test/' + post_id, {
        method: "DELETE",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
        }
    })
    let response = await result.json()
    alert(response.message)
    location.reload()
}
// 무한 스크롤 함수
async function get_other_posts() {
    if (parseInt(len_of_posts / 4) >= page_num && ((mb_left.scrollTop + mb_left.offsetHeight) >= (mb_left.scrollHeight))) {
        setTimeout(() => {

        }, 2000);
        token = localStorage.getItem('access');
        const result = await fetch(BASE_URL + '/joo_test/?page_num=' + page_num, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${token}`,
            },
        })
        let response = await result.json()
        if (result.status == 200) {
            page_num += 1
            let left_html = `<div class="image_wrap_box">`;
            for (let i = 0; i < response.posts.length; i++) {
                if (response.posts[i].liked) {
                    heart_icon = 'bi-heart-fill'
                    color_class = 'img_heart_icon_red'
                } else {
                    heart_icon = 'bi-heart'
                    color_class = 'img_heart_icon'
                }
                let class_idx = parseInt(i % 4)
                left_html += `<div class="m_l_img${class_idx}_box">
                <div class="m_l_img${class_idx}_header_box">
                    <i class="bi `+ heart_icon + ` "` + color_class + ` img_heart_icon_${response.posts[i].id}" onclick="like('${response.my_post.id}')"></i>
                    <div class="m_l_img${class_idx}_back">
                        <div class="m_l_img${class_idx}_header">${response.posts[i].author.nickname}</div>
                        <i class="bi bi-three-dots img_three_dots" id="img_three-dots_${response.posts[i].id}" onclick="img_edit_modal_in('${response.posts[i].id}', '${response.posts[i].author.id}')"></i>
                    </div>
                </div>
                <a href="../Ko+jin_test/detail.html?post_id=${response.posts[i].id}">
                <img class="m_l_img${class_idx}" src="${response.posts[i].img_url}"/></a>
                <div class="m_l_img${class_idx}_title">${response.posts[i].title}</div>
            </div>`
            }
            left_html += '</div><div style="height:100px;"></div>'
            mb_left.innerHTML += left_html
        }
    }
}

mb_left.addEventListener('scroll', get_other_posts)
// 로그아웃 함수
function logout() {
    localStorage.clear();
    location.replace('/user/sign_in.html')
}
// token을 리프레시하는 함수
async function refresh() {
    url = new URL(BASE_URL + '/joo_test/api/token/refresh/');
    const result = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ 'refresh': localStorage.getItem('refresh') })
    })
    let response = await result.json()
    if (result.status == 200) {
        for (const key in response) {
            localStorage.setItem(key, response[key])
        }
    } else {
        logout()
    }
}
let interval_time = parseInt(60 * 1000 * 4.5)
let refresh_interval = setInterval(() => {
    if (localStorage.getItem('access')) {
        refresh();
    }
}, interval_time);


// 팔로우 기능
async function follow(target_user_id) {
    url = new URL(BASE_URL + '/user/follow/' + target_user_id);
    const result = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            "Access-Control-Allow-Origin": "*",
        },
    })
    let response = await result.json()
    alert(response.message)
    location.reload()
}
function to_mypage() {
    location.href = '/profile/mypage.html'
}

async function like(post_id) {
    url = new URL(BASE_URL + '/won_test/like/' + post_id);
    const result = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            "Access-Control-Allow-Origin": "*",
        },
    })
    if (result.status === 200) {
        const img_heart_icon = document.querySelectorAll('.img_heart_icon_' + post_id);
        for (let i = 0; i < img_heart_icon.length; i++) {
            if (img_heart_icon[i].classList.contains('bi-heart')) {
                img_heart_icon[i].classList.replace('bi-heart', 'bi-heart-fill')
                img_heart_icon[i].style.color = 'red';
            } else {
                img_heart_icon[i].classList.replace('bi-heart-fill', 'bi-heart')
                img_heart_icon[i].style.color = 'white';
            }
        }

    }
}