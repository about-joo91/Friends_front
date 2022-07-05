const BASE_URL = 'http://127.0.0.1:8000';

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




const post_id = "15/"

let bookmark_empty = document.getElementById("empty_bookmark")
let bookmark_fill = document.getElementById("fill_bookmark")


bookmark_empty.addEventListener('click',(async function(){
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/won_test/bookmark/' + post_id,{
        method:'POST',
        mode: 'cors',
        headers:{
            'Authorization' : `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },

    })
    let res = await result.json()
        if (result.ok){
            alert("저장 완료 되었습니다!")
            bookmark_fill.style.display = 'block';
            bookmark_empty.style.display = 'none';
        }   
        else{
            alert(res['messge'])
        }
    }))


bookmark_fill.addEventListener('click',(async function(){
    const token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/won_test/bookmark/' + post_id,{
        method:'DELETE',
        mode: 'cors',
        headers:{
            'Authorization' : `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    })
    let res = await result.json()
        if (result.ok){
            alert("삭제 완료 되었습니다!")
            bookmark_fill.style.display = 'none';
            bookmark_empty.style.display = 'block';
        }   
        else{
            alert(res['messge'])
        }
}))


