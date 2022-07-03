const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

let liked = false
const urlParams = new URLSearchParams(window.location.search);
// const post_id = urlParams.get('id'); //?
const post_id = 1

like_empty.addEventListener('click',()=>{
    like_fill.style.display = 'block';
    like_empty.style.display = 'none';
    alert("좋아요 완료!")
    postLike(post_id)
})

like_fill.addEventListener('click',()=>{
    like_empty.style.display = 'block';
    like_fill.style.display = 'none';
    alert("좋아요 취소 완료!")
    deleteLike(post_id)
})


async function postLike(post_id) {
    console.log(post_id)
    const response = await fetch(`${backend_base_url}/blog/like/${post_id}`, {
        // headers:{
        //     'Authorization':localStorage.getItem("refresh")}, // 모르겠음
        method:"POST",
        headers:{
            Accept:"application/json",
            'Content-type':'application/json'
        },

    })

    if (response.status == 200){
        // window.location.replace(`${frontend_base_url}/login.html`);
        response_json = await response.json()
        return response_json
    }else{
        alert(response.status)
    }
}

async function deleteLike(post_id) {
    const response = await fetch(`${backend_base_url}/blog/like/${post_id}`, {
        method:"DELETE",
        
    })
    if (response.status == 200){
        response_json = await response.json()
        return response_json
    }else{
        alert(response.status)
    }
}

async function getLike(article_id){
    const response = await fetch(`${backend_base_url}/blog/like/${post_id}`,{
        method:'GET',
    })

    if (response.status == 200){
        response_json = await response.json()
        console.log(response_json)
        return response_json
    }else{
        alert(response.status)
    }
}


async function updateLike(){
    const response = await getLike(post_id)
    console.log(response)
    liked = response.liked
    if(!liked){
        like_empty.style.display = 'block';
        like_fill.style.display = 'none';
    }
}

updateLike();