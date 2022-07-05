//모달
const modalButton = document.querySelector(".modalButton");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".closeModal");
const modal_overlay = document.querySelector(".modal_overlay");

modalButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
});
modal_overlay.addEventListener("click", () => {
    modal.classList.add("hidden");
});


const BASE_URL = 'http://54.180.75.68:8000';


const urlParams = new URLSearchParams(window.location.search);
const post_type = urlParams.get('page_type');

if (post_type === 'liked'){
    URL = BASE_URL + '/won_test/likedpage/' 
}else if (post_type === "saved"){
    URL = BASE_URL + "/won_test/bookmark/"
}else{
    URL = BASE_URL + '/won_test/mypage/'
}


const myimg_list = document.querySelector('.myimg_list');

window.onload = async function(){
    if (!localStorage.hasOwnProperty('access')) {
        location.replace('/user/sign_page.html')
    }

    token = localStorage.getItem('access');
    const myposts = await fetch(URL,{
        method:'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
        }
    })
    let response = await myposts.json()
  
    if (myposts.status==200){
        myposts_html = ``;
        for (let i = 1; i < response.posts.length+1; i++){
            console.log(response.posts.length)
            if (i % 4 == 1){
                myposts_html += `<div class="ml_div">
                                    <img class="ml_same ml_1" src="${response.posts[i-1].img_url}">`
            }else if (i%4==2){
                myposts_html +=`<img class="ml_same ml_2" src="${response.posts[i-1].img_url}"></div>`
            }else if (i%4 ==3){
                myposts_html +=`<div class="ml_div">
                                <img class="ml_same ml_3" src="${response.posts[i-1].img_url}">`
            }else if (i%4 == 0){
                myposts_html += `<img class="ml_same ml_4" src="${response.posts[i-1].img_url}"></div>`
            }
        }
        myimg_list.innerHTML =  myposts_html;
    } else {
        location.replace('/user/sign_page.html')
    }
}

// 로그아웃
function logout() { 
    localStorage.clear(); 
    location.replace('/user/sign_page.html') 
}

const modal_main_wrapper = document.querySelector('.modal_main_wrapper')
const body = document.body;

// 업로드 모달 in
function upload_modal_in() {
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

