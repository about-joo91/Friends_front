const BASE_URL = 'http://127.0.0.1:8000';

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
const csrftoken = get_cookie('csrftoken')


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
        for(let i = 0; i < res.length; i++){
            comment = res[i]
            console.log(comment)
        }
    }
    else {
        alert("댓글 작성이 실패했습니다!!")
    }
}



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