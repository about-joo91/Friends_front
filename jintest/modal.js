const BASE_URL = 'http://127.0.0.1:8000';
// 쿠키에서 csrf토큰을 가져오는 함수
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

//  csrf토큰 저장
const csrftoken = get_cookie('csrftoken')
async function post_upload() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const selectFile = document.querySelector("#image_input").files[0];
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
                // formdata 는 'content-type'명시하지 않음
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
            },
            body: formData,
        })
        let res = result.json()
        if (result.ok){
            alert("업로드 성공입니다!")
            console.log(res.body)
            console.log(res)
            console.log(res.date)
            // location.reload()   
        }
        else{
            alert(res['messge'])
        }

        
    } else {
        alert("제목과 내용을 입력해주세요.")
    }
}





function setThumbnail(event) {

    var reader = new FileReader();
    reader.onload = function(event) {
    var img = document.createElement("img");
    img.setAttribute("src", event.target.result);
    document.querySelector("div#img_preview").appendChild(img);
    };
    $('#img_preview').empty();
    reader.readAsDataURL(event.target.files[0])

    
}

document.querySelector(".title_button").addEventListener('click',()=>{
    document.getElementById('title').focus();
})

document.querySelector(".content_button").addEventListener('click',()=>{
    document.getElementById('content').focus();
})