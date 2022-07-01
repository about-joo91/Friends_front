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

        if (result.ok){
            alert("업로드 성공입니다!")
        }
        else{
            alert(res['messge'])
        }

    } else {
        alert("제목과 내용을 입력해주세요.")
    }
}

let privew = function(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function(){
    let dataURL = reader.result;
    let output = document.getElementById('out_put');
    output.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
};


document.getElementById("title_button").addEventListener('click',()=>{
    document.getElementById('title').focus();
})

document.getElementById("content_button").addEventListener('click',()=>{
    document.getElementById('content').focus();
})